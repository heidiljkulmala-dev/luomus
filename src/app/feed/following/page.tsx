"use client";

import Link from "next/link";
import { Hash, Users } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/Card";
import { useFollowing } from "@/lib/follow/use-following";
import { useFollowedTopics } from "@/lib/follow/use-followed-topics";
import { users } from "@/lib/data/users";

export default function FollowingPage() {
  const { user } = useAuth();
  const { following, ready } = useFollowing();
  const { topics, ready: topicsReady } = useFollowedTopics();

  const followedPeople = following
    .map((username) => users[username])
    .filter((person): person is (typeof users)[string] => Boolean(person));

  return (
    <div className="min-h-screen craft-grid">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-purple-dark">Following</h1>
          <p className="mt-1 text-sm text-muted">
            People and topics currently shaping your feed.
          </p>
        </div>

        {!user ? (
          <Card className="p-8 text-center">
            <p className="text-sm text-muted">Sign in to view everyone and every topic you follow.</p>
            <div className="mt-4">
              <Link href="/auth/sign-in" className="text-sm font-medium text-accent hover:text-purple-dark">
                Go to sign in
              </Link>
            </div>
          </Card>
        ) : !ready || !topicsReady ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/60" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <h2 className="font-semibold text-purple-dark">People</h2>
              </div>
              {followedPeople.length === 0 ? (
                <p className="mt-3 text-sm text-muted">You are not following any makers yet.</p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {followedPeople.map((person) => (
                    <Link
                      key={person.username}
                      href={`/profile/${person.username}`}
                      className="flex items-center gap-3 rounded-xl border border-purple/15 bg-white/80 p-3 transition-colors hover:bg-purple-soft/60"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber text-xs font-bold text-white">
                        {person.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-purple-dark">{person.displayName}</p>
                        <p className="truncate text-xs text-muted">@{person.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-accent" />
                <h2 className="font-semibold text-purple-dark">Topics</h2>
              </div>
              {topics.length === 0 ? (
                <p className="mt-3 text-sm text-muted">You are not following any topics yet.</p>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-purple/20 bg-white px-3 py-1 text-xs font-medium text-purple-dark"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
