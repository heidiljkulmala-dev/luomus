import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTutorialTradeMeta } from "@/lib/data/trades";

export async function GET() {
  const tutorials = await prisma.tutorial.findMany({
    include: {
      author: {
        select: {
          username: true,
          displayName: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    tutorials.map((t) => {
      const trade = getTutorialTradeMeta(t.title);
      return {
        id: t.id,
        type: "tutorial" as const,
        title: t.title,
        description: t.description,
        thumbnail: t.thumbnail,
        duration: t.duration,
        difficulty: t.difficulty,
        views: t.views,
        url: t.url,
        tutorialType: t.type,
        openToTrades: trade.openToTrades,
        tradeNotes: trade.tradeNotes,
        owner: t.author,
      };
    })
  );
}
