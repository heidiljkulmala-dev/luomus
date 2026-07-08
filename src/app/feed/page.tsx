"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Rss, Users } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { TeaserGate } from "@/components/auth/TeaserGate";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { feedPosts, getFeedForFollowing } from "@/lib/data/feed";
import { teaserContent } from "@/lib/teaser-routes";
import { useFollowing } from "@/lib/follow/use-following";
import { users } from "@/lib/data/users";

const teaser = teaserContent.feed;
const previewPosts = feedPosts.slice(0, 5);

export default function FeedPage() {
  const { user } = useAuth();
  const { following, ready } = useFollowing();

  const timeline = useMemo(() => {
    if (!user) return previewPosts;
    return getFeedForFollowing(following);
  }, [user, following]);

  const suggestedCreators = useMemo(() => {
    return Object.values(users).filter((u) => !following.includes(u.username));
  }, [following]);

  return (
    <TeaserGate title={teaser.title} description={teaser.description}>
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
          {!user ? (
            <div className="space-y-5">
              {previewPosts.map((post) => (
                <FeedPostCard key={post.id} post={post} showFollow={false} />
              ))}
            </div>
          ) : !ready ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-white/60" />
              ))}
            </div>
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
    </TeaserGate>
  );
}
