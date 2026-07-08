"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Star, ExternalLink, Truck, MapPin, Globe, ChevronDown } from "lucide-react";
import { beadShops, beadTypeKeywords, filterShopsByCountry, isLocalShop } from "@/lib/data/shops";
import { getCountryFlag, getCountryName, getCountryOptions } from "@/lib/geo/countries";
import { useUserCountry } from "@/lib/geo/use-user-country";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const popularSearches = [
  "Miyuki delicas",
  "Swarovski crystals",
  "Czech glass",
  "Seed beads",
  "Beading tools",
  "Vintage beads",
];

export default function ShopFinderPage() {
  return (
    <Suspense fallback={<ShopFinderSkeleton />}>
      <ShopFinderContent />
    </Suspense>
  );
}

function ShopFinderSkeleton() {
  return (
    <div className="min-h-screen craft-grid animate-pulse">
      <div className="h-40 bg-purple/5" />
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-4">
        <div className="h-12 rounded-2xl bg-white/60" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/60" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ShopFinderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [showWorldwide, setShowWorldwide] = useState(false);
  const { country, detecting, setPreferredCountry } = useUserCountry();

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  const searched = useMemo(() => {
    if (!query.trim()) return beadShops;
    const q = query.toLowerCase();
    const keywordMatch = Object.entries(beadTypeKeywords).find(([key]) =>
      q.includes(key)
    );
    if (keywordMatch) {
      const ids = new Set(keywordMatch[1]);
      return beadShops.filter((s) => ids.has(s.id));
    }
    return beadShops.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.beadTypes.some((b) => b.toLowerCase().includes(q)) ||
        s.specialty.toLowerCase().includes(q)
    );
  }, [query]);

  const results = useMemo(() => {
    if (!country) return searched;
    return filterShopsByCountry(searched, country, showWorldwide);
  }, [searched, country, showWorldwide]);

  const localCount = country
    ? results.filter((s) => isLocalShop(s, country)).length
    : 0;

  return (
    <div className="min-h-screen craft-grid">
      <div className="bg-gradient-to-b from-yellow/10 to-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-purple-dark">Supply Finder</h1>
          <p className="mt-2 text-muted max-w-xl">
            Search for any material, brand, or supply — we show suppliers in your country first,
            then global marketplaces.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              type="text"
              placeholder='Try "Miyuki delicas" or "Swarovski crystals"...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-purple/15 bg-white/90 pl-12 pr-4 py-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-pink/30"
            />
          </div>

          <div className="relative shrink-0">
            <label htmlFor="country-select" className="sr-only">
              Your country
            </label>
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              {country ? getCountryFlag(country) : "🌐"}
            </div>
            <select
              id="country-select"
              value={country ?? ""}
              disabled={detecting}
              onChange={(e) => setPreferredCountry(e.target.value)}
              className="appearance-none w-full sm:w-56 rounded-2xl border border-purple/15 bg-white/90 pl-11 pr-10 py-4 text-sm font-medium text-purple-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-pink/30 disabled:opacity-60"
            >
              {detecting && <option value="">Detecting location…</option>}
              {getCountryOptions(country).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          </div>
        </div>

        {country && !detecting && (
          <div className="flex flex-wrap items-center gap-3 mb-6 rounded-2xl bg-pink-soft/50 px-4 py-3">
            <MapPin className="h-4 w-4 text-purple-dark shrink-0" />
            <p className="text-sm text-purple-dark font-body">
              Showing suppliers in{" "}
              <span className="font-semibold font-header">
                {getCountryFlag(country)} {getCountryName(country)}
              </span>{" "}
              first
              {localCount > 0 && (
                <span className="text-muted">
                  {" "}
                  · {localCount} local shop{localCount !== 1 ? "s" : ""}
                </span>
              )}
            </p>
            <button
              onClick={() => setShowWorldwide((v) => !v)}
              className={`ml-auto rounded-full px-3 py-1.5 text-xs font-medium transition-colors font-header ${
                showWorldwide
                  ? "bg-purple-dark text-white"
                  : "bg-white/80 text-muted hover:text-purple-dark"
              }`}
            >
              <Globe className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
              {showWorldwide ? "Local first" : "Show worldwide"}
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-10">
          <span className="text-xs text-muted self-center mr-1">Popular:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-purple-dark hover:bg-yellow-soft transition-colors"
            >
              {term}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted mb-6">
          {results.length} shop{results.length !== 1 ? "s" : ""} found
          {query && ` for "${query}"`}
          {country && !showWorldwide && !query && " near you"}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {results.map((shop) => (
            <Card key={shop.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-xl font-semibold text-purple-dark">{shop.name}</h3>
                    {country && isLocalShop(shop, country) && (
                      <Badge variant="amber">In your country</Badge>
                    )}
                  </div>
                  <p className="flex items-center gap-1 text-sm text-muted mt-1">
                    <MapPin className="h-3.5 w-3.5" /> {shop.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-semibold text-purple-dark">{shop.rating}</span>
                </div>
              </div>

              <p className="text-sm text-muted mt-3">{shop.specialty}</p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {shop.beadTypes.map((type) => (
                  <Badge key={type} variant="accent">{type}</Badge>
                ))}
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-purple/8">
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="font-medium text-purple-dark">{shop.priceRange}</span>
                  <span className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5" /> {shop.shipping}
                  </span>
                </div>
                <a href={shop.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    Visit <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
