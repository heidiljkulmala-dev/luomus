import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { parseJsonArray } from "@/lib/json-fields";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const pattern = await prisma.customPattern.findFirst({
    where: { id, authorId: session.userId },
  });

  if (!pattern) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: pattern.id,
    title: pattern.title,
    description: pattern.description,
    stitchType: pattern.stitchType,
    width: pattern.width,
    height: pattern.height,
    grid: JSON.parse(pattern.gridData),
    palette: parseJsonArray(pattern.palette),
    updatedAt: pattern.updatedAt,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.customPattern.findFirst({
    where: { id, authorId: session.userId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const { title, description, stitchType, width, height, grid, palette } = body;

  const pattern = await prisma.customPattern.update({
    where: { id },
    data: {
      title: title?.trim() ?? existing.title,
      description: description?.trim() ?? existing.description,
      stitchType: stitchType ?? existing.stitchType,
      width: width ?? existing.width,
      height: height ?? existing.height,
      gridData: grid ? JSON.stringify(grid) : existing.gridData,
      palette: palette ? JSON.stringify(palette) : existing.palette,
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.customPattern.findFirst({
    where: { id, authorId: session.userId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.customPattern.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
