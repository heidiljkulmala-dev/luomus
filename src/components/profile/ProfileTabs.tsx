"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Play,
  Rss,
  ShoppingBag,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { getPostsByUsername } from "@/lib/data/feed";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  materials: string[];
};

type Tutorial = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  type: string;
};

type ProfileTabsProps = {
  username: string;
  isOwnProfile: boolean;
  products: Product[];
  tutorials: Tutorial[];
};

type Tab = "feed" | "shop" | "tutorials";

export function ProfileTabs({
  username,
  isOwnProfile,
  products,
  tutorials,
}: ProfileTabsProps) {
  const [tab, setTab] = useState<Tab>("feed");
  const posts = getPostsByUsername(username);

  const tabs: { id: Tab; label: string; icon: typeof Rss; count?: number }[] = [
    { id: "feed", label: "Feed", icon: Rss, count: posts.length },
    { id: "shop", label: "Shop", icon: ShoppingBag, count: products.length },
    { id: "tutorials", label: "Tutorials", icon: Play, count: tutorials.length },
  ];

  return (
    <>
      <div className="flex gap-1 border-b border-purple/10 pb-px overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === id
                ? "border-accent text-purple-dark"
                : "border-transparent text-muted hover:text-purple-dark"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {count !== undefined && count > 0 && (
              <span className="rounded-full bg-purple/10 px-2 py-0.5 text-xs">{count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="py-10">
        {tab === "feed" && (
          <>
            {posts.length === 0 ? (
              <Card className="p-8 text-center text-muted">
                No posts yet.
                {isOwnProfile && " Share your latest project to get started!"}
              </Card>
            ) : (
              <div className="mx-auto max-w-2xl space-y-5">
                {posts.map((post) => (
                  <FeedPostCard
                    key={post.id}
                    post={post}
                    currentUsername={isOwnProfile ? username : undefined}
                    showFollow={false}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "shop" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display flex items-center gap-2 text-2xl font-bold text-purple-dark">
                <ShoppingBag className="h-6 w-6 text-accent" /> Shop
              </h2>
              {isOwnProfile && (
                <Button variant="ghost" size="sm">
                  Manage listings
                </Button>
              )}
            </div>
            {products.length === 0 ? (
              <Card className="p-8 text-center text-muted">No listings yet.</Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Card key={product.id} hover className="overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="300px"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-purple-dark">{product.title}</h3>
                      <p className="mt-1 text-sm text-muted">{product.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.materials.map((m) => (
                          <Badge key={m} variant="default">
                            {m}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-display text-xl font-bold text-purple-dark">
                          {formatPrice(product.price)}
                        </span>
                        <Button variant="secondary" size="sm">
                          Add to cart
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "tutorials" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display flex items-center gap-2 text-2xl font-bold text-purple-dark">
                <Play className="h-6 w-6 text-pink" /> Tutorials
              </h2>
              {isOwnProfile && (
                <Button variant="ghost" size="sm">
                  <Upload className="h-4 w-4" /> Upload video
                </Button>
              )}
            </div>
            {tutorials.length === 0 ? (
              <Card className="p-8 text-center text-muted">No tutorials yet.</Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {tutorials.map((tutorial) => (
                  <Card key={tutorial.id} hover className="flex gap-4 p-4">
                    <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={tutorial.thumbnail}
                        alt={tutorial.title}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-purple/30">
                        {tutorial.type === "video" ? (
                          <Play className="h-8 w-8 text-white" />
                        ) : (
                          <ExternalLink className="h-6 w-6 text-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <Badge variant={tutorial.type === "video" ? "accent" : "amber"}>
                        {tutorial.type === "video" ? "My Video" : "External Link"}
                      </Badge>
                      <h3 className="mt-1 font-semibold text-purple-dark">{tutorial.title}</h3>
                      <p className="mt-1 text-xs text-muted">{tutorial.duration}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
