import { NextResponse } from "next/server";
import { z } from "zod";
import { getBearerToken, parseToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const messageSchema = z.object({
  body: z.string().trim().min(1).max(2000)
});

async function getAuthenticatedUser(request: Request) {
  const token = getBearerToken(request);
  const payload = token ? parseToken(token) : null;
  const userId = typeof payload?.sub === "string" ? payload.sub : null;

  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
}

async function getMemberMatch(matchId: string, userId: string) {
  return prisma.match.findFirst({
    where: {
      id: matchId,
      status: "ACTIVE",
      OR: [{ userAId: userId }, { userBId: userId }]
    }
  });
}

export async function GET(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const match = await getMemberMatch(params.matchId, user.id);
  if (!match) return NextResponse.json({ error: "Match not found." }, { status: 404 });

  const url = new URL(request.url);
  const requestedLimit = Number(url.searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50;

  const messages = await prisma.message.findMany({
    where: { matchId: match.id },
    orderBy: { createdAt: "asc" },
    take: limit
  });

  return NextResponse.json({ messages });
}

export async function POST(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const match = await getMemberMatch(params.matchId, user.id);
  if (!match) return NextResponse.json({ error: "Match not found." }, { status: 404 });

  try {
    const data = messageSchema.parse(await request.json());
    const message = await prisma.message.create({
      data: {
        matchId: match.id,
        senderId: user.id,
        body: data.body
      }
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid message." }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to send message." }, { status: 500 });
  }
}
