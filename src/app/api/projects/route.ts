import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    projects.map((p) => ({
      id: p.id,
      name: p.name,
      patternId: p.patternId,
      progress: p.progress,
      status: p.status,
      startedAt: p.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }))
  );
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, patternId, progress = 0, status = "planning" } = body;

  if (!name?.trim() || !patternId) {
    return NextResponse.json(
      { error: "Name and pattern are required" },
      { status: 400 }
    );
  }

  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      patternId,
      progress,
      status,
      userId: session.userId,
    },
  });

  return NextResponse.json({
    id: project.id,
    name: project.name,
    patternId: project.patternId,
    progress: project.progress,
    status: project.status,
    startedAt: project.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  });
}
