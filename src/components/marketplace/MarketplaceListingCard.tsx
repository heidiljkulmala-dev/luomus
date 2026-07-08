"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Package, Play, ShoppingBag, ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TradeBadge } from "@/components/marketplace/TradeBadge";
import { craftCategoryLabels, materialTypeLabels } from "@/lib/data/materials";
import { formatNumber, formatPrice } from "@/lib/utils";
import type { MarketplaceCraft, MarketplaceMaterial, MarketplaceTutorial } from "@/types";

type CraftCardProps = {
  craft: MarketplaceCraft;
  onProposeTrade: (craft: MarketplaceCraft) => void;
  onViewDetail: (craft: MarketplaceCraft) => void;
};

export function CraftListingCard({ craft, onProposeTrade, onViewDetail }: CraftCardProps) {
  return (
    <Card hover className="overflow-hidden flex flex-col">
      <button
        type="button"
        className="relative aspect-square w-full text-left"
        onClick={() => onViewDetail(craft)}
      >
        <Image
          src={craft.image}
          alt={craft.title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 50vw, 25vw"
        />
        {craft.openToTrades && (
          <div className="absolute top-2 left-2">
            <TradeBadge compact />
          </div>
        )}
      </button>
      <div className="p-4 flex flex-col flex-1">
        <button type="button" className="text-left" onClick={() => onViewDetail(craft)}>
          <h3 className="font-semibold text-purple-dark">{craft.title}</h3>
        </button>
        <Link
          href={`/profile/${craft.seller.username}`}
          className="text-xs text-muted hover:text-accent transition-colors"
        >
          by {craft.seller.displayName}
        </Link>
        <p className="text-sm text-muted mt-2 line-clamp-2">{craft.description}</p>
        {craft.tradeNotes && craft.openToTrades && (
          <p className="text-xs text-muted mt-2 italic line-clamp-1">{craft.tradeNotes}</p>
        )}
        <div className="flex flex-wrap gap-1 mt-2">
          {craft.materials.slice(0, 2).map((m) => (
            <Badge key={m} variant="default">{m}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-purple/8">
          <span className="font-display text-lg font-bold text-purple-dark">
            {formatPrice(craft.price)}
          </span>
          <div className="flex gap-2">
            {craft.openToTrades && (
              <Button
                variant="yellow"
                size="sm"
                onClick={() => onProposeTrade(craft)}
              >
                <ArrowLeftRight className="h-3.5 w-3.5" /> Trade
              </Button>
            )}
            <Button variant="secondary" size="sm">
              <ShoppingBag className="h-3.5 w-3.5" /> Buy
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

type TutorialCardProps = {
  tutorial: MarketplaceTutorial;
  onProposeTrade: (tutorial: MarketplaceTutorial) => void;
  onViewDetail: (tutorial: MarketplaceTutorial) => void;
};

export function TutorialListingCard({
  tutorial,
  onProposeTrade,
  onViewDetail,
}: TutorialCardProps) {
  return (
    <Card hover className="overflow-hidden flex flex-col">
      <button
        type="button"
        className="relative aspect-video w-full text-left"
        onClick={() => onViewDetail(tutorial)}
      >
        <Image
          src={tutorial.thumbnail}
          alt={tutorial.title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <span className="absolute bottom-2 right-2 rounded-md bg-purple/80 px-2 py-0.5 text-xs text-white flex items-center gap-1">
          <Clock className="h-3 w-3" /> {tutorial.duration}
        </span>
        {tutorial.openToTrades && (
          <div className="absolute top-2 left-2">
            <TradeBadge compact />
          </div>
        )}
      </button>
      <div className="p-4 flex flex-col flex-1">
        <button type="button" className="text-left" onClick={() => onViewDetail(tutorial)}>
          <h3 className="font-semibold text-purple-dark line-clamp-2">{tutorial.title}</h3>
        </button>
        <Link
          href={`/profile/${tutorial.owner.username}`}
          className="text-xs text-muted hover:text-accent transition-colors"
        >
          by {tutorial.owner.displayName}
        </Link>
        <p className="text-sm text-muted mt-2 line-clamp-2">{tutorial.description}</p>
        {tutorial.tradeNotes && tutorial.openToTrades && (
          <p className="text-xs text-muted mt-2 italic line-clamp-1">{tutorial.tradeNotes}</p>
        )}
        <div className="flex items-center gap-2 mt-2 text-xs text-muted">
          <Badge variant={tutorial.tutorialType === "video" ? "accent" : "amber"}>
            {tutorial.tutorialType === "video" ? "Video" : "External"}
          </Badge>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {formatNumber(tutorial.views)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-purple/8">
          <Badge variant="purple">{tutorial.difficulty}</Badge>
          <div className="flex gap-2">
            {tutorial.openToTrades ? (
              <Button variant="yellow" size="sm" onClick={() => onProposeTrade(tutorial)}>
                <ArrowLeftRight className="h-3.5 w-3.5" /> Trade
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                <Play className="h-3.5 w-3.5" /> View
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

type MaterialCardProps = {
  material: MarketplaceMaterial;
  onViewDetail: (material: MarketplaceMaterial) => void;
};

export function MaterialListingCard({ material, onViewDetail }: MaterialCardProps) {
  const conditionLabel = material.condition === "new" ? "New" : "Leftover";

  return (
    <Card hover className="overflow-hidden flex flex-col border-yellow/20">
      <button
        type="button"
        className="relative aspect-[4/3] w-full text-left bg-yellow-soft/30"
        onClick={() => onViewDetail(material)}
      >
        <Image
          src={material.image}
          alt={material.title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 50vw, 25vw"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <Badge variant="amber">
            <Package className="h-3 w-3 mr-1 inline" />
            {materialTypeLabels[material.materialType] ?? material.materialType}
          </Badge>
        </div>
        <span className="absolute bottom-2 right-2 rounded-md bg-purple/80 px-2 py-0.5 text-xs text-white">
          {material.quantity}
        </span>
      </button>
      <div className="p-4 flex flex-col flex-1">
        <button type="button" className="text-left" onClick={() => onViewDetail(material)}>
          <h3 className="font-semibold text-purple-dark line-clamp-2">{material.title}</h3>
        </button>
        <Link
          href={`/profile/${material.seller.username}`}
          className="text-xs text-muted hover:text-accent transition-colors"
        >
          by {material.seller.displayName}
        </Link>
        <p className="text-sm text-muted mt-2 line-clamp-2">{material.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant={material.condition === "new" ? "accent" : "default"}>{conditionLabel}</Badge>
          <Badge variant="purple">{craftCategoryLabels[material.craftCategory]}</Badge>
        </div>
        {material.tradeNotes && material.openToTrades && (
          <p className="text-xs text-muted mt-2 italic line-clamp-1">{material.tradeNotes}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-purple/8">
          <span className="font-display text-lg font-bold text-purple-dark">
            {formatPrice(material.price)}
          </span>
          <Button variant="secondary" size="sm" onClick={() => onViewDetail(material)}>
            <ShoppingBag className="h-3.5 w-3.5" /> Buy
          </Button>
        </div>
      </div>
    </Card>
  );
}
