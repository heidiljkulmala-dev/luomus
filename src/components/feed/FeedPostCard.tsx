"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FollowButton } from "@/components/feed/FollowButton";
import type { FeedPost } from "@/types";

type FeedPostCardProps = {
  post: FeedPost;
  currentUsername?: string | null;
  showFollow?: boolean;
};

export function FeedPostCard({
  post,
  currentUsername,
  showFollow = true,
}: FeedPostCardProps) {
  const isOwnPost = currentUsername === post.authorUsername;
  const topicChips = post.craftTags.map((tag) =>
    `#${tag.toLowerCase().trim().replace(/\s+/g, "-")}`
  );

  return (
    <Card className="overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${post.authorUsername}`} className="shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber text-sm font-bold text-white">
              {post.authorAvatar}
            </div>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link
                href={`/profile/${post.authorUsername}`}
                className="font-semibold text-purple-dark hover:text-accent"
              >
                {post.authorDisplayName}
              </Link>
              <span className="text-xs text-muted">@{post.authorUsername}</span>
              <span className="text-xs text-muted">· {post.createdAt}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-purple-dark/90">
              {post.content}
            </p>
            {topicChips.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {topicChips.map((tag) => (
                  <Badge key={`${post.id}-${tag}`} variant="accent">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="mt-4 flex items-center gap-6 text-sm text-muted">
              <button
                type="button"
                className="flex items-center gap-1.5 transition-colors hover:text-accent"
              >
                <Heart className="h-4 w-4" /> {post.likes}
              </button>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" /> {post.comments}
              </span>
            </div>
          </div>
          {showFollow && (
            <FollowButton
              username={post.authorUsername}
              size="sm"
              hidden={isOwnPost}
              className="shrink-0"
            />
          )}
        </div>
      </div>
      {post.image && (
        <div className="relative aspect-[4/3] border-t border-purple/10">
          <Image
            src={post.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>
      )}
    </Card>
  );
}
