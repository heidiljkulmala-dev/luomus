"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowLeftRight, Clock, Package, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TradeBadge } from "@/components/marketplace/TradeBadge";
import { craftCategoryLabels, materialTypeLabels } from "@/lib/data/materials";
import { formatNumber, formatPrice } from "@/lib/utils";
import type { MarketplaceListing } from "@/types";

type ListingDetailPanelProps = {
  listing: MarketplaceListing;
  onClose: () => void;
  onProposeTrade: () => void;
};

export function ListingDetailPanel({ listing, onClose, onProposeTrade }: ListingDetailPanelProps) {
  const isCraft = listing.type === "craft";
  const isMaterial = listing.type === "material";
  const image = isCraft || isMaterial ? listing.image : listing.thumbnail;
  const owner = isCraft || isMaterial ? listing.seller : listing.owner;

  const typeLabel = isCraft ? "Handmade craft" : isMaterial ? "Craft material" : "Tutorial";

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Close listing details"
        className="absolute inset-0 bg-purple-dark/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="relative w-full max-w-md bg-surface border-l border-border shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-surface/95 backdrop-blur border-b border-border">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-purple-dark"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {listing.openToTrades && <TradeBadge compact />}
        </div>

        <div className="relative aspect-square">
          <Image src={image} alt={listing.title} fill className="object-cover" sizes="400px" />
        </div>

        <div className="p-5 space-y-4">
          <div>
            <Badge variant={isMaterial ? "amber" : "accent"} className="mb-2">
              {isMaterial && <Package className="h-3 w-3 mr-1 inline" />}
              {typeLabel}
            </Badge>
            <h2 className="font-display text-2xl font-bold text-purple-dark">{listing.title}</h2>
            <p className="text-sm text-muted mt-1">
              by{" "}
              <Link href={`/profile/${owner.username}`} className="hover:text-accent">
                {owner.displayName}
              </Link>
            </p>
          </div>

          <p className="text-sm text-muted">{listing.description}</p>

          {listing.tradeNotes && listing.openToTrades && (
            <div className="rounded-xl bg-yellow-soft/60 border border-yellow/30 px-4 py-3">
              <p className="text-xs font-medium text-purple-dark mb-1">Trade preferences</p>
              <p className="text-sm text-muted">{listing.tradeNotes}</p>
            </div>
          )}

          {isCraft ? (
            <>
              <div className="flex flex-wrap gap-1">
                {listing.materials.map((m) => (
                  <Badge key={m} variant="default">{m}</Badge>
                ))}
              </div>
              <p className="font-display text-2xl font-bold text-purple-dark">
                {formatPrice(listing.price)}
              </p>
            </>
          ) : isMaterial ? (
            <>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-yellow-soft/40 border border-yellow/20 px-3 py-2">
                  <p className="text-xs text-muted">Type</p>
                  <p className="font-medium text-purple-dark">
                    {materialTypeLabels[listing.materialType] ?? listing.materialType}
                  </p>
                </div>
                <div className="rounded-xl bg-yellow-soft/40 border border-yellow/20 px-3 py-2">
                  <p className="text-xs text-muted">Quantity</p>
                  <p className="font-medium text-purple-dark">{listing.quantity}</p>
                </div>
                <div className="rounded-xl bg-yellow-soft/40 border border-yellow/20 px-3 py-2">
                  <p className="text-xs text-muted">Condition</p>
                  <p className="font-medium text-purple-dark capitalize">{listing.condition}</p>
                </div>
                <div className="rounded-xl bg-yellow-soft/40 border border-yellow/20 px-3 py-2">
                  <p className="text-xs text-muted">For</p>
                  <p className="font-medium text-purple-dark">
                    {craftCategoryLabels[listing.craftCategory]}
                  </p>
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-purple-dark">
                {formatPrice(listing.price)}
              </p>
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {listing.duration}
              </span>
              <Badge variant="purple">{listing.difficulty}</Badge>
              <span>{formatNumber(listing.views)} views</span>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            {listing.openToTrades && !isMaterial && (
              <Button variant="yellow" onClick={onProposeTrade}>
                <ArrowLeftRight className="h-4 w-4" /> Propose a trade
              </Button>
            )}
            {(isCraft || isMaterial) && (
              <Button>
                <ShoppingBag className="h-4 w-4" /> Buy now
              </Button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
