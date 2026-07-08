import type { TradeListingType } from "@/types";

export type TradeMeta = {
  openToTrades: boolean;
  tradeNotes?: string;
};

/** Mock trade preferences keyed by listing title (UI-first overlay on DB records). */
export const craftTradeMeta: Record<string, TradeMeta> = {
  "Sunset Peyote Cuff": {
    openToTrades: true,
    tradeNotes: "Especially interested in fiber arts or pottery.",
  },
  "Galaxy Spiral Bracelet": {
    openToTrades: true,
    tradeNotes: "Happy to swap for embroidery or watercolor pieces.",
  },
  "Crystal Bloom Earrings": {
    openToTrades: false,
  },
  "Botanical Coaster Set": {
    openToTrades: true,
    tradeNotes: "Open to beading or macramé trades.",
  },
  "Matte Bud Vase": {
    openToTrades: true,
    tradeNotes: "Looking for wearable crafts or tutorial access.",
  },
};

export const tutorialTradeMeta: Record<string, TradeMeta> = {
  "Herringbone Wave Necklace — Full Tutorial": {
    openToTrades: true,
    tradeNotes: "Will trade tutorial access for finished jewelry or pottery.",
  },
  "Brick Stitch Flower Petals": {
    openToTrades: true,
    tradeNotes: "Open to craft swaps or sharing another tutorial.",
  },
  "Watercolor Landscapes — Wet-on-Wet Skies": {
    openToTrades: true,
    tradeNotes: "Interested in textile or ceramic trades.",
  },
  "Peyote Stitch Basics — Step by Step": {
    openToTrades: false,
  },
};

export function getCraftTradeMeta(title: string): TradeMeta {
  return craftTradeMeta[title] ?? { openToTrades: false };
}

export function getTutorialTradeMeta(title: string): TradeMeta {
  return tutorialTradeMeta[title] ?? { openToTrades: false };
}

export function listingKey(type: TradeListingType, id: string) {
  return `${type}:${id}`;
}
