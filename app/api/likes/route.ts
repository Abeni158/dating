import { NextResponse } from "next/server";
import { z } from "zod";
import { getBearerToken, parseToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateCompatibility, countDailyInteractions, getDailyDiscoveryLimit } from "@/lib/matching";

const actionSchema = z.object({
  targetUserId: z.string().min(1),
  action: z.enum(["like", "pass", "super_like"]).default("like")
});

export async function POST(request: Request) {
  const token = getBearerToken(request);
  const payload = token ? parseToken(token) : null;
  const senderId = typeof payload?.sub === "string" ? payload.sub : null;
  if (!senderId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { targetUserId, action } = actionSchema.parse(await request.json());
    if (senderId === targetUserId) return NextResponse.json({ error: "Invalid target profile." }, { status: 400 });

    const target = await prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true, profileVisible: true } });
    if (!target || !target.profileVisible) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

    const blocked = await prisma.block.findFirst({
      where: { OR: [{ blockerId: senderId, blockedId: targetUserId }, { blockerId: targetUserId, blockedId: senderId }] }
    });
    if (blocked) return NextResponse.json({ error: "This profile is unavailable." }, { status: 403 });

    const limit = getDailyDiscoveryLimit("free");
    if (await countDailyInteractions(senderId) >= limit) {
      return NextResponse.json({ error: "Daily discovery limit reached." }, { status: 429 });
    }

    if (action === "pass") {
      const pass = await prisma.pass.upsert({
        where: { senderId_receiverId: { senderId, receiverId: targetUserId } },
        create: { senderId, receiverId: targetUserId },
        update: {}
      });
      return NextResponse.json({ action, pass });
    }

    const like = await prisma.like.upsert({
      where: { senderId_receiverId: { senderId, receiverId: targetUserId } },
      create: { senderId, receiverId: targetUserId },
      update: {}
    });
    const reverseLike = await prisma.like.findUnique({ where: { senderId_receiverId: { senderId: targetUserId, receiverId: senderId } } });
    let match = null;

    if (reverseLike) {
      const [userAId, userBId] = [senderId, targetUserId].sort();
      match = await prisma.$transaction(async (tx) => {
        const created = await tx.match.upsert({
          where: { userAId_userBId: { userAId, userBId } },
          create: { userAId, userBId },
          update: { status: "ACTIVE" }
        });
        await tx.notification.createMany({
          data: [
            { userId: senderId, type: "MATCH", title: "New match", body: "You have a new mutual match." },
            { userId: targetUserId, type: "MATCH", title: "New match", body: "You have a new mutual match." }
          ]
        });
        return created;
      });
    }

    const [sourceProfile, targetProfile] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: senderId } }),
      prisma.profile.findUnique({ where: { userId: targetUserId } })
    ]);
    const compatibility = sourceProfile && targetProfile ? calculateCompatibility(sourceProfile, targetProfile) : { score: 0, reasons: [] };
    return NextResponse.json({ action, like, match, compatibility });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid discovery action." }, { status: 400 });
    return NextResponse.json({ error: "Unable to process action." }, { status: 500 });
  }
}
