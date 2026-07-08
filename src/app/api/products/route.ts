import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCraftTradeMeta } from "@/lib/data/trades";
import { parseJsonArray } from "@/lib/json-fields";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      seller: {
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
    products.map((p) => {
      const trade = getCraftTradeMeta(p.title);
      return {
        id: p.id,
        type: "craft" as const,
        title: p.title,
        description: p.description,
        price: p.price,
        image: p.image,
        materials: parseJsonArray(p.materials),
        openToTrades: trade.openToTrades,
        tradeNotes: trade.tradeNotes,
        seller: p.seller,
      };
    })
  );
}
