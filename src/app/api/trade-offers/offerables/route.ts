import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { TradeOfferable } from "@/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in to view your listings." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      products: { orderBy: { createdAt: "desc" } },
      tutorials: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const items: TradeOfferable[] = [
    ...user.products.map((p) => ({
      id: p.id,
      title: p.title,
      type: "craft" as const,
      image: p.image,
    })),
    ...user.tutorials.map((t) => ({
      id: t.id,
      title: t.title,
      type: "tutorial" as const,
      image: t.thumbnail,
    })),
  ];

  return NextResponse.json({ items });
}
