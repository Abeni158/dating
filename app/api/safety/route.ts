import { NextResponse } from "next/server";
import { z } from "zod";
import { getBearerToken, parseToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const safetySchema = z.object({
  targetUserId: z.string().min(1),
  category: z.enum(["FAKE_PROFILE", "SCAM", "HARASSMENT", "THREAT", "IMPERSONATION", "SPAM", "UNWANTED_SEXUAL_CONTENT", "FINANCIAL_SOLICITATION", "OTHER"]).optional(),
  details: z.string().trim().max(2000).optional()
});

function getUserId(request: Request) {
  const token = getBearerToken(request);
  const payload = token ? parseToken(token) : null;
  return typeof payload?.sub === "string" ? payload.sub : null;
}

export async function POST(request: Request) {
  const reporterId = getUserId(request);
  if (!reporterId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const input = safetySchema.parse(await request.json());
    if (input.targetUserId === reporterId) return NextResponse.json({ error: "You cannot report yourself." }, { status: 400 });

    const target = await prisma.user.findUnique({ where: { id: input.targetUserId }, select: { id: true } });
    if (!target) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

    const report = await prisma.report.create({
      data: {
        reporterId,
        targetUserId: input.targetUserId,
        category: input.category ?? "OTHER",
        details: input.details
      }
    });
    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid report." }, { status: 400 });
    return NextResponse.json({ error: "Unable to submit report." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const blockerId = getUserId(request);
  if (!blockerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const input = z.object({ targetUserId: z.string().min(1) }).parse(await request.json());
    if (input.targetUserId === blockerId) return NextResponse.json({ error: "You cannot block yourself." }, { status: 400 });

    await prisma.$transaction([
      prisma.block.upsert({
        where: { blockerId_blockedId: { blockerId, blockedId: input.targetUserId } },
        create: { blockerId, blockedId: input.targetUserId },
        update: {}
      }),
      prisma.match.updateMany({
        where: { status: "ACTIVE", OR: [{ userAId: blockerId, userBId: input.targetUserId }, { userAId: input.targetUserId, userBId: blockerId }] },
        data: { status: "BLOCKED" }
      })
    ]);
    return NextResponse.json({ status: "blocked" });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid profile." }, { status: 400 });
    return NextResponse.json({ error: "Unable to block profile." }, { status: 500 });
  }
}
