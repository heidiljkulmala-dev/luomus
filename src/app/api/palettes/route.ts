import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const palettes = await prisma.savedPalette.findMany({
    where: { userId: session.userId },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(
    palettes.map((p) => ({
      id: p.id,
      name: p.name,
      colors: JSON.parse(p.colors) as string[],
    }))
  );
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, colors } = body;

  if (!name?.trim() || !Array.isArray(colors) || colors.length === 0) {
    return NextResponse.json(
      { error: "Name and colors are required" },
      { status: 400 }
    );
  }

  const palette = await prisma.savedPalette.create({
    data: {
      name: name.trim(),
      colors: JSON.stringify(colors),
      userId: session.userId,
    },
  });

  return NextResponse.json({
    id: palette.id,
    name: palette.name,
    colors: JSON.parse(palette.colors),
  });
}
