import { patterns } from "@/lib/data/patterns";
import { beadShops } from "@/lib/data/shops";
import { beadCatalog, toolCatalog } from "@/lib/scanner/bead-catalog";
import { getColorFamilies } from "@/lib/scanner/analyze-image";
import type {
  BeadMatch,
  Difficulty,
  ImageAnalysis,
  ScanResult,
  SupplyHint,
} from "@/types";

function scoreBead(
  bead: (typeof beadCatalog)[0],
  families: string[],
  analysis: ImageAnalysis
): number {
  let score = 0;
  for (const family of families) {
    if (bead.colorFamilies.includes(family)) score += 25;
  }

  if (analysis.isSingleBeadLikely && bead.sizes.includes("4mm")) score += 15;
  if (!analysis.isSingleBeadLikely && bead.sizes.includes("11")) score += 20;
  if (analysis.averageSaturation > 0.45 && bead.finishes.includes("ab")) score += 15;
  if (analysis.averageSaturation > 0.5 && bead.finishes.includes("shiny")) score += 10;
  if (analysis.averageLightness > 0.6 && bead.finishes.includes("matte")) score += 10;
  if (analysis.colorCount > 6 && bead.id === "delica-11-matte") score += 20;
  if (analysis.colorCount > 5 && bead.id === "superduo") score += 15;
  if (analysis.averageLightness > 0.55 && bead.id === "swarovski-bicone") score += 20;

  return Math.min(score, 98);
}

function inferStitch(analysis: ImageAnalysis): { stitch: string; difficulty: Difficulty; patternName: string } {
  if (analysis.isSingleBeadLikely) {
    return {
      stitch: "Single-bead match",
      difficulty: "beginner",
      patternName: "Custom bead match — use in any stitch",
    };
  }
  if (analysis.colorCount > 8) {
    return {
      stitch: "Peyote or Herringbone",
      difficulty: "advanced",
      patternName: "Multi-color gradient piece",
    };
  }
  if (analysis.colorCount > 5) {
    return {
      stitch: "Even-count Peyote",
      difficulty: "intermediate",
      patternName: "Gradient cuff or band",
    };
  }
  if (analysis.averageSaturation > 0.5) {
    return {
      stitch: "Brick Stitch",
      difficulty: "beginner",
      patternName: "Crystal or floral component",
    };
  }
  return {
    stitch: "Right-Angle Weave (RAW)",
    difficulty: "beginner",
    patternName: "Geometric beaded form",
  };
}

function findSimilarPatterns(stitch: string, families: string[]) {
  const stitchKey = stitch.toLowerCase();
  return patterns
    .filter((p) => {
      const matchStitch = stitchKey.includes(p.stitchType.toLowerCase());
      const matchTag = p.tags.some((t) => families.some((f) => t.includes(f.slice(0, 4))));
      return matchStitch || matchTag;
    })
    .slice(0, 3)
    .concat(patterns.slice(0, 1))
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 3);
}

function buildSupplyHints(beads: BeadMatch[], colors: ScanResult["dominantColors"]): SupplyHint[] {
  const hints: SupplyHint[] = [];

  for (const color of colors.slice(0, 3)) {
    hints.push({
      label: `Match "${color.name}" (${color.percentage}% of photo)`,
      detail: `Search for size 11 delicas or seed beads in this shade. Compare under natural light before buying in bulk.`,
      shopSearch: `${color.name} seed beads size 11`,
    });
  }

  if (beads[0]) {
    hints.push({
      label: `Best bead match: ${beads[0].name}`,
      detail: beads[0].description,
      shopSearch: beads[0].searchQuery,
    });
  }

  hints.push({
    label: "Buy a small sample first",
    detail: "Order a 5–10g color sample or mixed pack before committing to a full project quantity.",
    shopSearch: "seed bead sample pack",
  });

  return hints;
}

function buildCreationSteps(
  analysis: ImageAnalysis,
  beads: BeadMatch[],
  stitch: string
): string[] {
  if (analysis.isSingleBeadLikely) {
    return [
      `Identify your bead: our best match is "${beads[0]?.name ?? "a cylinder or round seed bead"}".`,
      "Order a color sample from the suggested shops and compare it to your photo in daylight.",
      "Note the bead size — use a caliper or compare against a known size 11/15 seed.",
      "Search our pattern library for projects using this bead type, or swap it into a pattern you already own.",
      "Pick up beading needles and thread matched to your bead size (size 10–12 needles for 11/0 beads).",
    ];
  }

  return [
    `Gather beads in your detected palette: ${analysis.dominantColors.slice(0, 3).map((c) => c.name).join(", ")}.`,
    `The stitch type looks closest to ${stitch} — check similar patterns below for a starting point.`,
    `Source ${beads[0]?.name ?? "matching seed beads"} from the recommended shops; buy 5–10g per color to start.`,
    "Sort beads by finish (matte vs shiny) before beading — it prevents mismatched sheen in the final piece.",
    "Use a beading mat, proper needles, and waxed thread (Nymo B is a reliable all-rounder).",
    "Finish with a clasp or findings matched to your piece weight — lighter pieces need smaller clasps.",
  ];
}

export function matchSupplies(
  analysis: ImageAnalysis,
  scanMode: "jewelry" | "bead"
): ScanResult {
  const families = getColorFamilies(analysis);
  const { stitch, difficulty, patternName } = inferStitch(analysis);

  const detectedBeads: BeadMatch[] = beadCatalog
    .map((bead) => ({
      ...bead,
      matchScore: scoreBead(bead, families, analysis),
      colorHex: analysis.dominantColors[0]?.hex,
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, scanMode === "bead" ? 4 : 5);

  const shopIds = new Set<string>();
  detectedBeads.forEach((b) => b.shopIds.forEach((id) => shopIds.add(id)));

  const suggestedShops = beadShops
    .filter((s) => shopIds.has(s.id))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const suggestedTools =
    scanMode === "bead"
      ? toolCatalog.slice(0, 3)
      : toolCatalog.filter((t) =>
          stitch.toLowerCase().includes("peyote")
            ? t.name.includes("needle") || t.name.includes("Nymo") || t.name.includes("mat")
            : true
        ).slice(0, 5);

  const similarPatterns = findSimilarPatterns(stitch, families);
  const supplyHints = buildSupplyHints(detectedBeads, analysis.dominantColors);
  const creationSteps = buildCreationSteps(analysis, detectedBeads, stitch);

  const topScore = detectedBeads[0]?.matchScore ?? 70;
  const confidence = Math.min(
    96,
    Math.round(topScore + (analysis.dominantColors.length > 1 ? 5 : 0))
  );

  return {
    scanMode,
    confidence,
    dominantColors: analysis.dominantColors,
    detectedBeads,
    suggestedTools,
    supplyHints,
    patternName,
    stitchType: stitch,
    estimatedDifficulty: difficulty,
    creationSteps,
    suggestedShops,
    similarPatterns,
  };
}
