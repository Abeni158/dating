import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createToken, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

function sanitizeUser(user: { passwordHash?: string | null } & Record<string, unknown>) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = loginSchema.parse(json);

    const user = await prisma.user.findUnique({
      where: { email: data.email.trim().toLowerCase() },
      include: { profiles: true }
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = createToken({ sub: user.id, email: user.email });
    return NextResponse.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Validation failed." }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to sign in. Please try again." }, { status: 500 });
  }
}
