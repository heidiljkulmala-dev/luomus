"use client";

import { UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFollowing } from "@/lib/follow/use-following";
import { cn } from "@/lib/utils";

type FollowButtonProps = {
  username: string;
  size?: "sm" | "md";
  className?: string;
  /** Hide when viewing own profile */
  hidden?: boolean;
};

export function FollowButton({
  username,
  size = "md",
  className,
  hidden = false,
}: FollowButtonProps) {
  const { isFollowing, toggleFollow, ready } = useFollowing();
  const following = isFollowing(username);

  if (hidden) return null;

  return (
    <Button
      variant={following ? "outline" : "secondary"}
      size={size}
      onClick={() => toggleFollow(username)}
      disabled={!ready}
      className={cn(className)}
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4" /> Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" /> Follow
        </>
      )}
    </Button>
  );
}
