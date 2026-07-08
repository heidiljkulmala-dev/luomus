import type { CraftId, MarketplaceMaterial } from "@/types";
import type { TradeMeta } from "./trades";

export const materialTradeMeta: Record<string, TradeMeta> = {
  "Miyuki Delica Mix — Sunset Tones": {
    openToTrades: true,
    tradeNotes: "Happy to swap for fiber or pottery supplies.",
  },
  "Merino DK Yarn — Blush & Cream": {
    openToTrades: true,
    tradeNotes: "Will trade for beading thread or fabric scraps.",
  },
  "Stoneware Clay — 5 kg Bag": {
    openToTrades: false,
  },
  "Beading Needle Set (sizes 10–13)": {
    openToTrades: true,
    tradeNotes: "Open to tool swaps with other makers.",
  },
  "Linen Fat Quarters — Floral Pack": {
    openToTrades: false,
  },
  "Seed Bead Soup — 200 g Assorted": {
    openToTrades: true,
    tradeNotes: "Trade for organized color lots or macramé cord.",
  },
  "Pottery Glaze Samples — Matte Neutrals": {
    openToTrades: true,
    tradeNotes: "Looking for underglazes or carving tools.",
  },
  "Soy Wax Flakes — 1 kg": {
    openToTrades: false,
  },
};

export function getMaterialTradeMeta(title: string): TradeMeta {
  return materialTradeMeta[title] ?? { openToTrades: false };
}

const materialsData: Omit<MarketplaceMaterial, "openToTrades" | "tradeNotes">[] = [
  {
    id: "mat-1",
    type: "material",
    title: "Miyuki Delica Mix — Sunset Tones",
    description:
      "Organized lot of size 11 Miyuki delicas in coral, gold, and blush. Perfect for peyote cuffs and loom work.",
    price: 18,
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
    materialType: "beads",
    quantity: "approx. 50 g",
    condition: "leftover",
    craftCategory: "beading",
    seller: { username: "maya-chen", displayName: "Maya Chen", avatar: "MC" },
  },
  {
    id: "mat-2",
    type: "material",
    title: "Merino DK Yarn — Blush & Cream",
    description:
      "Two full skeins plus a half skein of soft merino DK. Gently used for swatches only — no knots.",
    price: 22,
    image:
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=400&fit=crop",
    materialType: "yarn",
    quantity: "3 skeins (~450 g)",
    condition: "leftover",
    craftCategory: "fiber",
    seller: { username: "elena-rossi", displayName: "Elena Rossi", avatar: "ER" },
  },
  {
    id: "mat-3",
    type: "material",
    title: "Stoneware Clay — 5 kg Bag",
    description:
      "Mid-fire stoneware body, never opened. Bought for a workshop that got rescheduled.",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1578749552668-2a709924831a?w=400&h=400&fit=crop",
    materialType: "clay",
    quantity: "5 kg",
    condition: "new",
    craftCategory: "pottery",
    seller: { username: "elena-rossi", displayName: "Elena Rossi", avatar: "ER" },
  },
  {
    id: "mat-4",
    type: "material",
    title: "Beading Needle Set (sizes 10–13)",
    description:
      "Set of 12 English beading needles in a labeled tin. Sizes 10, 11, 12, and 13 — three of each.",
    price: 9,
    image:
      "https://images.unsplash.com/photo-1454415407199-90b0644a563a?w=400&h=400&fit=crop",
    materialType: "tools",
    quantity: "12 needles",
    condition: "new",
    craftCategory: "beading",
    seller: { username: "maya-chen", displayName: "Maya Chen", avatar: "MC" },
  },
  {
    id: "mat-5",
    type: "material",
    title: "Linen Fat Quarters — Floral Pack",
    description:
      "Bundle of five fat quarters in cream, blush, and coral prints. Pre-washed, no shrinkage.",
    price: 16,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    materialType: "fabric",
    quantity: "5 fat quarters",
    condition: "new",
    craftCategory: "sewing",
    seller: { username: "maya-chen", displayName: "Maya Chen", avatar: "MC" },
  },
  {
    id: "mat-6",
    type: "material",
    title: "Seed Bead Soup — 200 g Assorted",
    description:
      "Mixed Czech seed beads in sizes 8/0 and 11/0. Great for practice pieces or freeform work.",
    price: 12,
    image:
      "https://images.unsplash.com/photo-1605100804763-247d67afa167?w=400&h=400&fit=crop",
    materialType: "beads",
    quantity: "200 g",
    condition: "leftover",
    craftCategory: "beading",
    seller: { username: "elena-rossi", displayName: "Elena Rossi", avatar: "ER" },
  },
  {
    id: "mat-7",
    type: "material",
    title: "Pottery Glaze Samples — Matte Neutrals",
    description:
      "Six 100 ml test jars of matte glazes in cream, blush, and warm grey. Fired to cone 6.",
    price: 34,
    image:
      "https://images.unsplash.com/photo-1565193563741-8266032f854a?w=400&h=400&fit=crop",
    materialType: "glaze",
    quantity: "6 × 100 ml",
    condition: "leftover",
    craftCategory: "pottery",
    seller: { username: "elena-rossi", displayName: "Elena Rossi", avatar: "ER" },
  },
  {
    id: "mat-8",
    type: "material",
    title: "Soy Wax Flakes — 1 kg",
    description:
      "Natural soy wax flakes for container candles. One unopened bag from a bulk order.",
    price: 14,
    image:
      "https://images.unsplash.com/photo-1602607290814-5edd8a721097?w=400&h=400&fit=crop",
    materialType: "wax",
    quantity: "1 kg",
    condition: "new",
    craftCategory: "candle",
    seller: { username: "elena-rossi", displayName: "Elena Rossi", avatar: "ER" },
  },
];

export const materialTypeLabels: Record<string, string> = {
  beads: "Beads",
  yarn: "Yarn",
  clay: "Clay",
  tools: "Tools",
  fabric: "Fabric",
  glaze: "Glaze",
  wax: "Wax",
  thread: "Thread",
};

export const craftCategoryLabels: Record<CraftId, string> = {
  beading: "Beading",
  silversmithing: "Silversmithing",
  fiber: "Fiber arts",
  pottery: "Pottery",
  painting: "Painting",
  drawing: "Drawing",
  macrame: "Macramé",
  paper: "Paper crafts",
  sewing: "Sewing",
  wood: "Woodworking",
  candle: "Candle making",
};

export function getMarketplaceMaterials(): MarketplaceMaterial[] {
  return materialsData.map((m) => {
    const trade = getMaterialTradeMeta(m.title);
    return { ...m, ...trade };
  });
}
