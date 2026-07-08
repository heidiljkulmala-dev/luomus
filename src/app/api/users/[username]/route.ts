import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/json-fields";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      products: { orderBy: { createdAt: "desc" } },
      tutorials: { orderBy: { createdAt: "desc" } },
      _count: { select: { followers: true, following: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatar: user.avatar,
    coverImage: user.coverImage,
    location: user.location,
    specialties: parseJsonArray(user.specialties),
    followers: user._count.followers,
    following: user._count.following,
    joined: user.createdAt.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    products: user.products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      image: p.image,
      materials: parseJsonArray(p.materials),
    })),
    tutorials: user.tutorials.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      thumbnail: t.thumbnail,
      duration: t.duration,
      type: t.type,
      url: t.url,
      difficulty: t.difficulty,
      views: t.views,
    })),
  });
}
