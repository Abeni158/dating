import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createToken, hashPassword } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";

function sanitizeUser(user: { passwordHash?: string | null } & Record<string, unknown>) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = signupSchema.parse(json);

    const email = data.email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: data.firstName ?? null,
        displayName: data.displayName ?? null,
        country: data.country ?? null,
        city: data.city ?? null,
        bio: data.bio ?? null,
        profileVisible: data.profileVisible ?? true,
        openToInternational: data.openToInternational ?? false,
        profiles: {
          create: {
            age: data.age ?? null,
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
        }
      },
      include: { profiles: true }
    });

    const token = createToken({ sub: user.id, email: user.email });
    return NextResponse.json({ token, user: sanitizeUser(user) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Validation failed." }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to create account. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Signup endpoint is available." });
}
