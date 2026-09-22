import { NextResponse } from "next/server";
import { getBearerToken, parseToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getUserId(request: Request) {
  const token = getBearerToken(request);
  const payload = token ? parseToken(token) : null;
  return typeof payload?.sub === "string" ? payload.sub : null;
}

export async function GET(request: Request) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const matches = await prisma.match.findMany({
    where: { status: "ACTIVE", OR: [{ userAId: userId }, { userBId: userId }] },
    include: {
      userA: { select: { id: true, displayName: true, firstName: true, city: true, country: true } },
      userB: { select: { id: true, displayName: true, firstName: true, city: true, country: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({
    matches: matches.map((match) => ({
      ...match,
      partner: match.userAId === userId ? match.userB : match.userA,
      lastMessage: match.messages[0] ?? null
    }))
  });
}
