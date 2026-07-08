"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Heart, ArrowUpDown, Sparkles } from "lucide-react";
import { showcaseItems } from "@/lib/data/showroom";
import { craftCategories } from "@/lib/site";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { TeaserGate } from "@/components/auth/TeaserGate";
import { teaserContent } from "@/lib/teaser-routes";
import type { CraftId } from "@/types";

type SortOption = "newest" | "popular";

const craftIds = new Set(craftCategories.map((c) => c.id));

const teaser = teaserContent.showroom;

export default function ShowroomPage() {
  return (
    <TeaserGate title={teaser.title} description={teaser.description}>
      <Suspense
        fallback={
          <div className="min-h-screen craft-grid flex items-center justify-center text-muted">
            Loading...
          </div>
        }
      >
        <ShowroomContent />
      </Suspense>
    </TeaserGate>
  );
}

function ShowroomContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [craft, setCraft] = useState(searchParams.get("craft") ?? "all");
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) === "popular" ? "popular" : "newest"
  );

  useEffect(() => {
    const c = searchParams.get("craft");
    if (c && (c === "all" || craftIds.has(c))) setCraft(c);
    else if (!c) setCraft("all");

    const s = searchParams.get("sort");
    if (s === "popular" || s === "newest") setSort(s);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const items = showcaseItems.filter((item) => {
      const matchSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.makerDisplayName.toLowerCase().includes(search.toLowerCase());
      const matchCraft = craft === "all" || item.craft === craft;
      return matchSearch && matchCraft;
    });

    return [...items].sort((a, b) => {
      if (sort === "popular") return b.likes - a.likes;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [search, craft, sort]);

  const craftLabel = (id: CraftId) =>
    craftCategories.find((c) => c.id === id)?.label.split(" & ")[0] ?? id;

  const craftEmoji = (id: CraftId) =>
    craftCategories.find((c) => c.id === id)?.emoji ?? "✨";

  return (
    <div className="craft-grid min-h-screen">
      <div className="bg-gradient-to-b from-yellow-soft via-pink-soft/40 to-transparent py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-2xl">
            <Badge variant="amber" className="mb-4 uppercase tracking-[0.2em]">
              Maker gallery
            </Badge>
            <h1 className="font-display text-4xl font-bold text-purple-dark lg:text-5xl">
              Showroom
            </h1>
            <p className="mt-3 text-muted max-w-xl font-body leading-relaxed">
              Browse finished crafts from craftopia makers — beading, fiber, pottery, and every
              discipline in between. Filter by craft type and discover work worth studying.
            </p>
          </div>
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search crafts, makers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-purple/15 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted shrink-0" />
            <div className="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-purple/8">
              {(["newest", "popular"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setSort(option)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize font-header transition-colors ${
                    sort === option
                      ? "bg-purple-dark text-white"
                      : "text-muted hover:text-purple-dark"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setCraft("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium font-header transition-colors ${
              craft === "all"
                ? "bg-purple text-white"
                : "bg-white text-muted ring-1 ring-purple/10 hover:text-purple-dark"
            }`}
          >
            All crafts
          </button>
          {craftCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCraft(c.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium font-header transition-colors ${
                craft === c.id
                  ? "bg-purple text-white"
                  : "bg-white text-muted ring-1 ring-purple/10 hover:text-purple-dark"
              }`}
            >
              {c.emoji} {c.label.split(" ")[0]}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted mb-6 font-body">
          {filtered.length} piece{filtered.length !== 1 ? "s" : ""} in the showroom
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <Card key={item.id} hover className="group overflow-hidden flex flex-col">
              <Link href={`/profile/${item.makerUsername}`} className="relative aspect-[4/5] block">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <div className="mb-2">
                  <Badge variant="purple" className="capitalize">
                    {craftEmoji(item.craft)} {craftLabel(item.craft)}
                  </Badge>
                </div>
                <h3 className="font-display text-base font-semibold text-purple-dark leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-muted mt-1.5 line-clamp-2 font-body flex-1">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <Link
                    href={`/profile/${item.makerUsername}`}
                    className="flex items-center gap-2 min-w-0 group/maker"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-soft text-xs font-semibold text-purple-dark font-header">
                      {item.makerAvatar}
                    </div>
                    <span className="text-sm font-medium text-purple-dark truncate font-header group-hover/maker:text-pink transition-colors">
                      {item.makerDisplayName}
                    </span>
                  </Link>
                  <span className="flex items-center gap-1 text-xs text-muted shrink-0">
                    <Heart className="h-3.5 w-3.5 text-accent" />
                    {item.likes}
                  </span>
                </div>
                {item.tutorialId && (
                  <Link
                    href="/tutorials"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-dark hover:text-pink font-header"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    See how it&apos;s made
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white/60 px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold text-purple-dark">
              No pieces match your filters
            </p>
            <p className="mt-2 text-sm text-muted font-body">
              Try a different craft type or clear your search.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCraft("all");
              }}
              className="mt-4 rounded-full bg-purple-dark px-5 py-2 text-sm font-medium text-white font-header"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
