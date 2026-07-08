import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ favorites: [] });
  }

  const favorites = await prisma.patternFavorite.findMany({
    where: { userId: session.userId },
    select: { patternId: true },
  });

  return NextResponse.json({
    favorites: favorites.map((f) => f.patternId),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { patternId } = await request.json();
  if (!patternId) {
    return NextResponse.json({ error: "patternId required" }, { status: 400 });
  }

  await prisma.patternFavorite.upsert({
    where: {
      userId_patternId: { userId: session.userId, patternId },
    },
    update: {},
    create: { userId: session.userId, patternId },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { patternId } = await request.json();
  if (!patternId) {
    return NextResponse.json({ error: "patternId required" }, { status: 400 });
  }

  await prisma.patternFavorite.deleteMany({
    where: { userId: session.userId, patternId },
  });

  return NextResponse.json({ ok: true });
}
