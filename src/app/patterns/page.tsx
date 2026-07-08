"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Heart, Clock, Sparkles } from "lucide-react";
import { patterns } from "@/lib/data/patterns";
import { craftCategories } from "@/lib/site";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Difficulty } from "@/types";

const difficulties: (Difficulty | "all")[] = ["all", "beginner", "intermediate", "advanced"];

export default function PatternsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen craft-grid flex items-center justify-center text-muted">Loading...</div>}>
      <PatternsContent />
    </Suspense>
  );
}

function PatternsContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [craft, setCraft] = useState(searchParams.get("craft") ?? "all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const c = searchParams.get("craft");
    if (c) setCraft(c);
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/favorites").then((r) => r.json()).then((d) => setFavorites(new Set(d.favorites ?? [])));
  }, [user]);

  const filtered = useMemo(() => {
    return patterns.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.includes(search.toLowerCase()));
      const matchDiff = difficulty === "all" || p.difficulty === difficulty;
      const matchCraft = craft === "all" || p.craft === craft;
      return matchSearch && matchDiff && matchCraft;
    });
  }, [search, difficulty, craft]);

  async function toggleFavorite(id: string) {
    if (!user) return;
    const isFav = favorites.has(id);
    await fetch("/api/favorites", {
      method: isFav ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patternId: id }),
    });
    setFavorites((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const diffBadge = (d: Difficulty) =>
    d === "beginner" ? "accent" : d === "intermediate" ? "amber" : "purple";

  return (
    <div className="craft-grid min-h-screen">
      <div className="bg-gradient-to-b from-purple-soft to-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-purple-dark">Explore templates</h1>
          <p className="mt-2 text-muted max-w-xl">
            Project ideas and patterns for every craft — filter by discipline, skill, or technique.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <Link
          href="/traditional-crafts"
          className="mb-8 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-yellow-soft via-pink-soft/60 to-purple-soft/40 p-5 transition-opacity hover:opacity-90"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-dark/70 font-header">
              Heritage making
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-purple-dark">
              Browse traditional crafts by continent
            </p>
            <p className="mt-1 text-sm text-muted font-body">
              From Zulu beadwork to Aran knitting — explore techniques rooted in culture and place.
            </p>
          </div>
          <span className="shrink-0 text-2xl">🌍</span>
        </Link>

        <div className="relative max-w-xl mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search projects, tags, techniques..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-purple/15 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink/30"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setCraft("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${craft === "all" ? "bg-purple text-white" : "bg-white text-muted border border-purple/10"}`}
          >
            All crafts
          </button>
          {craftCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCraft(c.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${craft === c.id ? "bg-purple text-white" : "bg-white text-muted border border-purple/10"}`}
            >
              {c.emoji} {c.label.split(" ")[0]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize ${difficulty === d ? "bg-purple-dark text-white" : "bg-white text-muted border border-purple/10"}`}
            >
              {d}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted mb-6">{filtered.length} templates</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pattern) => (
            <Card key={pattern.id} hover className="group overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image src={pattern.image} alt={pattern.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="33vw" />
                {user && (
                  <button
                    onClick={() => toggleFavorite(pattern.id)}
                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md"
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(pattern.id) ? "fill-accent text-accent" : "text-purple-dark"}`} />
                  </button>
                )}
              </div>
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <Badge variant="purple" className="capitalize">{pattern.craft}</Badge>
                  <Badge variant={diffBadge(pattern.difficulty)}>{pattern.difficulty}</Badge>
                </div>
                <h3 className="font-display text-lg font-semibold text-purple-dark">{pattern.title}</h3>
                <p className="text-sm text-muted mt-2 line-clamp-2">{pattern.description}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple/8 text-xs text-muted">
                  <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> {pattern.stitchType}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{pattern.estimatedHours}h</span>
                  <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-accent" /> {pattern.likes}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
