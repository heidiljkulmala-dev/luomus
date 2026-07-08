"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Package, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  CraftListingCard,
  MaterialListingCard,
  TutorialListingCard,
} from "@/components/marketplace/MarketplaceListingCard";
import { ListingDetailPanel } from "@/components/marketplace/ListingDetailPanel";
import { SellMaterialsModal } from "@/components/marketplace/SellMaterialsModal";
import {
  TradeOfferModal,
  TradeSuccessToast,
} from "@/components/marketplace/TradeOfferModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type {
  MarketplaceCraft,
  MarketplaceListing,
  MarketplaceMaterial,
  MarketplaceTutorial,
  TradeOffer,
} from "@/types";

type ViewFilter = "all" | "trade-friendly";
type CategoryFilter = "all" | "crafts" | "tutorials" | "materials";

export default function MarketplacePage() {
  const { user } = useAuth();
  const [crafts, setCrafts] = useState<MarketplaceCraft[]>([]);
  const [tutorials, setTutorials] = useState<MarketplaceTutorial[]>([]);
  const [materials, setMaterials] = useState<MarketplaceMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [detailListing, setDetailListing] = useState<MarketplaceListing | null>(null);
  const [tradeListing, setTradeListing] = useState<MarketplaceListing | null>(null);
  const [showSellMaterials, setShowSellMaterials] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [myOffers, setMyOffers] = useState<TradeOffer[]>([]);

  const loadListings = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/marketplace/tutorials").then((r) => r.json()),
      fetch("/api/marketplace/materials").then((r) => r.json()),
    ])
      .then(([products, tutorialData, materialData]) => {
        setCrafts(products);
        setTutorials(tutorialData);
        setMaterials(materialData);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadOffers = useCallback(() => {
    if (!user) {
      setMyOffers([]);
      return;
    }
    fetch("/api/trade-offers")
      .then((r) => (r.ok ? r.json() : { offers: [] }))
      .then((data) => setMyOffers(data.offers ?? []));
  }, [user]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const filteredCrafts = useMemo(() => {
    if (viewFilter === "trade-friendly") {
      return crafts.filter((c) => c.openToTrades);
    }
    return crafts;
  }, [crafts, viewFilter]);

  const filteredTutorials = useMemo(() => {
    if (viewFilter === "trade-friendly") {
      return tutorials.filter((t) => t.openToTrades);
    }
    return tutorials;
  }, [tutorials, viewFilter]);

  const filteredMaterials = useMemo(() => {
    if (viewFilter === "trade-friendly") {
      return materials.filter((m) => m.openToTrades);
    }
    return materials;
  }, [materials, viewFilter]);

  const tradeFriendlyCount =
    crafts.filter((c) => c.openToTrades).length +
    tutorials.filter((t) => t.openToTrades).length;

  const showCrafts = categoryFilter === "all" || categoryFilter === "crafts";
  const showTutorials = categoryFilter === "all" || categoryFilter === "tutorials";
  const showMaterials = categoryFilter === "all" || categoryFilter === "materials";
  const isEmpty =
    !loading &&
    ((showCrafts && showTutorials && showMaterials &&
      filteredCrafts.length === 0 &&
      filteredTutorials.length === 0 &&
      filteredMaterials.length === 0) ||
      (showCrafts && !showTutorials && !showMaterials && filteredCrafts.length === 0) ||
      (!showCrafts && showTutorials && !showMaterials && filteredTutorials.length === 0) ||
      (!showCrafts && !showTutorials && showMaterials && filteredMaterials.length === 0));

  function openTrade(listing: MarketplaceListing) {
    if (listing.type === "material") return;
    setTradeListing(listing);
  }

  function handleTradeSuccess() {
    setShowSuccess(true);
    loadOffers();
    window.setTimeout(() => setShowSuccess(false), 5000);
  }

  return (
    <div className="min-h-screen craft-grid">
      <div className="bg-gradient-to-b from-yellow/10 to-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold text-purple-dark">Maker Shop</h1>
              <p className="mt-2 text-muted max-w-xl">
                Shop handmade crafts and craft supplies from Luomus makers — or propose a trade with
                your own craft or tutorial.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button variant="yellow" onClick={() => setShowSellMaterials(true)}>
                <Plus className="h-4 w-4" /> Sell materials
              </Button>
              <div className="flex items-center gap-2 rounded-full bg-white/80 border border-border px-4 py-2 text-sm text-muted">
                <ArrowLeftRight className="h-4 w-4 text-yellow" />
                <span>
                  <strong className="text-purple-dark">{tradeFriendlyCount}</strong> listings open to trades
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "all", label: "All listings" },
                { id: "trade-friendly", label: "Trade-friendly" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewFilter(tab.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  viewFilter === tab.id
                    ? "bg-purple text-white"
                    : "bg-white/80 text-muted hover:bg-purple/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "all", label: "All listings" },
                { id: "crafts", label: "Crafts" },
                { id: "tutorials", label: "Tutorials" },
                { id: "materials", label: "Materials" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  categoryFilter === tab.id
                    ? "bg-yellow text-purple-dark ring-1 ring-yellow/30"
                    : "bg-white/80 text-muted hover:bg-yellow-soft"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {user && myOffers.length > 0 && (
          <div className="mb-8 rounded-2xl border border-border bg-purple-soft/40 p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="font-display text-lg font-bold text-purple-dark">Your trade offers</h2>
              <button
                type="button"
                onClick={loadOffers}
                className="text-xs text-muted hover:text-accent inline-flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>
            <ul className="space-y-2">
              {myOffers.slice(0, 3).map((offer) => (
                <li
                  key={offer.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl bg-white px-4 py-3 text-sm"
                >
                  <span className="text-purple-dark">
                    <strong>{offer.offeredTitle}</strong>
                    <span className="text-muted"> → </span>
                    <strong>{offer.requestedTitle}</strong>
                  </span>
                  <Badge variant={offer.status === "pending" ? "amber" : "accent"}>
                    {offer.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-white/60 animate-pulse" />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="rounded-2xl border border-dashed border-border bg-white/60 p-12 text-center">
            <ArrowLeftRight className="h-10 w-10 text-yellow mx-auto mb-3" />
            <p className="font-display text-lg font-bold text-purple-dark">No listings match</p>
            <p className="text-sm text-muted mt-2">
              Try switching filters or check back as makers mark more items open to trades.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {showCrafts && filteredCrafts.length > 0 && (
              <section>
                {categoryFilter === "all" && (
                  <h2 className="font-display text-xl font-bold text-purple-dark mb-4">Crafts</h2>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCrafts.map((craft) => (
                    <CraftListingCard
                      key={craft.id}
                      craft={craft}
                      onProposeTrade={openTrade}
                      onViewDetail={setDetailListing}
                    />
                  ))}
                </div>
              </section>
            )}

            {showTutorials && filteredTutorials.length > 0 && (
              <section>
                {categoryFilter === "all" && (
                  <h2 className="font-display text-xl font-bold text-purple-dark mb-4">Tutorials</h2>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTutorials.map((tutorial) => (
                    <TutorialListingCard
                      key={tutorial.id}
                      tutorial={tutorial}
                      onProposeTrade={openTrade}
                      onViewDetail={setDetailListing}
                    />
                  ))}
                </div>
              </section>
            )}

            {showMaterials && filteredMaterials.length > 0 && (
              <section>
                {categoryFilter === "all" && (
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-display text-xl font-bold text-purple-dark">Materials & supplies</h2>
                    <Package className="h-5 w-5 text-yellow" />
                  </div>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMaterials.map((material) => (
                    <MaterialListingCard
                      key={material.id}
                      material={material}
                      onViewDetail={setDetailListing}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {detailListing && (
        <ListingDetailPanel
          listing={detailListing}
          onClose={() => setDetailListing(null)}
          onProposeTrade={() => {
            if (detailListing.type !== "material") {
              setTradeListing(detailListing);
              setDetailListing(null);
            }
          }}
        />
      )}

      {showSellMaterials && (
        <SellMaterialsModal onClose={() => setShowSellMaterials(false)} />
      )}

      <TradeOfferModal
        listing={tradeListing}
        onClose={() => setTradeListing(null)}
        onSuccess={handleTradeSuccess}
      />

      {showSuccess && <TradeSuccessToast onDismiss={() => setShowSuccess(false)} />}
    </div>
  );
}
