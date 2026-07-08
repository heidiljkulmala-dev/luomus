"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { defaultFollowing } from "@/lib/data/feed";

const STORAGE_PREFIX = "luomus-following";

function storageKey(username: string) {
  return `${STORAGE_PREFIX}:${username}`;
}

function readFollowing(username: string): string[] {
  if (typeof window === "undefined") return defaultFollowing;
  try {
    const raw = localStorage.getItem(storageKey(username));
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    /* ignore */
  }
  return defaultFollowing;
}

export function useFollowing() {
  const { user } = useAuth();
  const [following, setFollowing] = useState<string[]>(defaultFollowing);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      setFollowing([]);
      setReady(true);
      return;
    }
    setFollowing(readFollowing(user.username));
    setReady(true);
  }, [user]);

  const persist = useCallback(
    (next: string[]) => {
      if (!user) return;
      localStorage.setItem(storageKey(user.username), JSON.stringify(next));
      setFollowing(next);
    },
    [user]
  );

  const isFollowing = useCallback(
    (username: string) => following.includes(username),
    [following]
  );

  const follow = useCallback(
    (username: string) => {
      if (following.includes(username)) return;
      persist([...following, username]);
    },
    [following, persist]
  );

  const unfollow = useCallback(
    (username: string) => {
      persist(following.filter((u) => u !== username));
    },
    [following, persist]
  );

  const toggleFollow = useCallback(
    (username: string) => {
      if (following.includes(username)) {
        unfollow(username);
      } else {
        follow(username);
      }
    },
    [following, follow, unfollow]
  );

  return { following, isFollowing, follow, unfollow, toggleFollow, ready };
}
