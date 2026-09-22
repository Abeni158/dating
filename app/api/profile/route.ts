import { NextResponse } from "next/server";
import { z } from "zod";
import { getBearerToken, parseToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validation";

async function requireUser(request: Request) {
  const token = getBearerToken(request);
  if (!token) return null;

  const payload = parseToken(token);
  const userId = typeof payload?.sub === "string" ? payload.sub : null;
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    include: { profiles: true }
  });
}

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      displayName: user.displayName,
      country: user.country,
      city: user.city,
      bio: user.bio,
      profile: user.profiles
    }
  });
}

export async function PATCH(request: Request) {
  const user = await requireUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const data = profileUpdateSchema.parse(json);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: data.firstName ?? undefined,
        displayName: data.displayName ?? undefined,
        country: data.country ?? undefined,
        city: data.city ?? undefined,
        bio: data.bio ?? undefined,
        profileVisible: data.profileVisible ?? undefined,
        openToInternational: data.openToInternational ?? undefined
      }
    });

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        occupation: data.occupation ?? undefined,
        relationshipGoal: data.relationshipGoal ?? undefined,
        languages: data.languages ?? undefined,
        interests: data.interests ?? undefined,
        hobbies: data.hobbies ?? undefined,
        travelInterests: data.travelInterests ?? undefined,
        lifestylePrefs: data.lifestylePrefs ?? undefined,
        datingPrefs: data.datingPrefs ?? undefined
      },
      create: {
        userId: user.id,
        occupation: data.occupation ?? null,
        relationshipGoal: data.relationshipGoal ?? null,
        languages: data.languages ?? [],
        interests: data.interests ?? [],
        hobbies: data.hobbies ?? [],
        travelInterests: data.travelInterests ?? [],
        lifestylePrefs: data.lifestylePrefs ?? [],
        datingPrefs: data.datingPrefs ?? [],
        verificationStatus: "UNVERIFIED"
      }
    });

    return NextResponse.json({ user: updatedUser, profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Validation failed." }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to update profile." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return PATCH(request);
}
