"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Star, ExternalLink, Truck, MapPin, Globe, ChevronDown, Plus, X } from "lucide-react";
import { beadShops, beadTypeKeywords, filterShopsByCountry, isLocalShop } from "@/lib/data/shops";
import { getCountryFlag, getCountryName, getCountryOptions } from "@/lib/geo/countries";
import { useUserCountry } from "@/lib/geo/use-user-country";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button, SMALL_CHIP_ACTIVE_PATTERN, SMALL_CHIP_PATTERN } from "@/components/ui/Button";
import { loadSupplierSubmissions, saveSupplierSubmission } from "@/lib/submissions";
import type { BeadShop } from "@/types";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [showWorldwide, setShowWorldwide] = useState(false);
  const [submittedShops, setSubmittedShops] = useState<BeadShop[]>([]);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    city: "",
    countryCode: "",
    website: "",
    tags: "",
    description: "",
  });
  const { country, detecting, setPreferredCountry } = useUserCountry();
  const allShops = useMemo(() => [...submittedShops, ...beadShops], [submittedShops]);

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setSubmittedShops(loadSupplierSubmissions());
  }, []);

  useEffect(() => {
    if (!country || form.countryCode) return;
    setForm((prev) => ({ ...prev, countryCode: country }));
  }, [country, form.countryCode]);

  useEffect(() => {
    if (searchParams.get("openSubmission") !== "supplier") return;
    if (authLoading) return;

    if (user) {
      setShowSubmissionModal(true);
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("openSubmission");
      const next = nextParams.toString();
      router.replace(next ? `${pathname}?${next}` : pathname);
    }
  }, [authLoading, pathname, router, searchParams, user]);

  const searched = useMemo(() => {
    if (!query.trim()) return allShops;
    const q = query.toLowerCase();
    const keywordMatch = Object.entries(beadTypeKeywords).find(([key]) =>
      q.includes(key)
    );
    if (keywordMatch) {
      const ids = new Set(keywordMatch[1]);
      return allShops.filter(
        (s) => ids.has(s.id) || s.beadTypes.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return allShops.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.beadTypes.some((b) => b.toLowerCase().includes(q)) ||
        s.specialty.toLowerCase().includes(q)
    );
  }, [allShops, query]);

  const results = useMemo(() => {
    if (!country) return searched;
    return filterShopsByCountry(searched, country, showWorldwide);
  }, [searched, country, showWorldwide]);

  const localCount = country
    ? results.filter((s) => isLocalShop(s, country)).length
    : 0;

  function submissionReturnUrl() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("openSubmission", "supplier");
    return `${pathname}?${params.toString()}`;
  }

  function handleOpenSubmission() {
    if (authLoading) return;
    if (!user) {
      router.push(`/auth/sign-in?redirect=${encodeURIComponent(submissionReturnUrl())}`);
      return;
    }
    setSubmitMessage("");
    setShowSubmissionModal(true);
  }

  function handleSubmitSupplier(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const saved = saveSupplierSubmission(form);
    setSubmittedShops((prev) => [saved, ...prev]);
    setSubmitMessage(`Added ${saved.name} to suppliers.`);
    setShowSubmissionModal(false);
    setForm((prev) => ({ ...prev, name: "", city: "", website: "", tags: "", description: "" }));
  }

  return (
    <div className="min-h-screen craft-grid">
      <div className="bg-gradient-to-b from-yellow/10 to-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-header text-4xl font-bold tracking-[-0.035em] text-purple-dark">Supply Finder</h1>
          <p className="mt-3 max-w-xl text-muted font-body">
            Search for any material, brand, or supply — we show suppliers in your country first,
            then global marketplaces.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="mb-6 rounded-2xl border border-purple/15 bg-white/70 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-header text-lg font-semibold text-purple-dark">Own a supply store?</h2>
              <p className="text-sm text-muted font-body">
                Add your store so makers can find your materials.
              </p>
            </div>
            <Button size="lg" onClick={handleOpenSubmission}>
              <Plus className="h-4 w-4" />
              Add your store
            </Button>
          </div>
          {!user && !authLoading && (
            <p className="mt-3 text-xs text-muted">
              Sign in or create an account to submit your supplier listing.
            </p>
          )}
          {submitMessage && <p className="mt-3 text-sm text-accent font-medium">{submitMessage}</p>}
        </div>

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
              className={`ml-auto ${SMALL_CHIP_PATTERN} ${showWorldwide ? SMALL_CHIP_ACTIVE_PATTERN : ""}`}
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
              className={SMALL_CHIP_PATTERN}
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
                    <h3 className="font-header text-xl font-semibold text-purple-dark">{shop.name}</h3>
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

      {showSubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-purple-dark/40 backdrop-blur-sm"
            aria-label="Close add store dialog"
            onClick={() => setShowSubmissionModal(false)}
          />
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border bg-yellow-soft/50 px-5 py-4">
              <h3 className="font-header text-lg font-semibold text-purple-dark">Add your store</h3>
              <button
                type="button"
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-white hover:text-purple-dark"
                onClick={() => setShowSubmissionModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitSupplier} className="space-y-4 p-5">
              <div>
                <label htmlFor="supplier-name" className="mb-1.5 block text-sm font-medium text-purple-dark">
                  Store name
                </label>
                <input
                  id="supplier-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="supplier-city" className="mb-1.5 block text-sm font-medium text-purple-dark">
                    City / location
                  </label>
                  <input
                    id="supplier-city"
                    required
                    value={form.city}
                    onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div>
                  <label htmlFor="supplier-country" className="mb-1.5 block text-sm font-medium text-purple-dark">
                    Country
                  </label>
                  <select
                    id="supplier-country"
                    required
                    value={form.countryCode}
                    onChange={(e) => setForm((prev) => ({ ...prev, countryCode: e.target.value }))}
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {getCountryOptions(form.countryCode || country || undefined).map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.flag} {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="supplier-website" className="mb-1.5 block text-sm font-medium text-purple-dark">
                  Website
                </label>
                <input
                  id="supplier-website"
                  type="url"
                  required
                  placeholder="https://your-store.example"
                  value={form.website}
                  onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div>
                <label htmlFor="supplier-tags" className="mb-1.5 block text-sm font-medium text-purple-dark">
                  Category / tags
                </label>
                <input
                  id="supplier-tags"
                  required
                  placeholder="beads, yarn, fabric"
                  value={form.tags}
                  onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div>
                <label htmlFor="supplier-description" className="mb-1.5 block text-sm font-medium text-purple-dark">
                  Description
                </label>
                <textarea
                  id="supplier-description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full resize-none rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="ghost" onClick={() => setShowSubmissionModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="yellow">
                  Save store
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
