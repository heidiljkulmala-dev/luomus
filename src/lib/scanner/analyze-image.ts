import type { ImageAnalysis } from "@/types";

const COLOR_NAMES: [string, number, number][] = [
  ["Coral Red", 0, 20],
  ["Warm Orange", 20, 40],
  ["Golden Amber", 40, 55],
  ["Sunshine Yellow", 55, 70],
  ["Fresh Green", 70, 150],
  ["Ocean Teal", 150, 190],
  ["Sky Blue", 190, 220],
  ["Royal Purple", 220, 270],
  ["Rose Pink", 270, 330],
  ["Cherry Red", 330, 360],
];

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return { h: h * 360, s, l };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function nameColor(h: number, s: number, l: number) {
  if (s < 0.12) {
    if (l > 0.85) return "Pearl White";
    if (l < 0.2) return "Jet Black";
    return "Silver Grey";
  }
  for (const [name, min, max] of COLOR_NAMES) {
    if (h >= min && h < max) return name;
  }
  return "Mixed Tone";
}

function colorFamily(h: number, s: number, l: number): string {
  if (s < 0.12) return l > 0.7 ? "neutral" : "neutral";
  if (h >= 30 && h < 70) return "warm";
  if (h >= 150 && h < 220) return "cool";
  if (h >= 220 && h < 300) return "jewel";
  if (h >= 15 && h < 45 && s > 0.4) return "earth";
  if (s < 0.35 && l > 0.65) return "pastel";
  return "warm";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function analyzeImage(
  imageSrc: string,
  scanMode: "jewelry" | "bead"
): Promise<ImageAnalysis> {
  const img = await loadImage(imageSrc);
  const size = 120;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not analyze image");

  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  const buckets = new Map<
    string,
    { r: number; g: number; b: number; count: number; h: number; s: number; l: number }
  >();

  let totalSat = 0;
  let totalLight = 0;
  let samples = 0;
  const hueSpread = new Set<string>();

  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 128) continue;

    const { h, s, l } = rgbToHsl(r, g, b);
    if (l < 0.05 || l > 0.98) continue;

    totalSat += s;
    totalLight += l;
    samples++;

    const bucketKey = `${Math.round(h / 18)}-${Math.round(s * 4)}-${Math.round(l * 4)}`;
    hueSpread.add(`${Math.round(h / 25)}`);

    const existing = buckets.get(bucketKey);
    if (existing) {
      existing.r += r;
      existing.g += g;
      existing.b += b;
      existing.count++;
    } else {
      buckets.set(bucketKey, { r, g, b, count: 1, h, s, l });
    }
  }

  const sorted = [...buckets.values()].sort((a, b) => b.count - a.count);
  const total = sorted.reduce((sum, b) => sum + b.count, 0) || 1;

  const dominantColors = sorted.slice(0, scanMode === "bead" ? 3 : 5).map((bucket) => {
    const r = Math.round(bucket.r / bucket.count);
    const g = Math.round(bucket.g / bucket.count);
    const b = Math.round(bucket.b / bucket.count);
    const { h, s, l } = rgbToHsl(r, g, b);
    return {
      hex: rgbToHex(r, g, b),
      name: nameColor(h, s, l),
      percentage: Math.round((bucket.count / total) * 100),
    };
  });

  return {
    dominantColors,
    colorCount: hueSpread.size,
    averageSaturation: samples ? totalSat / samples : 0,
    averageLightness: samples ? totalLight / samples : 0,
    isSingleBeadLikely:
      scanMode === "bead" ||
      (hueSpread.size <= 4 && sorted[0] && sorted[0].count / total > 0.45),
  };
}

export function getColorFamilies(analysis: ImageAnalysis): string[] {
  const families = new Set<string>();
  for (const color of analysis.dominantColors) {
    const r = parseInt(color.hex.slice(1, 3), 16);
    const g = parseInt(color.hex.slice(3, 5), 16);
    const b = parseInt(color.hex.slice(5, 7), 16);
    const { h, s, l } = rgbToHsl(r, g, b);
    families.add(colorFamily(h, s, l));
  }
  return [...families];
}

export { colorFamily, rgbToHsl };
