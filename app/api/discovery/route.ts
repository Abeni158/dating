import { NextResponse } from "next/server";
import { getBearerToken, parseToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function userIdFromRequest(request: Request) {
  const token = getBearerToken(request);
  const payload = token ? parseToken(token) : null;
  return typeof payload?.sub === "string" ? payload.sub : null;
}

export async function GET(request: Request) {
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await prisma.block.findMany({
    where: { blockerId: userId },
    select: { blockedId: true }
  });
  const blockedIds = blocked.map((item) => item.blockedId);

  const profiles = await prisma.user.findMany({
    where: {
      id: { notIn: [userId, ...blockedIds] },
      profileVisible: true,
      blocksReceived: { none: { blockerId: userId } },
      OR: [
        { openToInternational: true },
        { id: { notIn: blockedIds } }
      ]
    },
    include: { profile: true },
    orderBy: { createdAt: "desc" },
    take: Math.min(Math.max(Number(new URL(request.url).searchParams.get("limit") ?? 12), 1), 25)
  });

  return NextResponse.json({ profiles: profiles.map((user) => ({
    id: user.id,
    displayName: user.displayName ?? user.firstName ?? "New member",
    city: user.city,
    country: user.country,
    bio: user.bio,
    openToInternational: user.openToInternational,
    profile: user.profile
  })) });
}
