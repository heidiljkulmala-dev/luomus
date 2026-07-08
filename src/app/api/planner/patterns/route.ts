import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { parseJsonArray } from "@/lib/json-fields";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patterns = await prisma.customPattern.findMany({
    where: { authorId: session.userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      stitchType: true,
      width: true,
      height: true,
      palette: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(
    patterns.map((p) => ({
      ...p,
      palette: parseJsonArray(p.palette),
      beadCount: null,
    }))
  );
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, stitchType, width, height, grid, palette } = body;

  if (!title?.trim() || !stitchType || !width || !height || !grid) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (width < 2 || width > 80 || height < 2 || height > 80) {
    return NextResponse.json(
      { error: "Grid must be between 2×2 and 80×80" },
      { status: 400 }
    );
  }

  const pattern = await prisma.customPattern.create({
    data: {
      title: title.trim(),
      description: description?.trim() ?? "",
      stitchType,
      width,
      height,
      gridData: JSON.stringify(grid),
      palette: JSON.stringify(palette ?? []),
      authorId: session.userId,
    },
  });

  return NextResponse.json({
    id: pattern.id,
    title: pattern.title,
    description: pattern.description,
    stitchType: pattern.stitchType,
    width: pattern.width,
    height: pattern.height,
    grid: JSON.parse(pattern.gridData),
    palette: parseJsonArray(pattern.palette),
  });
}
