"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink, Upload, Eye, Clock } from "lucide-react";
import { tutorials } from "@/lib/data/tutorials";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TeaserGate } from "@/components/auth/TeaserGate";
import { teaserContent } from "@/lib/teaser-routes";
import { formatNumber } from "@/lib/utils";

const tabs = ["all", "video", "link"] as const;

const teaser = teaserContent.tutorials;

export default function TutorialsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");

  const filtered =
    tab === "all" ? tutorials : tutorials.filter((t) => t.type === tab);

  return (
    <TeaserGate title={teaser.title} description={teaser.description}>
    <div className="min-h-screen craft-grid">
      <div className="bg-gradient-to-b from-accent/10 to-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-purple-dark">Tutorials</h1>
            <p className="mt-2 text-muted max-w-xl">
              Watch creator-uploaded videos and explore curated links to the best craft tutorials on the web.
            </p>
          </div>
          <Button variant="secondary">
            <Upload className="h-4 w-4" /> Upload Tutorial
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="flex gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
                tab === t ? "bg-purple text-white" : "bg-white/80 text-muted hover:bg-purple/10"
              }`}
            >
              {t === "link" ? "External Links" : t === "video" ? "Creator Videos" : "All"}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tutorial) => (
            <Card key={tutorial.id} hover className="group overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-purple/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {tutorial.type === "video" ? (
                    <Play className="h-12 w-12 text-white" />
                  ) : (
                    <ExternalLink className="h-10 w-10 text-white" />
                  )}
                </div>
                <span className="absolute bottom-2 right-2 rounded-md bg-purple/80 px-2 py-0.5 text-xs text-white flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {tutorial.duration}
                </span>
                <Badge
                  variant={tutorial.type === "video" ? "accent" : "amber"}
                  className="absolute top-2 left-2"
                >
                  {tutorial.type === "video" ? "Video" : "External"}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-purple-dark line-clamp-2">{tutorial.title}</h3>
                <p className="text-sm text-muted mt-1 line-clamp-2">{tutorial.description}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-muted">
                  <span>{tutorial.author}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {formatNumber(tutorial.views)} views
                  </span>
                </div>
                <Badge variant={
                  tutorial.difficulty === "beginner" ? "amber" :
                  tutorial.difficulty === "intermediate" ? "amber" : "accent"
                } className="mt-2">
                  {tutorial.difficulty}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
    </TeaserGate>
  );
}
