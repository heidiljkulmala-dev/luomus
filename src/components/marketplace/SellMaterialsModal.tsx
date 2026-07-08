"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { craftCategoryLabels } from "@/lib/data/materials";
import type { CraftId } from "@/types";

type SellMaterialsModalProps = {
  onClose: () => void;
};

const materialTypes = ["beads", "yarn", "clay", "tools", "fabric", "thread", "glaze", "wax"];

export function SellMaterialsModal({ onClose }: SellMaterialsModalProps) {
  const { user, loading } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close sell materials dialog"
        className="absolute inset-0 bg-purple-dark/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-surface border border-border shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-yellow-soft/50">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" />
            <h2 className="font-display text-lg font-bold text-purple-dark">Sell materials</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted hover:bg-white hover:text-purple-dark transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          {loading ? (
            <p className="text-sm text-muted text-center py-6">Loading…</p>
          ) : !user ? (
            <div className="rounded-xl border border-border bg-white p-5 text-center space-y-3">
              <p className="text-sm text-muted">
                Sign in to list beads, yarn, clay, tools, and other craft supplies.
              </p>
              <Link href="/auth/sign-in?redirect=/marketplace">
                <Button variant="secondary">Sign in</Button>
              </Link>
            </div>
          ) : submitted ? (
            <div className="rounded-xl border border-yellow/30 bg-yellow-soft/40 p-6 text-center space-y-3">
              <Package className="h-10 w-10 text-accent mx-auto" />
              <p className="font-display font-bold text-purple-dark">Listing preview saved</p>
              <p className="text-sm text-muted">
                Your material listing would appear in the shop once publishing is enabled. For now,
                browse what other makers are selling below.
              </p>
              <Button variant="secondary" onClick={onClose}>
                Back to shop
              </Button>
            </div>
          ) : (
            <form id="sell-materials-form" onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted">
                List leftover beads, yarn, clay, tools, or fabric for fellow craftopia makers.
              </p>

              <div>
                <label htmlFor="mat-title" className="block text-sm font-medium text-purple-dark mb-1.5">
                  Title
                </label>
                <input
                  id="mat-title"
                  required
                  placeholder="e.g. Miyuki Delica Mix — Sunset Tones"
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mat-type" className="block text-sm font-medium text-purple-dark mb-1.5">
                    Material type
                  </label>
                  <select
                    id="mat-type"
                    required
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {materialTypes.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="mat-quantity" className="block text-sm font-medium text-purple-dark mb-1.5">
                    Quantity
                  </label>
                  <input
                    id="mat-quantity"
                    required
                    placeholder="e.g. 500 g, 50 beads"
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mat-condition" className="block text-sm font-medium text-purple-dark mb-1.5">
                    Condition
                  </label>
                  <select
                    id="mat-condition"
                    required
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="new">New / unopened</option>
                    <option value="leftover">Leftover / partial</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="mat-price" className="block text-sm font-medium text-purple-dark mb-1.5">
                    Price (€)
                  </label>
                  <input
                    id="mat-price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="18"
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mat-craft" className="block text-sm font-medium text-purple-dark mb-1.5">
                  Craft category
                </label>
                <select
                  id="mat-craft"
                  required
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {(Object.entries(craftCategoryLabels) as [CraftId, string][]).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mat-desc" className="block text-sm font-medium text-purple-dark mb-1.5">
                  Description
                </label>
                <textarea
                  id="mat-desc"
                  required
                  rows={3}
                  placeholder="What's included, brand, color notes…"
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                />
              </div>
            </form>
          )}
        </div>

        {user && !submitted && (
          <div className="px-5 py-4 border-t border-border bg-white flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="sell-materials-form" variant="yellow">
              List material
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
