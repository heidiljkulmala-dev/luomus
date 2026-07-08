"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Rss, Users } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { feedPosts, getFeedForFollowing } from "@/lib/data/feed";
import { useFollowing } from "@/lib/follow/use-following";
import { users } from "@/lib/data/users";

export default function FeedPage() {
  const { user, loading: authLoading } = useAuth();
  const { following, ready } = useFollowing();

  const timeline = useMemo(() => {
    if (!user) return [];
    return getFeedForFollowing(following);
  }, [user, following]);

  const suggestedCreators = useMemo(() => {
    return Object.values(users).filter((u) => !following.includes(u.username));
  }, [following]);

  return (
    <div className="min-h-screen craft-grid">
      <div className="bg-gradient-to-b from-yellow/15 to-transparent py-12">
        <div className="mx-auto max-w-2xl px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-pink text-white">
              <Rss className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-purple-dark">Feed</h1>
              <p className="mt-1 text-muted">
                Updates from makers you follow — projects, tips, and studio moments.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-16 lg:px-8">
        {authLoading || !ready ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-white/60" />
            ))}
          </div>
        ) : !user ? (
          <Card className="p-8 text-center">
            <Rss className="mx-auto h-10 w-10 text-accent" />
            <h2 className="mt-4 font-display text-xl font-semibold text-purple-dark">
              Sign in to see your feed
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              Follow crafters and see their latest posts in one place — like a maker&apos;s
              studio diary.
            </p>
            <Link href="/auth/sign-in" className="mt-6 inline-block">
              <Button variant="secondary">Sign in</Button>
            </Link>
            <div className="mt-10 border-t border-purple/10 pt-8 text-left">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Preview — recent from the community
              </p>
              <div className="space-y-4">
                {feedPosts.slice(0, 3).map((post) => (
                  <FeedPostCard key={post.id} post={post} showFollow={false} />
                ))}
              </div>
            </div>
          </Card>
        ) : timeline.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="mx-auto h-10 w-10 text-pink" />
            <h2 className="mt-4 font-display text-xl font-semibold text-purple-dark">
              Your feed is empty
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              Follow makers to see their posts here. Start with these featured crafters:
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {suggestedCreators.map((creator) => (
                <Link key={creator.username} href={`/profile/${creator.username}`}>
                  <Button variant="outline" size="sm">
                    {creator.displayName}
                  </Button>
                </Link>
              ))}
            </div>
          </Card>
        ) : (
          <div className="space-y-5">
            <p className="text-sm text-muted">
              Showing {timeline.length} post{timeline.length === 1 ? "" : "s"} from{" "}
              {following.length} maker{following.length === 1 ? "" : "s"} you follow
            </p>
            {timeline.map((post) => (
              <FeedPostCard
                key={post.id}
                post={post}
                currentUsername={user.username}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
