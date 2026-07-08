import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/json-fields";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      _count: { select: { followers: true, following: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      coverImage: user.coverImage,
      specialties: parseJsonArray(user.specialties),
      followers: user._count.followers,
      following: user._count.following,
      joined: user.createdAt.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    },
  });
}
