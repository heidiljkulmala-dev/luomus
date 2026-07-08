import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  createSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { initials } from "@/lib/json-fields";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username, displayName } = body;

    if (!email || !password || !username || !displayName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email or username already taken" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username: username.toLowerCase().replace(/\s+/g, "-"),
        displayName,
        avatar: initials(displayName),
      },
    });

    await createSession({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
