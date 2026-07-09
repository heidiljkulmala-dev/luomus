import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  MessageCircle,
  Palette,
  PlayCircle,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { showcaseItems } from "@/lib/data/showroom";
import { featuredCreators } from "@/lib/data/users";
import { communityPosts, craftSubforums } from "@/lib/data/community";
import { craftCategories, site } from "@/lib/site";
import { continents } from "@/lib/data/traditional-crafts";

const pillars = [
  {
    title: "Profile",
    description: "Build your maker page — showcase finished crafts, work-in-progress, and tutorials you have created for others.",
    href: "/projects",
    accent: "yellow" as const,
    icon: Sparkles,
  },
  {
    title: "Shop",
    description: "Buy and sell handmade crafts directly from makers around the world.",
    href: "/marketplace",
    accent: "pink" as const,
    icon: Store,
  },
  {
    title: "Tutorials",
    description: "Learn from curated guides across the internet and original lessons submitted by community members.",
    href: "/tutorials",
    accent: "purple" as const,
    icon: PlayCircle,
  },
  {
    title: "Suppliers",
    description: "Find beads, yarn, clay, tools, and materials from shops in your region or worldwide.",
    href: "/shop-finder",
    accent: "pink" as const,
    icon: Globe2,
  },
  {
    title: "Showroom",
    description: "Browse finished crafts from makers worldwide — filter by discipline and discover work worth studying.",
    href: "/showroom",
    accent: "yellow" as const,
    icon: Palette,
  },
  {
    title: "Forum",
    description: "Talk crafts by type — beading, fiber, pottery, and more — with makers on every continent.",
    href: "/community",
    accent: "purple" as const,
    icon: MessageCircle,
  },
];

const badgeForAccent = { purple: "purple" as const, pink: "pink" as const, yellow: "yellow" as const };

