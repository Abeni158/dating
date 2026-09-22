import { NextResponse } from "next/server";
import { getBearerToken, parseToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = parseToken(token);
  const userId = typeof payload?.sub === "string" ? payload.sub : null;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = Number(new URL(request.url).searchParams.get("limit") ?? "12");

  const users = await prisma.user.findMany({
    where: {
      id: { not: userId },
      profileVisible: true
    },
    include: { profiles: true },
    take: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 25) : 12
  });

  const profiles = users.map((user) => ({
    id: user.id,
    displayName: user.displayName ?? user.firstName ?? "New member",
    country: user.country,
    city: user.city,
    bio: user.bio,
    profile: user.profiles,
    openToInternational: user.openToInternational
  }));

  return NextResponse.json({ profiles });
}
