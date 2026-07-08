import type { BeadMatch, ToolMatch } from "@/types";

export type BeadCatalogEntry = BeadMatch & {
  colorFamilies: string[];
  finishes: string[];
  sizes: string[];
};

export const beadCatalog: BeadCatalogEntry[] = [
  {
    id: "delica-11-matte",
    name: "Miyuki Delica Size 11 — Matte",
    description: "Cylinder seed beads with uniform shape, ideal for peyote and geometric work.",
    searchQuery: "Miyuki Delica 11 matte seed beads",
    matchScore: 0,
    shopIds: ["s2", "s3", "s5"],
    colorFamilies: ["warm", "cool", "neutral", "earth"],
    finishes: ["matte"],
    sizes: ["11"],
  },
  {
    id: "delica-11-ab",
    name: "Miyuki Delica Size 11 — AB Finish",
    description: "Aurora borealis coating adds shimmer; great for gradient cuffs and earrings.",
    searchQuery: "Miyuki Delica 11 AB aurora borealis",
    matchScore: 0,
    shopIds: ["s2", "s3", "s5"],
    colorFamilies: ["warm", "cool", "jewel"],
    finishes: ["ab", "shiny"],
    sizes: ["11"],
  },
  {
    id: "seed-15",
    name: "Miyuki Seed Bead Size 15",
    description: "Tiny round seeds for delicate floral and fine detail work.",
    searchQuery: "Miyuki seed bead size 15",
    matchScore: 0,
    shopIds: ["s2", "s3", "s4"],
    colorFamilies: ["warm", "cool", "neutral", "pastel"],
    finishes: ["matte", "shiny", "galvanized"],
    sizes: ["15"],
  },
  {
    id: "swarovski-bicone",
    name: "Swarovski Bicone Crystal 4mm",
    description: "Faceted crystal beads — common in brick-stitch floral earrings.",
    searchQuery: "Swarovski bicone crystal 4mm",
    matchScore: 0,
    shopIds: ["s1", "s3", "s5"],
    colorFamilies: ["jewel", "cool", "neutral"],
    finishes: ["crystal", "shiny"],
    sizes: ["4mm"],
  },
  {
    id: "czech-fire-polished",
    name: "Czech Fire-Polished Round 4mm",
    description: "Affordable round beads with a soft glow; popular in RAW rings and ropes.",
    searchQuery: "Czech fire polished beads 4mm",
    matchScore: 0,
    shopIds: ["s3", "s5", "s4"],
    colorFamilies: ["warm", "cool", "earth", "jewel"],
    finishes: ["shiny", "matte"],
    sizes: ["4mm", "6mm"],
  },
  {
    id: "superduo",
    name: "SuperDuo Czech Glass 2.5×5mm",
    description: "Two-hole beads for herringbone, netting, and textured statement pieces.",
    searchQuery: "SuperDuo Czech two hole beads",
    matchScore: 0,
    shopIds: ["s5", "s3"],
    colorFamilies: ["warm", "cool", "earth", "jewel"],
    finishes: ["matte", "shiny", "luster"],
    sizes: ["2.5x5"],
  },
  {
    id: "charlotte-cut",
    name: "Charlotte Cut Seed Bead Size 13",
    description: "One flat facet catches light — vintage look for classic ropes and fringes.",
    searchQuery: "Charlotte cut seed beads size 13",
    matchScore: 0,
    shopIds: ["s4", "s6"],
    colorFamilies: ["earth", "warm", "neutral"],
    finishes: ["cut", "shiny"],
    sizes: ["13"],
  },
  {
    id: "magatama",
    name: "Miyuki Long Magatama",
    description: "Teardrop shape with off-center hole — adds texture to fringe and boho designs.",
    searchQuery: "Miyuki long magatama beads",
    matchScore: 0,
    shopIds: ["s2", "s5"],
    colorFamilies: ["warm", "cool", "earth"],
    finishes: ["matte", "shiny", "metallic"],
    sizes: ["4mm"],
  },
];

export const toolCatalog: ToolMatch[] = [
  {
    name: "Beading needles (sizes 10 & 12)",
    purpose: "Essential for peyote, brick stitch, and most off-loom weaving.",
    searchQuery: "beading needles size 10 12",
    shopIds: ["s1", "s3", "s5"],
  },
  {
    name: "Nymo beading thread (B or D)",
    purpose: "Waxed nylon thread — durable for cuffs, earrings, and necklaces.",
    searchQuery: "Nymo beading thread size B",
    shopIds: ["s1", "s3", "s5"],
  },
  {
    name: "Beading mat & tray",
    purpose: "Keeps beads from rolling; sort colors before you start.",
    searchQuery: "beading mat tray set",
    shopIds: ["s1", "s3", "s5"],
  },
  {
    name: "Chain-nose pliers",
    purpose: "Attach clasps, open jump rings, and finish jewelry cleanly.",
    searchQuery: "chain nose pliers jewelry making",
    shopIds: ["s1", "s3"],
  },
  {
    name: "Crimp beads & clasp set",
    purpose: "Finish necklaces and bracelets with a secure professional closure.",
    searchQuery: "crimp beads lobster clasp set",
    shopIds: ["s1", "s3", "s5"],
  },
  {
    name: "Beading awl",
    purpose: "Helpful for tight peyote rows and correcting stitch direction.",
    searchQuery: "beading awl tool",
    shopIds: ["s3", "s5"],
  },
];
