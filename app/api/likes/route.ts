import { NextResponse } from "next/server";
import { getBearerToken, parseToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateCompatibility, countDailyInteractions, getDailyDiscoveryLimit } from "@/lib/matching";

export async function POST(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = parseToken(token);
  const senderId = typeof payload?.sub === "string" ? payload.sub : null;
  if (!senderId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const targetUserId = typeof body?.targetUserId === "string" ? body.targetUserId : null;
    const action = typeof body?.action === "string" ? body.action : "like";

    if (!targetUserId || senderId === targetUserId) {
      return NextResponse.json({ error: "Invalid target profile." }, { status: 400 });
    }

    const currentCount = await countDailyInteractions(senderId);
    const limit = getDailyDiscoveryLimit("free");
    if (currentCount >= limit && action !== "pass") {
      return NextResponse.json({ error: "Daily discovery limit reached." }, { status: 429 });
    }

    if (action === "pass") {
      await prisma.pass.upsert({
        where: { senderId_receiverId: { senderId, receiverId: targetUserId } },
        create: { senderId, receiverId: targetUserId },
        update: {}
      });
      return NextResponse.json({ status: "passed" });
    }

    const existingLike = await prisma.like.upsert({
      where: { senderId_receiverId: { senderId, receiverId: targetUserId } },
      create: { senderId, receiverId: targetUserId },
      update: {}
    });

    const reverseLike = await prisma.like.findUnique({
      where: { senderId_receiverId: { senderId: targetUserId, receiverId: senderId } }
    });

    let match = null;
    if (reverseLike) {
      match = await prisma.match.upsert({
        where: { userAId_userBId: { userAId: senderId, userBId: targetUserId } },
        create: { userAId: senderId, userBId: targetUserId },
        update: { status: "ACTIVE" }
      });
    }

    const sourceProfile = await prisma.profile.findUnique({ where: { userId: senderId } });
    const targetProfile = await prisma.profile.findUnique({ where: { userId: targetUserId } });
    const compatibility = sourceProfile && targetProfile ? calculateCompatibility(sourceProfile, targetProfile) : { score: 0, reasons: [] };

    return NextResponse.json({
      action,
      like: existingLike,
      match,
      compatibility
    });
  } catch (error) {
    return NextResponse.json({ error: "Unable to process action." }, { status: 500 });
  }
}
