import type { BeadShop } from "@/types";

export const beadShops: BeadShop[] = [
  {
    id: "s1",
    name: "Michaels",
    website: "https://www.michaels.com",
    location: "US & Canada · Stores + Online",
    countryCodes: ["US", "CA"],
    beadTypes: ["General crafts", "Yarn", "Paint", "Framing"],
    priceRange: "$$",
    rating: 4.4,
    shipping: "Free over $59",
    specialty: "Everything for makers — all craft types",
  },
  {
    id: "s2",
    name: "Etsy",
    website: "https://www.etsy.com",
    location: "Global marketplace",
    countryCodes: ["GLOBAL"],
    beadTypes: ["Handmade", "Vintage", "Supplies", "Tools"],
    priceRange: "$$",
    rating: 4.8,
    shipping: "Varies by seller",
    specialty: "Unique artisan materials worldwide",
  },
  {
    id: "s3",
    name: "Blick Art Materials",
    website: "https://www.dickblick.com",
    location: "US · Stores + Online",
    countryCodes: ["US"],
    beadTypes: ["Paint", "Canvas", "Drawing", "Printmaking"],
    priceRange: "$$",
    rating: 4.7,
    shipping: "Free over $69",
    specialty: "Professional paint and craft supplies",
  },
  {
    id: "s4",
    name: "Joann Fabrics",
    website: "https://www.joann.com",
    location: "US · Stores + Online",
    countryCodes: ["US"],
    beadTypes: ["Fabric", "Yarn", "Sewing", "Seasonal"],
    priceRange: "$",
    rating: 4.3,
    shipping: "Free over $99",
    specialty: "Sewing, fiber crafts, and seasonal making",
  },
  {
    id: "s5",
    name: "Fire Mountain Gems",
    website: "https://www.firemountaingems.com",
    location: "Online · USA",
    countryCodes: ["US"],
    beadTypes: ["Seed beads", "Crystals", "Findings", "Jewelry"],
    priceRange: "$$",
    rating: 4.7,
    shipping: "Free over $35",
    specialty: "Beading & jewelry making",
  },
  {
    id: "s6",
    name: "Axner Pottery Supply",
    website: "https://www.axner.com",
    location: "Online · USA",
    countryCodes: ["US"],
    beadTypes: ["Clay", "Glazes", "Tools", "Kilns"],
    priceRange: "$$$",
    rating: 4.6,
    shipping: "Calculated at checkout",
    specialty: "Pottery and ceramics supplies",
  },
  {
    id: "s7",
    name: "Hobbycraft",
    website: "https://www.hobbycraft.co.uk",
    location: "UK · Stores + Online",
    countryCodes: ["GB"],
    beadTypes: ["General crafts", "Yarn", "Paint", "Kids crafts"],
    priceRange: "$$",
    rating: 4.5,
    shipping: "Free over £25",
    specialty: "UK's leading craft superstore chain",
  },
  {
    id: "s8",
    name: "Cultura",
    website: "https://www.cultura.com",
    location: "France · Stores + Online",
    countryCodes: ["FR"],
    beadTypes: ["Art supplies", "Yarn", "Paper crafts", "DIY"],
    priceRange: "$$",
    rating: 4.4,
    shipping: "Click & collect available",
    specialty: "French creative leisure and art materials",
  },
  {
    id: "s9",
    name: "Tokyu Hands",
    website: "https://www.tokyu-hands.co.jp",
    location: "Japan · Department stores",
    countryCodes: ["JP"],
    beadTypes: ["Tools", "Paper", "Fabric", "Stationery"],
    priceRange: "$$",
    rating: 4.6,
    shipping: "In-store + online",
    specialty: "Japanese DIY and lifestyle craft goods",
  },
  {
    id: "s10",
    name: "Spotlight",
    website: "https://www.spotlightstores.com",
    location: "Australia & NZ · Stores + Online",
    countryCodes: ["AU", "NZ"],
    beadTypes: ["Fabric", "Yarn", "Sewing", "Home craft"],
    priceRange: "$",
    rating: 4.2,
    shipping: "Free over $120 AUD",
    specialty: "Fabric, haberdashery, and maker essentials",
  },
  {
    id: "s11",
    name: "ItsyBitsy",
    website: "https://www.itsybitsy.in",
    location: "India · Online + stores",
    countryCodes: ["IN"],
    beadTypes: ["Paper crafts", "Beads", "Mixed media", "Decoupage"],
    priceRange: "$",
    rating: 4.5,
    shipping: "Pan-India delivery",
    specialty: "India's craft supplies destination",
  },
  {
    id: "s12",
    name: "Panduro",
    website: "https://www.panduro.com",
    location: "Nordics · Stores + Online",
    countryCodes: ["FI", "SE", "NO", "DK"],
    beadTypes: ["Yarn", "Beads", "Paint", "Kids crafts"],
    priceRange: "$$",
    rating: 4.5,
    shipping: "Free over €50",
    specialty: "Scandinavian craft chain for all ages",
  },
  {
    id: "s13",
    name: "Casa das Ideias",
    website: "https://www.casadasideias.com.br",
    location: "Brazil · Online",
    countryCodes: ["BR"],
    beadTypes: ["Beads", "Fabric", "Paint", "Scrapbooking"],
    priceRange: "$",
    rating: 4.3,
    shipping: "Nationwide Brazil",
    specialty: "Brazilian craft supplies and creative kits",
  },
  {
    id: "s14",
    name: "Creative Yarn",
    website: "https://www.creativeyarn.co.za",
    location: "South Africa · Online",
    countryCodes: ["ZA"],
    beadTypes: ["Yarn", "Hooks", "Patterns", "Fiber"],
    priceRange: "$$",
    rating: 4.4,
    shipping: "South Africa delivery",
    specialty: "Yarn and fiber crafts for southern Africa",
  },
  {
    id: "s15",
    name: "Modulor",
    website: "https://www.modulor.de",
    location: "Germany · Berlin store + Online",
    countryCodes: ["DE"],
    beadTypes: ["Paper", "Wood", "Tools", "Model making"],
    priceRange: "$$$",
    rating: 4.7,
    shipping: "EU shipping available",
    specialty: "Design-oriented craft and model materials",
  },
];

