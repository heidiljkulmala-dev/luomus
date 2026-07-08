"use client";

import { cn } from "@/lib/utils";
import type { PlannerStitchType } from "@/lib/planner/types";

type Props = {
  grid: string[][];
  stitchType: PlannerStitchType;
  activeColor: string;
  tool: "paint" | "erase";
  onCellChange: (row: number, col: number, color: string) => void;
  readOnly?: boolean;
};

function cellOffset(stitchType: PlannerStitchType, row: number) {
  if (stitchType === "peyote" && row % 2 === 1) return "translate-x-[50%]";
  if (stitchType === "brick" && row % 2 === 1) return "translate-x-[25%]";
  return "";
}

export function PatternGrid({
  grid,
  stitchType,
  activeColor,
  tool,
  onCellChange,
  readOnly = false,
}: Props) {
  const cellSize =
    grid[0]?.length > 40 ? 10 : grid[0]?.length > 28 ? 12 : grid[0]?.length > 18 ? 14 : 18;

  function paint(row: number, col: number) {
    if (readOnly) return;
    onCellChange(row, col, tool === "erase" ? "transparent" : activeColor);
  }

  return (
    <div className="overflow-auto rounded-xl border border-purple/10 bg-purple-soft/40 p-4">
      <div className="inline-block min-w-full">
        {grid.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={cn("flex", cellOffset(stitchType, rowIndex))}
            style={{ marginBottom: stitchType === "peyote" ? -cellSize * 0.35 : 2 }}
          >
            {row.map((color, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                disabled={readOnly}
                onMouseDown={() => paint(rowIndex, colIndex)}
                onMouseEnter={(e) => {
                  if (e.buttons === 1) paint(rowIndex, colIndex);
                }}
                className={cn(
                  "shrink-0 rounded-full border transition-transform hover:scale-110 disabled:cursor-default",
                  color === "transparent"
                    ? "border-purple/15 bg-white/60"
                    : "border-purple/20 shadow-sm"
                )}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: color === "transparent" ? undefined : color,
                }}
                aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
