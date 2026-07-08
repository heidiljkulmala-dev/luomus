export type PlannerStitchType = "peyote" | "loom" | "brick" | "square";

export type PlannerPattern = {
  id?: string;
  title: string;
  description: string;
  stitchType: PlannerStitchType;
  width: number;
  height: number;
  grid: string[][];
  palette: string[];
};

export const DEFAULT_PALETTE = [
  "#FF6B6B",
  "#E8B86D",
  "#2EC4B6",
  "#2D1B4E",
  "#FFFFFF",
  "#1A535C",
  "#F5D092",
  "#6B4C9A",
];

export const STITCH_OPTIONS: {
  value: PlannerStitchType;
  label: string;
  description: string;
}[] = [
  {
    value: "peyote",
    label: "Peyote",
    description: "Offset rows — classic cuff & band patterns",
  },
  {
    value: "loom",
    label: "Loom / Square",
    description: "Regular grid — bead loom & square stitch",
  },
  {
    value: "brick",
    label: "Brick Stitch",
    description: "Half-offset rows — earrings & shapes",
  },
  {
    value: "square",
    label: "Grid Planner",
    description: "Simple square grid for freeform planning",
  },
];

export function createEmptyGrid(width: number, height: number, fill = "transparent") {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => fill)
  );
}

export function countBeads(grid: string[][]) {
  return grid.flat().filter((c) => c !== "transparent").length;
}

export function countColors(grid: string[][], palette: string[]) {
  const used = new Set(grid.flat().filter((c) => c !== "transparent"));
  return used.size;
}

export function estimateHours(beadCount: number) {
  return Math.max(1, Math.round(beadCount / 300));
}
