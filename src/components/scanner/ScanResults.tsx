import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  Wrench,
  Lightbulb,
  ExternalLink,
  Search,
  ListOrdered,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ScanResult } from "@/types";

type Props = {
  result: ScanResult;
  preview: string;
};

export function ScanResults({ result, preview }: Props) {
  return (
    <div className="mt-10 space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="relative h-24 w-24 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-md">
          <Image src={preview} alt="Your photo" fill className="object-cover" sizes="96px" />
        </div>
        <div>
          <p className="text-pink font-medium">
            Analysis complete — {result.confidence}% match confidence
          </p>
          <p className="text-sm text-muted mt-1">
            {result.scanMode === "bead"
              ? "Single-bead scan: we matched your bead to the closest catalog types and shops."
              : "Jewelry scan: we detected colors, likely beads, tools, and patterns to recreate something similar."}
          </p>
        </div>
      </div>

      {/* Color palette */}
      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold text-purple-dark mb-4">
          Detected colors in your photo
        </h2>
        <div className="flex flex-wrap gap-3">
          {result.dominantColors.map((color) => (
            <div key={color.hex} className="flex items-center gap-2 rounded-xl bg-purple-soft/60 px-3 py-2">
              <div
                className="h-10 w-10 rounded-lg border border-purple/10 shadow-inner"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <p className="text-sm font-medium text-purple-dark">{color.name}</p>
                <p className="text-xs text-muted">{color.percentage}% · {color.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bead matches */}
      <div>
        <h3 className="font-display text-lg font-semibold text-purple-dark mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber" /> Matching beads to buy
        </h3>
        <div className="space-y-3">
          {result.detectedBeads.map((bead, i) => (
            <Card key={bead.id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-purple-dark">{bead.name}</h4>
                    {i === 0 && <Badge variant="accent">Best match</Badge>}
                    <Badge variant="amber">{bead.matchScore}% match</Badge>
                  </div>
                  <p className="text-sm text-muted mt-1">{bead.description}</p>
                </div>
                <Link href={`/shop-finder?q=${encodeURIComponent(bead.searchQuery)}`}>
                  <Button variant="secondary" size="sm">
                    <Search className="h-3.5 w-3.5" /> Find this bead
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Supply hints */}
      <div>
        <h3 className="font-display text-lg font-semibold text-purple-dark mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-pink" /> Where to find the same beads
        </h3>
        <div className="space-y-3">
          {result.supplyHints.map((hint) => (
            <Card key={hint.label} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-medium text-purple-dark text-sm">{hint.label}</p>
                <p className="text-xs text-muted mt-1">{hint.detail}</p>
              </div>
              <Link href={`/shop-finder?q=${encodeURIComponent(hint.shopSearch)}`}>
                <Button variant="outline" size="sm">
                  Search shops →
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div>
        <h3 className="font-display text-lg font-semibold text-purple-dark mb-4 flex items-center gap-2">
          <Wrench className="h-5 w-5" /> Tools to create something similar
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {result.suggestedTools.map((tool) => (
            <Card key={tool.name} className="p-4">
              <h4 className="font-semibold text-sm text-purple-dark">{tool.name}</h4>
              <p className="text-xs text-muted mt-1">{tool.purpose}</p>
              <Link href={`/shop-finder?q=${encodeURIComponent(tool.searchQuery)}`}>
                <Button variant="ghost" size="sm" className="mt-2 px-0">
                  Find tool →
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Pattern / stitch */}
      {result.scanMode === "jewelry" && (
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold text-purple-dark mb-2">Likely technique</h3>
          <p className="text-xl font-bold text-purple-dark">{result.patternName}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="purple">{result.stitchType}</Badge>
            <Badge variant={
              result.estimatedDifficulty === "beginner" ? "amber" :
              result.estimatedDifficulty === "intermediate" ? "amber" : "accent"
            }>
              {result.estimatedDifficulty}
            </Badge>
          </div>
        </Card>
      )}

      {/* Creation steps */}
      <Card className="p-6">
        <h3 className="font-display text-lg font-semibold text-purple-dark mb-4 flex items-center gap-2">
          <ListOrdered className="h-5 w-5 text-accent" /> How to recreate something similar
        </h3>
        <ol className="space-y-3">
          {result.creationSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple/10 text-xs font-bold text-purple-dark">
                {i + 1}
              </span>
              <span className="leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      {/* Shops */}
      <div>
        <h3 className="font-display text-lg font-semibold text-purple-dark mb-4 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" /> Recommended shops
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {result.suggestedShops.map((shop) => (
            <Card key={shop.id} className="p-4">
              <h4 className="font-semibold text-purple-dark">{shop.name}</h4>
              <p className="text-xs text-muted mt-1">{shop.specialty}</p>
              <p className="text-xs text-muted mt-1">{shop.shipping}</p>
              <div className="flex gap-2 mt-3">
                <a href={shop.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    Visit <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
                <Link href="/shop-finder">
                  <Button variant="ghost" size="sm">Browse in craftopia</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Similar patterns */}
      {result.similarPatterns.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-semibold text-purple-dark mb-4">Similar patterns to try</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {result.similarPatterns.map((p) => (
              <Link key={p.id} href="/showroom">
                <Card hover className="flex gap-4 p-3">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0">
                    <Image src={p.image} alt={p.title} fill className="object-cover" sizes="80px" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-purple-dark">{p.title}</h4>
                    <p className="text-xs text-muted">{p.stitchType}</p>
                    <Badge variant="default" className="mt-1">{p.difficulty}</Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
