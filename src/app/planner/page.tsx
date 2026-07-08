"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Pencil,
  Eraser,
  Undo2,
  Save,
  Plus,
  Trash2,
  Grid3x3,
  Palette,
  Download,
  FolderOpen,
} from "lucide-react";
import { PatternGrid } from "@/components/planner/PatternGrid";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  createEmptyGrid,
  countBeads,
  countColors,
  estimateHours,
  DEFAULT_PALETTE,
  STITCH_OPTIONS,
  type PlannerPattern,
  type PlannerStitchType,
} from "@/lib/planner/types";

const LOCAL_KEY = "luomus-planner-draft";

function defaultPattern(): PlannerPattern {
  return {
    title: "Untitled Pattern",
    description: "",
    stitchType: "peyote",
    width: 16,
    height: 12,
    grid: createEmptyGrid(16, 12),
    palette: [...DEFAULT_PALETTE],
  };
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen craft-grid flex items-center justify-center text-muted">Loading planner...</div>}>
      <PlannerEditor />
    </Suspense>
  );
}

function PlannerEditor() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const patternId = searchParams.get("id");

  const [pattern, setPattern] = useState<PlannerPattern>(defaultPattern);
  const [activeColor, setActiveColor] = useState(DEFAULT_PALETTE[0]);
  const [tool, setTool] = useState<"paint" | "erase">("paint");
  const [history, setHistory] = useState<string[][][]>([]);
  const [savedList, setSavedList] = useState<
    { id: string; title: string; stitchType: string; width: number; height: number; updatedAt: string }[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const pushHistory = useCallback((grid: string[][]) => {
    setHistory((h) => [...h.slice(-30), grid.map((r) => [...r])]);
  }, []);

  const loadSavedList = useCallback(async () => {
    if (!user) return;
    const res = await fetch("/api/planner/patterns");
    if (res.ok) setSavedList(await res.json());
  }, [user]);

  useEffect(() => {
    loadSavedList();
  }, [loadSavedList]);

  useEffect(() => {
    if (patternId && user) {
      fetch(`/api/planner/patterns/${patternId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setPattern(data);
        });
    } else if (!patternId) {
      const draft = localStorage.getItem(LOCAL_KEY);
      if (draft) {
        try {
          setPattern(JSON.parse(draft));
        } catch {
          /* ignore */
        }
      }
    }
  }, [patternId, user]);

  useEffect(() => {
    if (!pattern.id) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(pattern));
    }
  }, [pattern]);

  function updateGrid(updater: (grid: string[][]) => string[][]) {
    setPattern((p) => {
      const nextGrid = updater(p.grid);
      pushHistory(p.grid);
      return { ...p, grid: nextGrid };
    });
  }

  function handleCellChange(row: number, col: number, color: string) {
    updateGrid((grid) => {
      const next = grid.map((r) => [...r]);
      next[row][col] = color;
      return next;
    });
  }

  function undo() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setPattern((p) => ({ ...p, grid: prev.map((r) => [...r]) }));
      return h.slice(0, -1);
    });
  }

  function resizeGrid(width: number, height: number) {
    const w = Math.min(80, Math.max(2, width));
    const h = Math.min(80, Math.max(2, height));
    setPattern((p) => {
      const next = createEmptyGrid(w, h);
      for (let row = 0; row < Math.min(h, p.height); row++) {
        for (let col = 0; col < Math.min(w, p.width); col++) {
          next[row][col] = p.grid[row][col];
        }
      }
      pushHistory(p.grid);
      return { ...p, width: w, height: h, grid: next };
    });
  }

  function fillAll(color: string) {
    updateGrid(() =>
      pattern.grid.map((row) => row.map(() => color))
    );
  }

  function clearGrid() {
    updateGrid(() => createEmptyGrid(pattern.width, pattern.height));
  }

  function addPaletteColor(hex: string) {
    if (pattern.palette.includes(hex)) return;
    setPattern((p) => ({ ...p, palette: [...p.palette, hex] }));
  }

  async function savePattern() {
    if (!user) {
      router.push("/auth/sign-in?redirect=/planner");
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        title: pattern.title,
        description: pattern.description,
        stitchType: pattern.stitchType,
        width: pattern.width,
        height: pattern.height,
        grid: pattern.grid,
        palette: pattern.palette,
      };

      const res = pattern.id
        ? await fetch(`/api/planner/patterns/${pattern.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/planner/patterns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Save failed");
        return;
      }

      setPattern(data);
      localStorage.removeItem(LOCAL_KEY);
      setMessage("Pattern saved!");
      await loadSavedList();
      if (!pattern.id) router.replace(`/planner?id=${data.id}`);
    } finally {
      setSaving(false);
    }
  }

  async function deletePattern(id: string) {
    if (!confirm("Delete this pattern?")) return;
    await fetch(`/api/planner/patterns/${id}`, { method: "DELETE" });
    if (pattern.id === id) {
      setPattern(defaultPattern());
      router.replace("/planner");
    }
    loadSavedList();
  }

  function newPattern() {
    setPattern(defaultPattern());
    setHistory([]);
    router.replace("/planner");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(pattern, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pattern.title.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const beadCount = countBeads(pattern.grid);
  const colorCount = countColors(pattern.grid, pattern.palette);

  return (
    <div className="min-h-screen craft-grid">
      <div className="bg-gradient-to-b from-purple/10 to-transparent py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Badge variant="purple" className="mb-3">Design · Plan · Save</Badge>
          <h1 className="font-display text-4xl font-bold text-purple-dark">Design Studio</h1>
          <p className="mt-2 text-muted max-w-2xl">
            Design your own craft patterns on a visual grid. Pick stitch type, paint colors,
            and save your designs to your account.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar — saved patterns */}
          {user && showSidebar && (
            <aside className="lg:w-64 shrink-0">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-purple-dark text-sm flex items-center gap-1.5">
                    <FolderOpen className="h-4 w-4" /> My patterns
                  </h2>
                  <button onClick={newPattern} className="text-accent hover:text-accent-light" aria-label="New pattern">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {savedList.length === 0 ? (
                    <p className="text-xs text-muted">No saved patterns yet.</p>
                  ) : (
                    savedList.map((p) => (
                      <div
                        key={p.id}
                        className={`rounded-lg p-2 text-sm cursor-pointer transition-colors ${
                          pattern.id === p.id ? "bg-purple/10" : "hover:bg-purple/5"
                        }`}
                      >
                        <Link href={`/planner?id=${p.id}`} className="block">
                          <p className="font-medium text-purple-dark truncate">{p.title}</p>
                          <p className="text-xs text-muted">{p.stitchType} · {p.width}×{p.height}</p>
                        </Link>
                        <button
                          onClick={() => deletePattern(p.id)}
                          className="text-xs text-accent mt-1 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </aside>
          )}

          {/* Main editor */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Toolbar row 1 — meta */}
            <Card className="p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={pattern.title}
                  onChange={(e) => setPattern((p) => ({ ...p, title: e.target.value }))}
                  className="rounded-xl border border-purple/15 bg-white/80 px-4 py-2 text-sm font-semibold text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="Pattern title"
                />
                <select
                  value={pattern.stitchType}
                  onChange={(e) =>
                    setPattern((p) => ({
                      ...p,
                      stitchType: e.target.value as PlannerStitchType,
                    }))
                  }
                  className="rounded-xl border border-purple/15 bg-white/80 px-4 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  {STITCH_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={pattern.description}
                onChange={(e) => setPattern((p) => ({ ...p, description: e.target.value }))}
                className="w-full rounded-xl border border-purple/15 bg-white/80 px-4 py-2 text-sm text-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="Notes (optional) — e.g. cuff, 2-drop peyote, gift for..."
              />
              <p className="text-xs text-muted">
                {STITCH_OPTIONS.find((s) => s.value === pattern.stitchType)?.description}
              </p>
            </Card>

            {/* Toolbar row 2 — tools */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={tool === "paint" ? "primary" : "outline"}
                size="sm"
                onClick={() => setTool("paint")}
              >
                <Pencil className="h-4 w-4" /> Paint
              </Button>
              <Button
                variant={tool === "erase" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setTool("erase")}
              >
                <Eraser className="h-4 w-4" /> Erase
              </Button>
              <Button variant="ghost" size="sm" onClick={undo} disabled={history.length === 0}>
                <Undo2 className="h-4 w-4" /> Undo
              </Button>
              <Button variant="ghost" size="sm" onClick={clearGrid}>
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={exportJson}>
                <Download className="h-4 w-4" /> Export
              </Button>
              <div className="flex-1" />
              <Button variant="secondary" size="sm" onClick={savePattern} disabled={saving}>
                <Save className="h-4 w-4" /> {saving ? "Saving..." : pattern.id ? "Update" : "Save"}
              </Button>
            </div>

            {message && (
              <p className="text-sm text-pink font-medium">{message}</p>
            )}
            {!user && (
              <p className="text-sm text-muted">
                <Link href="/auth/sign-in?redirect=/planner" className="text-accent hover:underline">Sign in</Link> to save patterns to your account. Your draft is kept locally until then.
              </p>
            )}

            {/* Color palette */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="h-4 w-4 text-amber" />
                <span className="text-sm font-medium text-purple-dark">Color palette</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {pattern.palette.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => { setActiveColor(color); setTool("paint"); }}
                    className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
                      activeColor === color && tool === "paint"
                        ? "border-purple scale-110 ring-2 ring-accent/40"
                        : "border-white shadow-md"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
                <label className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-purple/30 hover:border-accent">
                  <Plus className="h-4 w-4 text-muted" />
                  <input
                    type="color"
                    className="sr-only"
                    onChange={(e) => {
                      addPaletteColor(e.target.value);
                      setActiveColor(e.target.value);
                      setTool("paint");
                    }}
                  />
                </label>
                {tool === "paint" && (
                  <Button variant="ghost" size="sm" onClick={() => fillAll(activeColor)}>
                    Fill grid
                  </Button>
                )}
              </div>
            </Card>

            {/* Grid size */}
            <Card className="p-4 flex flex-wrap items-end gap-4">
              <div className="flex items-center gap-2">
                <Grid3x3 className="h-4 w-4 text-pink" />
                <span className="text-sm font-medium text-purple-dark">Grid size</span>
              </div>
              <label className="text-xs text-muted">
                Width
                <input
                  type="number"
                  min={2}
                  max={80}
                  value={pattern.width}
                  onChange={(e) => resizeGrid(Number(e.target.value), pattern.height)}
                  className="ml-2 w-16 rounded-lg border border-purple/15 px-2 py-1 text-sm text-purple-dark"
                />
              </label>
              <label className="text-xs text-muted">
                Height
                <input
                  type="number"
                  min={2}
                  max={80}
                  value={pattern.height}
                  onChange={(e) => resizeGrid(pattern.width, Number(e.target.value))}
                  className="ml-2 w-16 rounded-lg border border-purple/15 px-2 py-1 text-sm text-purple-dark"
                />
              </label>
              <div className="flex flex-wrap gap-2 ml-auto">
                <Badge variant="amber">{beadCount} beads</Badge>
                <Badge variant="amber">{colorCount} colors used</Badge>
                <Badge variant="default">~{estimateHours(beadCount)}h est.</Badge>
              </div>
            </Card>

            {/* Grid canvas */}
            <PatternGrid
              grid={pattern.grid}
              stitchType={pattern.stitchType}
              activeColor={activeColor}
              tool={tool}
              onCellChange={handleCellChange}
            />

            <p className="text-xs text-muted text-center">
              Click or click-and-drag to paint. Peyote and brick rows show stitch offset preview.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
