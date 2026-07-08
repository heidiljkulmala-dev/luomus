"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftRight, CheckCircle2, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { MarketplaceListing, TradeOfferable } from "@/types";

type TradeOfferModalProps = {
  listing: MarketplaceListing | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function TradeOfferModal({ listing, onClose, onSuccess }: TradeOfferModalProps) {
  const { user, loading: authLoading } = useAuth();
  const [offerables, setOfferables] = useState<TradeOfferable[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [offeredId, setOfferedId] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listing || !user) {
      setOfferables([]);
      setOfferedId("");
      return;
    }

    setLoadingItems(true);
    fetch("/api/trade-offers/offerables")
      .then((r) => r.json())
      .then((data) => {
        const items = (data.items ?? []) as TradeOfferable[];
        setOfferables(items);
        setOfferedId(items[0]?.id ?? "");
      })
      .finally(() => setLoadingItems(false));
  }, [listing, user]);

  useEffect(() => {
    if (!listing) return;
    const ownerName =
      listing.type === "tutorial" ? listing.owner.displayName : listing.seller.displayName;
    setMessage(
      `Hi ${ownerName}! I'd love to trade my craft for your ${listing.title}. Let me know if you're interested!`
    );
    setError(null);
  }, [listing]);

  if (!listing) return null;

  const image =
    listing.type === "craft" || listing.type === "material"
      ? listing.image
      : listing.thumbnail;
  const owner = listing.type === "tutorial" ? listing.owner : listing.seller;
  const selected = offerables.find((o) => o.id === offeredId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !offeredId || !selected) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/trade-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          offeredType: selected.type,
          offeredId: selected.id,
          requestedType: listing!.type === "craft" ? "craft" : "tutorial",
          requestedId: listing!.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not send trade offer.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close trade offer dialog"
        className="absolute inset-0 bg-purple-dark/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-surface border border-border shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-purple-soft/50">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-accent" />
            <h2 className="font-display text-lg font-bold text-purple-dark">Propose a trade</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted hover:bg-white hover:text-purple-dark transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          <div className="flex gap-4 rounded-xl bg-purple-soft/40 p-3 border border-border">
            <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden">
              <Image src={image} alt={listing.title} fill className="object-cover" sizes="80px" />
            </div>
            <div className="min-w-0">
              <Badge variant="accent" className="mb-1">
                {listing.type === "craft" ? "Craft listing" : "Tutorial"}
              </Badge>
              <p className="font-semibold text-purple-dark line-clamp-2">{listing.title}</p>
              <p className="text-xs text-muted mt-1">
                by{" "}
                <Link href={`/profile/${owner.username}`} className="hover:text-accent">
                  {owner.displayName}
                </Link>
              </p>
              {listing.tradeNotes && (
                <p className="text-xs text-muted mt-2 italic">{listing.tradeNotes}</p>
              )}
            </div>
          </div>

          {authLoading ? (
            <p className="text-sm text-muted text-center py-6">Loading…</p>
          ) : !user ? (
            <div className="rounded-xl border border-border bg-white p-5 text-center space-y-3">
              <p className="text-sm text-muted">
                Sign in to offer one of your crafts or tutorials in exchange.
              </p>
              <Link href="/auth/sign-in?redirect=/marketplace">
                <Button variant="secondary">Sign in</Button>
              </Link>
            </div>
          ) : (
            <form id="trade-offer-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="offered-item" className="block text-sm font-medium text-purple-dark mb-2">
                  What you&apos;re offering
                </label>
                {loadingItems ? (
                  <div className="h-10 rounded-md bg-purple-soft/60 animate-pulse" />
                ) : offerables.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">
                    You don&apos;t have any crafts or tutorials listed yet. Add a listing on your{" "}
                    <Link href={`/profile/${user.username}`} className="text-accent hover:underline">
                      profile
                    </Link>{" "}
                    first.
                  </div>
                ) : (
                  <select
                    id="offered-item"
                    value={offeredId}
                    onChange={(e) => setOfferedId(e.target.value)}
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                    required
                  >
                    {offerables.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.type === "craft" ? "Craft" : "Tutorial"} — {item.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label htmlFor="trade-message" className="block text-sm font-medium text-purple-dark mb-2">
                  Message
                </label>
                <textarea
                  id="trade-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                  placeholder="Tell them why this trade would be a good fit…"
                />
              </div>

              <div className="rounded-xl bg-yellow-soft/60 border border-yellow/30 px-4 py-3 text-xs text-muted">
                <span className="font-medium text-purple-dark">What you want in return:</span>{" "}
                {listing.title}
              </div>

              {error && (
                <p className="text-sm text-accent" role="alert">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        {user && offerables.length > 0 && (
          <div className="px-5 py-4 border-t border-border bg-white flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="trade-offer-form"
              variant="yellow"
              disabled={submitting || !offeredId}
            >
              {submitting ? "Sending…" : "Send trade offer"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function TradeSuccessToast({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-purple-dark text-white px-5 py-3 shadow-lg">
      <CheckCircle2 className="h-5 w-5 text-yellow shrink-0" />
      <span className="text-sm font-medium">Trade offer sent! The maker will be notified.</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-2 rounded-full p-1 hover:bg-white/10 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
