"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Hash, Rss, Users } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  extractTopics,
  feedPosts,
  getFeedForFollowing,
  normalizeTopic,
} from "@/lib/data/feed";
import { useFollowing } from "@/lib/follow/use-following";
import { useFollowedTopics } from "@/lib/follow/use-followed-topics";
import { users } from "@/lib/data/users";
import type { FeedPost } from "@/types";

const previewPosts = feedPosts.slice(0, 5);
const TOPIC_PREVIEW_LIMIT = 8;
const FOLLOWING_PREVIEW_LIMIT = 5;
const POSTS_STORAGE_PREFIX = "luomus-feed-posts";

function postsStorageKey(username: string) {
  return `${POSTS_STORAGE_PREFIX}:${username}`;
}

function readPersistedPosts(username: string): FeedPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(postsStorageKey(username));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FeedPost[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export default function FeedPage() {
  const { user } = useAuth();
  const { following, ready } = useFollowing();
  const { topics, toggleTopic, ready: topicsReady } = useFollowedTopics();
  const [newPost, setNewPost] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [postError, setPostError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [customPosts, setCustomPosts] = useState<FeedPost[]>([]);

  useEffect(() => {
    if (!user) {
      setCustomPosts([]);
      return;
    }
    setCustomPosts(readPersistedPosts(user.username));
  }, [user]);

  const allPosts = useMemo(() => [...customPosts, ...feedPosts], [customPosts]);

  const timeline = useMemo(() => {
    if (!user) return previewPosts;
    return getFeedForFollowing({
      following,
      followedTopics: topics,
      posts: allPosts,
      currentUsername: user.username,
    });
  }, [allPosts, following, topics, user]);

  const suggestedCreators = useMemo(() => {
    return Object.values(users).filter((u) => !following.includes(u.username));
  }, [following]);

  const followedCreators = useMemo(
    () =>
      following
        .map((username) => users[username])
        .filter((creator): creator is (typeof users)[string] => Boolean(creator)),
    [following]
  );

  const suggestedTopics = useMemo(() => {
    const discovered = Array.from(
      new Set(
        allPosts
          .flatMap((post) => post.craftTags)
          .map((topic) => normalizeTopic(topic))
          .filter(Boolean)
      )
    );
    return discovered.slice(0, TOPIC_PREVIEW_LIMIT);
  }, [allPosts]);

  function handleCompose(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !newPost.trim()) return;

    setIsPosting(true);
    setPostError(null);

    try {
      const manualTopics = extractTopics(topicInput);
      const textTopics = extractTopics(newPost);
      const nextTopics = Array.from(new Set([...manualTopics, ...textTopics]));

      const createdPost: FeedPost = {
        id: `local-${Date.now()}`,
        authorUsername: user.username,
        authorDisplayName: user.displayName,
        authorAvatar: user.avatar,
        content: newPost.trim(),
        craftTags: nextTopics,
        likes: 0,
        comments: 0,
        createdAt: "Just now",
      };

      const nextPosts = [createdPost, ...customPosts];
      localStorage.setItem(postsStorageKey(user.username), JSON.stringify(nextPosts));
      setCustomPosts(nextPosts);
      setNewPost("");
      setTopicInput("");
    } catch {
      setPostError("Could not publish update. Please try again.");
    } finally {
      setIsPosting(false);
    }
  }

  const profileHref = user ? `/profile/${user.username}` : null;
  const profileInitial =
    user?.displayName?.trim().charAt(0).toUpperCase() ??
    user?.username?.trim().charAt(0).toUpperCase() ??
    "?";

  const yourProfileCard = user && profileHref && (
    <Card className="p-5">
      <Link
        href={profileHref}
        className="group block rounded-xl transition-colors hover:bg-purple-soft/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
      >
        <div className="flex items-center gap-3 p-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber text-sm font-bold text-white">
            {user.avatar || profileInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Your profile</p>
            <p className="truncate text-sm font-semibold text-purple-dark">{user.displayName}</p>
            <p className="truncate text-xs text-muted">@{user.username}</p>
          </div>
          <span className="text-xs font-medium text-accent transition-colors group-hover:text-purple-dark">
            View
          </span>
        </div>
      </Link>
    </Card>
  );

  return (
    <div className="min-h-screen craft-grid">
      <div className="bg-gradient-to-b from-yellow/15 to-transparent py-12">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-pink text-white">
              <Rss className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-purple-dark">Feed</h1>
              <p className="mt-1 text-muted">
                Updates from makers and topics you follow - projects, tips, and studio moments.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="space-y-5">
          {yourProfileCard && <div className="lg:hidden">{yourProfileCard}</div>}

          {user ? (
            <Card className="p-5 sm:p-6">
              <form onSubmit={handleCompose} className="space-y-3">
                <div>
                  <label
                    htmlFor="feed-update"
                    className="mb-2 block text-sm font-semibold text-purple-dark"
                  >
                    Write an update
                  </label>
                  <textarea
                    id="feed-update"
                    rows={4}
                    value={newPost}
                    onChange={(event) => setNewPost(event.target.value)}
                    placeholder="Share what you're making today..."
                    className="w-full resize-none rounded-xl border border-purple/15 bg-white/90 px-4 py-3 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/30"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="feed-topics"
                    className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted"
                  >
                    Categories / hashtags
                  </label>
                  <input
                    id="feed-topics"
                    type="text"
                    value={topicInput}
                    onChange={(event) => setTopicInput(event.target.value)}
                    placeholder="e.g. #beading, tips, watercolor"
                    className="w-full rounded-xl border border-purple/15 bg-white/90 px-4 py-2.5 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div className="flex items-center justify-between">
                  {postError ? <p className="text-xs text-pink">{postError}</p> : <span />}
                  <Button type="submit" size="sm" disabled={isPosting || !newPost.trim()}>
                    {isPosting ? "Posting..." : "Post update"}
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="p-6">
              <h2 className="font-display text-xl font-semibold text-purple-dark">
                Sign in to write updates
              </h2>
              <p className="mt-2 text-sm text-muted">
                Join the conversation, post your progress, and curate your feed by makers and topics.
              </p>
              <div className="mt-4">
                <Link href="/auth/sign-in">
                  <Button size="sm">Sign in to post</Button>
                </Link>
              </div>
            </Card>
          )}

          {!user ? (
            <div className="space-y-5">
              {previewPosts.map((post) => (
                <FeedPostCard key={post.id} post={post} showFollow={false} />
              ))}
            </div>
          ) : !ready || !topicsReady ? (
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
                Follow makers or topics to fill your feed. Start with these featured crafters:
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
                Showing {timeline.length} post{timeline.length === 1 ? "" : "s"} matched by{" "}
                {following.length} followed maker{following.length === 1 ? "" : "s"} and{" "}
                {topics.length} topic{topics.length === 1 ? "" : "s"}
              </p>
              {timeline.map((post) => (
                <FeedPostCard key={post.id} post={post} currentUsername={user.username} />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          {yourProfileCard && <div className="hidden lg:block">{yourProfileCard}</div>}

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-purple-dark">Following</h2>
              <Link
                href="/feed/following"
                className="text-xs font-medium text-accent hover:text-purple-dark"
              >
                See all following
              </Link>
            </div>
            {user ? (
              followedCreators.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {followedCreators.slice(0, FOLLOWING_PREVIEW_LIMIT).map((creator) => (
                    <Link
                      key={creator.username}
                      href={`/profile/${creator.username}`}
                      className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-purple-soft/70"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber text-xs font-bold text-white">
                        {creator.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-purple-dark">
                          {creator.displayName}
                        </p>
                        <p className="truncate text-xs text-muted">@{creator.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  Follow makers to see people listed here.
                </p>
              )
            ) : (
              <p className="mt-3 text-sm text-muted">
                Sign in to preview and manage your followed makers.
              </p>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-accent" />
              <h2 className="font-semibold text-purple-dark">Follow topics</h2>
            </div>
            {user ? (
              suggestedTopics.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestedTopics.map((topic) => {
                    const isActive = topics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          isActive
                            ? "border-purple-dark bg-purple-dark text-white"
                            : "border-purple/20 bg-white text-purple-dark hover:border-purple-dark/40 hover:bg-purple-soft/70"
                        }`}
                      >
                        #{topic}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  Topics appear as people post updates with hashtags.
                </p>
              )
            ) : (
              <p className="mt-3 text-sm text-muted">
                Sign in to follow categories and hashtags.
              </p>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
