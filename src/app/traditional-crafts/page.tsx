"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Globe2 } from "lucide-react";
import { continents, traditionalCrafts, type ContinentId } from "@/lib/data/traditional-crafts";
import { craftCategories } from "@/lib/site";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const continentIds = new Set(continents.map((c) => c.id));

export default function TraditionalCraftsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen craft-grid flex items-center justify-center text-muted">Loading...</div>}>
      <TraditionalCraftsContent />
    </Suspense>
  );
}

function TraditionalCraftsContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("continent");
  const [continent, setContinent] = useState<ContinentId | "all">(
    initial && continentIds.has(initial as ContinentId) ? (initial as ContinentId) : "all"
  );

  useEffect(() => {
    const c = searchParams.get("continent");
    if (c && continentIds.has(c as ContinentId)) setContinent(c as ContinentId);
    else if (!c) setContinent("all");
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (continent === "all") return traditionalCrafts;
    return traditionalCrafts.filter((c) => c.continent === continent);
  }, [continent]);

  const craftLabel = (id: string) =>
    craftCategories.find((c) => c.id === id)?.label.split(" & ")[0] ?? id;

  return (
    <div className="craft-grid min-h-screen">
      <div className="bg-gradient-to-b from-yellow/15 via-pink-soft/30 to-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/patterns"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-purple-dark mb-4 font-header"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to crafts
          </Link>
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-soft text-purple-dark">
              <Globe2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-purple-dark">
                Traditional crafts by continent
              </h1>
              <p className="mt-2 text-muted max-w-2xl font-body">
                Explore heritage making traditions from around the world — techniques, histories,
                and cultural roots passed down through generations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setContinent("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium font-header transition-colors ${
              continent === "all"
                ? "bg-purple-dark text-white"
                : "bg-white text-muted border border-purple/10 hover:text-purple-dark"
            }`}
          >
            All continents
          </button>
          {continents.map((c) => (
            <button
              key={c.id}
              onClick={() => setContinent(c.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium font-header transition-colors ${
                continent === c.id
                  ? "bg-purple text-white"
                  : "bg-white text-muted border border-purple/10 hover:text-purple-dark"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {continent !== "all" && (
          <p className="text-sm text-muted mb-6 font-body">
            {filtered.length} tradition{filtered.length !== 1 ? "s" : ""} from{" "}
            {continents.find((c) => c.id === continent)?.label}
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((craft) => {
            const cont = continents.find((c) => c.id === craft.continent);
            return (
              <Card key={craft.id} hover className="group overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={craft.image}
                    alt={craft.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="33vw"
                  />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="amber">
                      {cont?.emoji} {cont?.label}
                    </Badge>
                    <Badge variant="purple">{craftLabel(craft.craft)}</Badge>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-purple-dark">
                    {craft.name}
                  </h3>
                  <p className="text-xs text-muted mt-1 font-body">
                    {craft.country}
                    {craft.region ? ` · ${craft.region}` : ""}
                  </p>
                  <p className="text-sm text-muted mt-3 line-clamp-2 font-body">
                    {craft.description}
                  </p>
                  <p className="text-xs text-muted mt-3 line-clamp-2 font-body italic">
                    {craft.history}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {craft.techniques.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-yellow-soft/80 px-2.5 py-0.5 text-xs text-purple-dark font-header"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/patterns?craft=${craft.craft}`}
                    className="mt-4 inline-block text-xs font-semibold text-purple-dark hover:text-pink font-header"
                  >
                    Explore {craftLabel(craft.craft)} projects →
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