export default function HomePage() {
  const heroProjects = showcaseItems.slice(0, 5);
  const posts = communityPosts.slice(0, 3);

  return (
    <>
      <section className="page-shell relative w-full overflow-x-hidden pb-2 lg:pb-4">
        <div className="relative mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="min-w-0">
              <Badge variant="default" className="mb-4 border-purple-dark/20 bg-transparent uppercase tracking-[0.22em] font-header">
                {site.tagline}
              </Badge>
              <h1 className="hero-headline font-header font-bold text-purple-dark">
                A global community for <span className="gradient-text">crafters who make by hand.</span>
              </h1>
              <p className="hero-lead mt-5 max-w-xl text-muted font-body">
                Connect with makers worldwide — share your work, find tutorials, discover suppliers,
                and buy and sell handmade crafts. From beads and clay to yarn and thread, every craft
                belongs here.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/community">
                  <Button size="lg">
                    Join the community
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <HeroShowcase patterns={heroProjects} />
          </div>
        </div>
      </section>

      <section className="home-section-pillars w-full py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="mb-8 max-w-3xl">
            <Badge variant="default" className="mb-3 border-purple-dark/15 bg-transparent uppercase tracking-[0.2em]">
              Everything in one place
            </Badge>
            <h2 className="mb-3 font-header text-4xl font-bold tracking-[-0.045em] text-purple-dark lg:text-5xl">
              Six ways to connect, learn, and share.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted font-body">
              Whether you want to showcase your work, find a tutorial, buy supplies, sell a piece,
              explore a new craft method, or ask the community for help — start here.
            </p>
          </div>
          <div className="grid gap-4 rounded-[2rem] bg-white/45 p-5 shadow-[0_24px_60px_rgba(37,20,47,0.04)] sm:grid-cols-2 sm:p-6 lg:grid-cols-3 lg:p-8">
            {pillars.map(({ title, description, href, accent, icon: Icon }) => (
              <Link key={href} href={href}>
                <Card hover className="group h-full p-6">
                  <div
                    className={`mb-5 flex h-11 w-11 items-center justify-center rounded-full text-purple-dark transition-transform group-hover:-rotate-3 group-hover:scale-105 ${
                      accent === "yellow"
                        ? "bg-yellow-soft"
                        : accent === "pink"
                          ? "bg-pink-soft"
                          : "bg-gradient-to-br from-yellow-soft to-pink-soft"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant={badgeForAccent[accent]} className="mb-3 opacity-90">
                    {title}
                  </Badge>
                  <p className="text-sm leading-6 text-muted font-body">{description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-dark font-header">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section-crafts w-full py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 rounded-[2rem] bg-white/70 p-5 shadow-[0_16px_48px_rgba(37,20,47,0.06)] backdrop-blur-sm lg:p-6">
            <div>
              <h2 className="font-header text-3xl font-bold tracking-[-0.035em] text-purple-dark">
                Ways of crafting
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted font-body">
                Every handmade discipline has its own tools, techniques, and traditions. Browse craft
                types to learn what each method involves and find projects to try.
              </p>
            </div>
            <Badge variant="amber">Handmade craft & DIY</Badge>
          </div>
          <div className="flex flex-wrap gap-2 rounded-[1.75rem] bg-white/55 p-5 shadow-[0_12px_40px_rgba(37,20,47,0.04)] backdrop-blur-sm lg:p-6">
            {craftCategories.map((c, i) => {
              const hover =
                i % 3 === 0
                  ? "hover:border-purple hover:bg-purple-soft"
                  : i % 3 === 1
                    ? "hover:border-pink hover:bg-pink-soft"
                    : "hover:border-yellow hover:bg-yellow-soft";
              return (
                <Link
                  key={c.id}
                  href={`/showroom?craft=${c.id}`}
                  className={`inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-purple-dark transition-colors font-header ${
                    i % 3 === 0 ? "bg-pink-soft/85" : i % 3 === 1 ? "bg-white/80" : "bg-yellow-soft/65"
                  } ${hover}`}
                >
                  <span>{c.emoji}</span>
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-section-heritage w-full py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="mb-7 max-w-2xl">
            <Badge variant="purple" className="mb-3 uppercase tracking-[0.2em]">
              Heritage traditions
            </Badge>
            <h2 className="font-header text-4xl font-bold tracking-[-0.045em] text-purple-dark lg:text-5xl">
              Traditional crafts from every continent.
            </h2>
            <p className="mt-4 leading-8 text-muted font-body">
              Discover making traditions rooted in culture and place — from African beadwork and Asian
              porcelain to European lace and Pacific weaving.
            </p>
          </div>
          <div className="rounded-[2rem] bg-purple-soft/80 p-5 shadow-[0_20px_50px_rgba(37,20,47,0.04)] lg:p-6">
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap gap-2">
                  {continents.map((c, i) => {
                    const hover =
                      i % 3 === 0
                        ? "hover:border-purple hover:bg-purple-soft"
                        : i % 3 === 1
                          ? "hover:border-pink hover:bg-pink-soft"
                          : "hover:border-yellow hover:bg-yellow-soft";
                    return (
                      <Link
                        key={c.id}
                        href={`/traditional-crafts?continent=${c.id}`}
                        className={`inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-purple-dark transition-colors font-header ${
                          i % 3 === 0 ? "bg-yellow-soft/65" : i % 3 === 1 ? "bg-pink-soft/85" : "bg-white/80"
                        } ${hover}`}
                      >
                        <span>{c.emoji}</span>
                        {c.label}
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-6">
                  <Link href="/traditional-crafts">
                    <Button variant="outline">
                      Browse all traditions
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section-events w-full py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="grid items-center gap-6 rounded-[2rem] bg-white/50 p-5 shadow-[0_20px_50px_rgba(37,20,47,0.04)] lg:grid-cols-[1fr_auto] lg:p-8">
            <div>
              <Badge variant="pink" className="mb-3 uppercase tracking-[0.2em]">
                Craft events
              </Badge>
              <h2 className="font-header text-3xl font-bold tracking-[-0.035em] text-purple-dark lg:text-4xl">
                Markets, fairs, and meetups near you.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted font-body">
                Find local craft markets, maker fairs, workshops, and community gatherings — filtered
                by craft type and sorted to show events in your country first.
              </p>
            </div>
            <Link href="/events">
              <Button variant="pink" size="lg">
                <CalendarDays className="h-4 w-4" />
                Browse events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section-forum w-full py-14 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-6">
          <div className="rounded-[2rem] bg-white/50 p-5 shadow-[0_20px_50px_rgba(37,20,47,0.04)] lg:p-6">
            <Badge variant="amber" className="mb-3 uppercase tracking-[0.2em]">
              Community forum
            </Badge>
            <h2 className="font-header text-4xl font-bold tracking-[-0.045em] text-purple-dark lg:text-5xl">
              Ask questions. Share ideas. Get advice.
            </h2>
            <p className="mt-4 leading-8 text-muted font-body">
              The forum is organized by craft type — find your subforum, ask for advice, share
              finished work, and connect with makers who work in the same medium as you.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {craftSubforums.slice(0, 6).map((subforum) => (
                <Link
                  key={subforum.id}
                  href={`/community?craft=${subforum.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white/80 px-2.5 py-1.5 text-xs text-purple-dark transition-colors hover:border-purple hover:bg-purple-soft font-header"
                >
                  <span>{subforum.emoji}</span>
                  {subforum.label.split(" & ")[0]}
                </Link>
              ))}
              <Link
                href="/community"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-pink-soft/80 px-2.5 py-1.5 text-xs font-semibold text-purple-dark transition-colors hover:border-pink font-header"
              >
                All subforums
              </Link>
            </div>
            <Link href="/community" className="mt-5 inline-block">
              <Button variant="pink">
                Visit the forum
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2.5 rounded-[2rem] bg-white/40 p-4 shadow-[0_20px_50px_rgba(37,20,47,0.04)] lg:p-5">
            {posts.map((post) => {
              const subforum = craftSubforums.find((s) => s.id === post.craft);
              return (
              <div
                key={post.id}
                className="rounded-2xl border border-border bg-white p-5 shadow-[0_1px_0_rgba(37,20,47,0.04)]"
              >
                <div className="mb-2 flex items-center gap-2 text-xs text-muted font-body">
                  {subforum && (
                    <>
                      <span>{subforum.emoji}</span>
                      <span className="font-header font-medium text-purple-dark/70">
                        {subforum.label.split(" & ")[0]}
                      </span>
                      <span>·</span>
                    </>
                  )}
                  <span className="font-header font-medium text-purple-dark">{post.author}</span>
                  <span>·</span>
                  <span>{post.createdAt}</span>
                </div>
                <h4 className="font-header text-sm font-medium text-purple-dark">{post.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-muted font-body">{post.content}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-section-makers w-full py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="mb-7 max-w-2xl">
            <Badge variant="amber" className="mb-3 uppercase tracking-[0.2em]">
              Maker profiles
            </Badge>
            <h2 className="font-header text-4xl font-bold tracking-[-0.045em] text-purple-dark lg:text-5xl">
              Showcase your crafts and tutorials.
            </h2>
            <p className="mt-4 leading-8 text-muted font-body">
              Every maker gets a profile to share finished pieces, work-in-progress, and tutorials
              they have written — a personal studio wall for the global craft community.
            </p>
          </div>
          <div className="grid gap-4 rounded-[2rem] bg-white/40 p-5 shadow-[0_24px_60px_rgba(37,20,47,0.05)] sm:grid-cols-2 sm:p-6 lg:p-8">
            {featuredCreators.map((user, i) => (
              <Link key={user.username} href={`/profile/${user.username}`}>
                <Card hover className={i === 0 ? "bg-pink-soft/80 p-6" : "bg-white p-6"}>
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-sm font-semibold text-white font-header ${
                        i === 0 ? "bg-purple-dark" : "bg-pink"
                      }`}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className="font-header font-medium text-purple-dark">{user.displayName}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted font-body">{user.bio}</p>
                      <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-dark font-header">
                        <Users className="h-3.5 w-3.5" />
                        {user.followers.toLocaleString()} followers
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/projects">
              <Button variant="outline">
                Create your profile
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
