import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, Upload } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { parseJsonArray } from "@/lib/json-fields";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FollowButton } from "@/components/feed/FollowButton";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await getSession();

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      products: { orderBy: { createdAt: "desc" } },
      tutorials: { orderBy: { createdAt: "desc" } },
      _count: { select: { followers: true, following: true } },
    },
  });

  if (!user) notFound();

  const isOwnProfile = session?.username === user.username;
  const specialties = parseJsonArray(user.specialties);

  const products = user.products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    image: p.image,
    description: p.description,
    materials: parseJsonArray(p.materials),
  }));

  const tutorials = user.tutorials.map((t) => ({
    id: t.id,
    title: t.title,
    thumbnail: t.thumbnail,
    duration: t.duration,
    type: t.type,
  }));

  return (
    <div className="min-h-screen">
      <div className="relative h-48 sm:h-64 bg-purple">
        {user.coverImage && (
          <Image
            src={user.coverImage}
            alt=""
            fill
            className="object-cover opacity-80"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-purple/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:pt-8 lg:px-8">
        <div className="relative flex flex-col sm:flex-row sm:items-start gap-4 pb-8 border-b border-purple/10">
          <div className="-mt-16 sm:-mt-20 shrink-0 flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-amber text-white text-3xl font-bold border-4 border-surface shadow-xl">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0 sm:pt-6">
            <h1 className="font-display text-3xl font-bold text-purple-dark">{user.displayName}</h1>
            <p className="text-muted mt-1">@{user.username}</p>
            {user.bio && <p className="text-sm text-muted mt-2 max-w-xl">{user.bio}</p>}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {user.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Joined{" "}
                {user.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {user._count.followers.toLocaleString()} followers
              </span>
            </div>
            {specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {specialties.map((s) => (
                  <Badge key={s} variant="accent">{s}</Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 sm:self-end shrink-0">
            {isOwnProfile ? (
              <Button variant="outline">
                <Upload className="h-4 w-4" /> Edit Profile
              </Button>
            ) : (
              <FollowButton username={user.username} />
            )}
          </div>
        </div>

        <ProfileTabs
          username={user.username}
          isOwnProfile={isOwnProfile}
          products={products}
          tutorials={tutorials}
        />

        <div className="py-8 text-center">
          <Link href="/" className="text-sm text-muted hover:text-accent transition-colors">
            ← Back to luomus home
          </Link>
        </div>
      </div>
    </div>
  );
}
