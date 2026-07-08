import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { inferCraftFromTags } from "@/lib/data/community";
import { parseJsonArray, timeAgo } from "@/lib/json-fields";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const craft = searchParams.get("craft");

  const posts = await prisma.communityPost.findMany({
    where: category && category !== "all" ? { category } : undefined,
    include: {
      author: {
        select: { username: true, displayName: true, avatar: true },
      },
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = posts.map((post) => {
    const tags = parseJsonArray(post.tags);
    const inferredCraft = inferCraftFromTags(tags);
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      craft: inferredCraft,
      tags,
      likes: post.likes,
      replies: post._count.replies,
      createdAt: timeAgo(post.createdAt),
      author: post.author.displayName,
      avatar: post.author.avatar,
      username: post.author.username,
    };
  });

  const filtered =
    craft && craft !== "all"
      ? mapped.filter((post) => post.craft === craft)
      : mapped;

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, category = "discussion", tags = [] } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "Title and content are required" },
      { status: 400 }
    );
  }

  const post = await prisma.communityPost.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      category,
      tags: JSON.stringify(tags),
      authorId: session.userId,
    },
    include: {
      author: {
        select: { username: true, displayName: true, avatar: true },
      },
      _count: { select: { replies: true } },
    },
  });

  return NextResponse.json({
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    tags: parseJsonArray(post.tags),
    likes: post.likes,
    replies: post._count.replies,
    createdAt: "just now",
    author: post.author.displayName,
    avatar: post.author.avatar,
    username: post.author.username,
  });
}
