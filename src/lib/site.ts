export const site = {
  name: "craftopia",
  tagline: "Craft. Share. Connect.",
  description:
    "A global community for crafters to connect, share ideas, and showcase their work. Find tutorials, buy and sell handmade crafts, discover suppliers near and far, explore different ways of making, and join the forum.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
} as const;

export const craftCategories = [
  { id: "beading", label: "Beading & Jewelry", emoji: "📿", color: "purple" as const },
  { id: "silversmithing", label: "Silversmithing & Metalwork", emoji: "⚒️", color: "accent" as const },
  { id: "fiber", label: "Knitting & Crochet", emoji: "🧶", color: "accent" as const },
  { id: "pottery", label: "Pottery & Ceramics", emoji: "🏺", color: "amber" as const },
  { id: "painting", label: "Painting", emoji: "🎨", color: "amber" as const },
  { id: "drawing", label: "Drawing & Illustration", emoji: "✏️", color: "purple" as const },
  { id: "macrame", label: "Macramé & Weaving", emoji: "🪢", color: "purple" as const },
  { id: "paper", label: "Paper & Scrapbooking", emoji: "✂️", color: "accent" as const },
  { id: "sewing", label: "Sewing & Embroidery", emoji: "🧵", color: "amber" as const },
  { id: "wood", label: "Wood & Carving", emoji: "🪵", color: "amber" as const },
  { id: "candle", label: "Candles & Soap", emoji: "🕯️", color: "purple" as const },
];
