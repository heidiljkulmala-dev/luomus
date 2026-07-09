"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { defaultFollowedTopics, normalizeTopic } from "@/lib/data/feed";

const STORAGE_PREFIX = "luomus-followed-topics";

function storageKey(username: string) {
  return `${STORAGE_PREFIX}:${username}`;
}

function readTopics(username: string): string[] {
  if (typeof window === "undefined") return defaultFollowedTopics;
  try {
    const raw = localStorage.getItem(storageKey(username));
    if (!raw) return defaultFollowedTopics;
    const parsed = JSON.parse(raw) as string[];
    return Array.from(new Set(parsed.map((topic) => normalizeTopic(topic)).filter(Boolean)));
  } catch {
    return defaultFollowedTopics;
  }
}

export function useFollowedTopics() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<string[]>(defaultFollowedTopics);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      setTopics([]);
      setReady(true);
      return;
    }
    setTopics(readTopics(user.username));
    setReady(true);
  }, [user]);

  const persist = useCallback(
    (next: string[]) => {
      if (!user) return;
      const normalized = Array.from(
        new Set(next.map((topic) => normalizeTopic(topic)).filter(Boolean))
      );
      localStorage.setItem(storageKey(user.username), JSON.stringify(normalized));
      setTopics(normalized);
    },
    [user]
  );

  const isFollowingTopic = useCallback(
    (topic: string) => topics.includes(normalizeTopic(topic)),
    [topics]
  );

  const followTopic = useCallback(
    (topic: string) => {
      const normalized = normalizeTopic(topic);
      if (!normalized || topics.includes(normalized)) return;
      persist([...topics, normalized]);
    },
    [persist, topics]
  );

  const unfollowTopic = useCallback(
    (topic: string) => {
      const normalized = normalizeTopic(topic);
      persist(topics.filter((candidate) => candidate !== normalized));
    },
    [persist, topics]
  );

  const toggleTopic = useCallback(
    (topic: string) => {
      const normalized = normalizeTopic(topic);
      if (!normalized) return;
      if (topics.includes(normalized)) {
        unfollowTopic(normalized);
      } else {
        followTopic(normalized);
      }
    },
    [followTopic, topics, unfollowTopic]
  );

  return {
    topics,
    ready,
    isFollowingTopic,
    followTopic,
    unfollowTopic,
    toggleTopic,
  };
}
