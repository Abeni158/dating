import { NextResponse } from "next/server";
import { z } from "zod";
import { getBearerToken, parseToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const actionSchema = z.object({ action: z.enum(["UNMATCH", "READ"] ) });

export async function PATCH(request: Request, { params }: { params: { matchId: string } }) {
  const token = getBearerToken(request);
  const payload = token ? parseToken(token) : null;
  const userId = typeof payload?.sub === "string" ? payload.sub : null;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const match = await prisma.match.findFirst({
    where: { id: params.matchId, OR: [{ userAId: userId }, { userBId: userId }] }
  });
  if (!match) return NextResponse.json({ error: "Match not found." }, { status: 404 });

  try {
    const { action } = actionSchema.parse(await request.json());
    if (action === "UNMATCH") {
      const updated = await prisma.match.update({ where: { id: match.id }, data: { status: "UNMATCHED" } });
      return NextResponse.json({ match: updated });
    }

    const otherUserId = match.userAId === userId ? match.userBId : match.userAId;
    await prisma.message.updateMany({
      where: { matchId: match.id, senderId: otherUserId, readAt: null },
      data: { readAt: new Date() }
    });
    return NextResponse.json({ status: "read" });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid match action." }, { status: 400 });
    return NextResponse.json({ error: "Unable to update match." }, { status: 500 });
  }
}
