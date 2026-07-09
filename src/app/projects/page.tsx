"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, CheckCircle2, Circle, Palette } from "lucide-react";
import { patterns } from "@/lib/data/patterns";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Project } from "@/types";

type Palette = { id: string; name: string; colors: string[] };

export default function ProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function load() {
      const [projRes, palRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/palettes"),
      ]);
      if (projRes.ok) setProjects(await projRes.json());
      if (palRes.ok) setPalettes(await palRes.json());
      setLoading(false);
    }
    load();
  }, [user, authLoading]);

  const statusIcon = (status: Project["status"]) => {
    if (status === "completed") return <CheckCircle2 className="h-5 w-5 text-pink" />;
    if (status === "in-progress") return <Circle className="h-5 w-5 text-accent fill-accent/20" />;
    return <Circle className="h-5 w-5 text-muted" />;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen craft-grid flex items-center justify-center">
        <div className="text-muted">Loading your projects...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen craft-grid flex flex-col items-center justify-center px-4">
        <h1 className="font-display text-3xl font-bold text-purple-dark">My Studio</h1>
        <p className="text-muted mt-2 mb-6">Sign in to track your craft projects</p>
        <Link href="/auth/sign-in">
          <Button size="lg">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen craft-grid">
      <div className="bg-gradient-to-b from-amber/10 to-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-purple-dark">My Studio</h1>
            <p className="mt-2 text-muted max-w-xl">
              Track works in progress, save color palettes, and never lose your place in a pattern.
            </p>
          </div>
          <Button size="lg">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-xl font-semibold text-purple-dark">Active Projects</h2>
          {projects.length === 0 ? (
            <Card className="p-8 text-center text-muted">
              No projects yet. Browse{" "}
              <Link href="/showroom" className="text-accent hover:underline">showroom</Link> to start one.
            </Card>
          ) : (
            projects.map((project) => {
              const pattern = patterns.find((p) => p.id === project.patternId);
              return (
                <Card key={project.id} className="p-5">
                  <div className="flex items-start gap-4">
                    {statusIcon(project.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-purple-dark">{project.name}</h3>
                        <Badge variant={
                          project.status === "completed" ? "amber" :
                          project.status === "in-progress" ? "accent" : "default"
                        }>
                          {project.status.replace("-", " ")}
                        </Badge>
                      </div>
                      {pattern && (
                        <p className="text-sm text-muted mt-1">
                          {pattern.stitchType} · Started {project.startedAt}
                        </p>
                      )}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-purple/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent to-amber transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-purple-dark mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-amber" /> Saved Palettes
          </h2>
          <div className="space-y-3">
            {palettes.map((palette) => (
              <Card key={palette.id} className="p-4">
                <p className="text-sm font-medium text-purple-dark mb-2">{palette.name}</p>
                <div className="flex gap-1">
                  {palette.colors.map((color) => (
                    <div
                      key={color}
                      className="h-8 flex-1 rounded-lg first:rounded-l-xl last:rounded-r-xl"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">
            <Plus className="h-4 w-4" /> New Palette
          </Button>
        </div>
      </div>
    </div>
  );
}
