"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Heart, Plus, Filter, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button, SMALL_CHIP_ACTIVE_PATTERN, SMALL_CHIP_PATTERN } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";
import { craftSubforums } from "@/lib/data/community";
import type { CraftId } from "@/types";
import Link from "next/link";

type Post = {
  id: string;
  author: string;
  avatar: string;
  username: string;
  title: string;
  content: string;
  category: string;
  craft: CraftId | null;
  replies: number;
  likes: number;
  createdAt: string;
  tags: string[];
};

const topicCategories = ["all", "tips", "help", "showcase", "discussion"] as const;

const categoryColors: Record<string, "amber" | "accent" | "purple"> = {
  tips: "amber",
  help: "accent",
  showcase: "amber",
  discussion: "purple",
};

export default function CommunityPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen craft-grid flex items-center justify-center text-muted">
          Loading...
        </div>
      }
    >
      <CommunityContent />
    </Suspense>
  );
}

function CommunityContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const craftParam = searchParams.get("craft");
  const initialCraft =
    craftParam && craftSubforums.some((s) => s.id === craftParam)
      ? (craftParam as CraftId)
      : "all";
  const [craft, setCraft] = useState<CraftId | "all">(initialCraft);
  const [category, setCategory] = useState<(typeof topicCategories)[number]>("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (craft !== "all") params.set("craft", craft);
      const q = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/community/posts${q}`);
      setPosts(await res.json());
    } finally {
      setLoading(false);
    }
  }, [category, craft]);

  useEffect(() => {
    if (craftParam && craftSubforums.some((s) => s.id === craftParam)) {
      setCraft(craftParam as CraftId);
    }
  }, [craftParam]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category: "discussion" }),
      });
      if (res.ok) {
        setTitle("");
        setContent("");
        setShowNewPost(false);
        await loadPosts();
      }
    } finally {
      setSubmitting(false);
    }
  }

  const activeSubforum = craft !== "all" ? craftSubforums.find((s) => s.id === craft) : null;

  return (
    <div className="min-h-screen craft-grid">
      <div className="bg-gradient-to-b from-purple/10 to-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-header text-4xl font-bold tracking-[-0.035em] text-purple-dark">Community Forum</h1>
            <p className="mt-3 max-w-xl text-muted font-body">
              Ask questions, share tips, and showcase your work — organized by craft type so you
              can find the makers and conversations that matter to you.
            </p>
          </div>
          {user ? (
            <Button size="lg" onClick={() => setShowNewPost(!showNewPost)}>
              <Plus className="h-4 w-4" /> New Post
            </Button>
          ) : (
            <Link href="/auth/sign-in">
              <Button size="lg">Sign in to post</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="font-header text-xl font-semibold text-purple-dark">Browse by craft</h2>
            {craft !== "all" && (
              <button
                onClick={() => setCraft("all")}
                className="text-sm text-accent hover:text-purple-dark transition-colors"
              >
                View all subforums
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {craftSubforums.map((subforum) => {
              const isActive = craft === subforum.id;
              return (
                <button
                  key={subforum.id}
                  onClick={() => setCraft(isActive ? "all" : subforum.id)}
                  className={`text-left rounded-2xl border p-4 transition-all ${
                    isActive
                      ? "border-purple bg-purple/10 shadow-sm"
                      : "border-purple/15 bg-white/80 hover:border-purple/30 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {subforum.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-header font-semibold text-purple-dark">{subforum.label}</h3>
                      <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                        {subforum.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-muted">
                        <span>{subforum.postCount.toLocaleString()} posts</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {subforum.memberCount.toLocaleString()} makers
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {activeSubforum && (
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple/5 to-accent/5 p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl" aria-hidden="true">{activeSubforum.emoji}</span>
              <h3 className="font-header text-lg font-semibold text-purple-dark">
                {activeSubforum.label}
              </h3>
            </div>
            <p className="text-sm text-muted">{activeSubforum.description}</p>
            <p className="text-xs text-muted mt-2">
              Latest activity {activeSubforum.latestActivity}
            </p>
          </div>
        )}

        {showNewPost && user && (
          <Card className="p-6 mb-8">
            <h3 className="mb-4 font-header text-lg font-semibold text-purple-dark">Create a post</h3>
            <form onSubmit={handlePost} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-purple/15 bg-white/80 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <textarea
                placeholder="What's on your mind?"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full rounded-xl border border-purple/15 bg-white/80 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowNewPost(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" disabled={submitting}>
                  {submitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-muted shrink-0" />
          {topicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`${SMALL_CHIP_PATTERN} capitalize whitespace-nowrap ${
                category === cat ? SMALL_CHIP_ACTIVE_PATTERN : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/60 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted">
              No posts yet in this section. Be the first to start a conversation!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const subforum = post.craft
                ? craftSubforums.find((s) => s.id === post.craft)
                : null;
              return (
                <Card key={post.id} hover className="p-6">
                  <div className="flex items-start gap-4">
                    <Link href={`/profile/${post.username}`}>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber text-white text-sm font-bold">
                        {post.avatar}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link href={`/profile/${post.username}`} className="font-semibold text-purple-dark hover:text-accent">
                          {post.author}
                        </Link>
                        {subforum && (
                          <Badge variant="default">
                            {subforum.emoji} {subforum.label.split(" & ")[0]}
                          </Badge>
                        )}
                        <Badge variant={categoryColors[post.category] ?? "default"}>{post.category}</Badge>
                        <span className="text-xs text-muted">{post.createdAt}</span>
                      </div>
                      <h3 className="font-header text-lg font-semibold text-purple-dark">{post.title}</h3>
                      <p className="text-sm text-muted mt-2 leading-relaxed">{post.content}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="default">#{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-6 mt-4 text-sm text-muted">
                        <button className="flex items-center gap-1.5 hover:text-accent transition-colors">
                          <Heart className="h-4 w-4" /> {post.likes}
                        </button>
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="h-4 w-4" /> {post.replies} replies
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