export const beadTypeKeywords: Record<string, string[]> = {
  yarn: ["s1", "s2", "s4", "s7", "s10", "s12", "s14"],
  knit: ["s1", "s2", "s4", "s12", "s14"],
  crochet: ["s1", "s4", "s12", "s14"],
  paint: ["s1", "s3", "s7", "s8"],
  watercolor: ["s3"],
  canvas: ["s3"],
  drawing: ["s1", "s3", "s8"],
  sketching: ["s1", "s3"],
  pencil: ["s1", "s3"],
  charcoal: ["s3"],
  ink: ["s3"],
  silver: ["s2", "s5", "s11"],
  silversmithing: ["s2", "s5", "s11"],
  metalwork: ["s2", "s5"],
  soldering: ["s1", "s2", "s5"],
  clay: ["s1", "s6"],
  pottery: ["s6"],
  ceramic: ["s6"],
  bead: ["s1", "s2", "s5", "s11", "s12", "s13"],
  delica: ["s5"],
  miyuki: ["s5"],
  fabric: ["s2", "s4", "s9", "s10", "s13"],
  sewing: ["s4", "s10"],
  embroidery: ["s4", "s9"],
  macrame: ["s1", "s2", "s9"],
  candle: ["s1", "s2", "s7"],
  soap: ["s2"],
  wood: ["s1", "s2", "s15"],
  paper: ["s1", "s3", "s9", "s11", "s15"],
  tool: ["s1", "s3", "s4", "s9", "s15"],
  craft: ["s1", "s2", "s4", "s7", "s8", "s12"],
};

export function isGlobalShop(shop: BeadShop): boolean {
  return shop.countryCodes.includes("GLOBAL");
}

export function shopMatchesCountry(shop: BeadShop, countryCode: string): boolean {
  if (isGlobalShop(shop)) return true;
  return shop.countryCodes.includes(countryCode);
}

export function isLocalShop(shop: BeadShop, countryCode: string): boolean {
  return !isGlobalShop(shop) && shop.countryCodes.includes(countryCode);
}

export function sortShopsByCountry(shops: BeadShop[], countryCode: string): BeadShop[] {
  return [...shops].sort((a, b) => {
    const rank = (shop: BeadShop) => {
      if (isLocalShop(shop, countryCode)) return 0;
      if (isGlobalShop(shop)) return 1;
      return 2;
    };
    const diff = rank(a) - rank(b);
    if (diff !== 0) return diff;
    return b.rating - a.rating;
  });
}

export function filterShopsByCountry(
  shops: BeadShop[],
  countryCode: string,
  showWorldwide: boolean
): BeadShop[] {
  const filtered = showWorldwide
    ? shops
    : shops.filter((s) => isLocalShop(s, countryCode) || isGlobalShop(s));
  return sortShopsByCountry(filtered, countryCode);
}
