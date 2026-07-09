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
import { Button, SMALL_CHIP_PATTERN } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { showcaseItems } from "@/lib/data/showroom";
import { featuredCreators, users } from "@/lib/data/users";
import { communityPosts, craftSubforums } from "@/lib/data/community";
import { craftCategories, site } from "@/lib/site";
import { continents } from "@/lib/data/traditional-crafts";
import { craftEvents, formatEventDate } from "@/lib/data/events";
import { getCountryFlag, getCountryName } from "@/lib/geo/countries";

const pillars = [
  {
    title: "Profile",
    description: "Build your maker page — showcase finished crafts, work-in-progress, and tutorials you have created for others.",
    href: "/auth/sign-in",
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
const craftCategoryThumbnails: Record<string, { src: string; alt: string }> = {
  beading: {
    src: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=120&q=70",
    alt: "Colorful handmade beaded jewelry",
  },
  silversmithing: {
    src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=120&q=70",
    alt: "Silver jewelry and metalwork details",
  },
  fiber: {
    src: "https://images.unsplash.com/photo-1613332097774-b6f4db76b5ab?auto=format&fit=crop&w=120&q=70",
    alt: "Yarn skeins for knitting and crochet",
  },
  pottery: {
    src: "https://images.unsplash.com/photo-1612196808214-b7e239e5f09f?auto=format&fit=crop&w=120&q=70",
    alt: "Handmade ceramic pottery pieces",
  },
  painting: {
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=120&q=70",
    alt: "Paint brushes and paint palette",
  },
  drawing: {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=120&q=70",
    alt: "Sketching tools on drawing paper",
  },
  macrame: {
    src: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=120&q=70",
    alt: "Macrame knots and woven fiber texture",
  },
  paper: {
    src: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=120&q=70",
    alt: "Paper crafts and cutting tools",
  },
  sewing: {
    src: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=120&q=70",
    alt: "Embroidery thread and sewing materials",
  },
  wood: {
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=120&q=70",
    alt: "Wood carving tools and woodwork",
  },
  candle: {
    src: "https://images.unsplash.com/photo-1603006905393-c6bcb1768c95?auto=format&fit=crop&w=120&q=70",
    alt: "Hand-poured candles with dried flowers",
  },
};

const countryGeoLookup: Record<string, { x: number; y: number }> = {
  "united states": { x: 240, y: 160 },
  canada: { x: 230, y: 120 },
  mexico: { x: 220, y: 200 },
  brazil: { x: 330, y: 285 },
  argentina: { x: 305, y: 365 },
  chile: { x: 280, y: 355 },
  colombia: { x: 275, y: 245 },
  peru: { x: 275, y: 290 },
  italy: { x: 490, y: 165 },
  france: { x: 470, y: 155 },
  spain: { x: 450, y: 170 },
  germany: { x: 485, y: 145 },
  "united kingdom": { x: 455, y: 132 },
  portugal: { x: 440, y: 175 },
  nigeria: { x: 500, y: 235 },
  kenya: { x: 545, y: 250 },
  ghana: { x: 485, y: 230 },
  "south africa": { x: 525, y: 340 },
  morocco: { x: 460, y: 205 },
  egypt: { x: 530, y: 200 },
  japan: { x: 760, y: 165 },
  china: { x: 690, y: 185 },
  india: { x: 650, y: 220 },
  "south korea": { x: 735, y: 165 },
  indonesia: { x: 725, y: 275 },
  thailand: { x: 695, y: 230 },
  australia: { x: 780, y: 340 },
  "new zealand": { x: 850, y: 365 },
  fiji: { x: 825, y: 318 },
};

export default function HomePage() {
  const heroProjects = showcaseItems.slice(0, 5);
  const posts = communityPosts.slice(0, 3);
  const allUsers = Object.values(users);
  const todayIso = new Date().toISOString().slice(0, 10);
  const upcomingEvents = craftEvents
    .filter((event) => event.startDate >= todayIso)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const nextEvent = upcomingEvents[0] ?? [...craftEvents].sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  const nextEventDate = nextEvent ? formatEventDate(nextEvent.startDate, nextEvent.endDate) : "";
  const nextEventLocation = nextEvent
    ? `${nextEvent.city}, ${getCountryName(nextEvent.countryCode)} ${getCountryFlag(nextEvent.countryCode)}`
    : "";
  const userLocations = allUsers.map((profile) => {
    const locationParts = profile.location.split(",");
    const countryKey = locationParts[locationParts.length - 1]?.trim().toLowerCase() ?? "";
    return { countryKey };
  });

  const countryCounts = userLocations.reduce<Record<string, number>>((acc, location) => {
    if (!location.countryKey) return acc;
    acc[location.countryKey] = (acc[location.countryKey] ?? 0) + 1;
    return acc;
  }, {});

  const mapPoints = Object.entries(countryCounts)
    .map(([countryKey, count]) => {
      const geo = countryGeoLookup[countryKey];
      if (!geo) return null;
      return {
        countryKey,
        count,
        x: geo.x,
        y: geo.y,
      };
    })
    .filter((point): point is NonNullable<typeof point> => Boolean(point))
    .sort((a, b) => b.count - a.count || a.countryKey.localeCompare(b.countryKey));

  const totalMappedUsers = mapPoints.reduce((sum, point) => sum + point.count, 0);

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
              Different ways to connect, learn, and share.
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

      <section className="home-section-crafts w-full py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="mb-8 max-w-3xl">
            <Badge variant="amber" className="mb-3 uppercase tracking-[0.2em]">
              Ways of crafting
            </Badge>
            <h2 className="font-header text-4xl font-bold tracking-[-0.045em] text-purple-dark lg:text-5xl">
              Explore different ways of crafting.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted font-body">
              Choose a craft path to see how makers approach beading, fiber arts, pottery, painting,
              and more through finished work in the Showroom.
            </p>
          </div>
          <div className="grid gap-4 rounded-[2rem] bg-white/40 p-5 shadow-[0_24px_60px_rgba(37,20,47,0.05)] sm:grid-cols-2 sm:p-6 lg:grid-cols-4 lg:p-8">
            {craftCategories.map((c) => {
              const thumbnail = craftCategoryThumbnails[c.id] ?? craftCategoryThumbnails.beading;
              return (
                <Link
                  key={c.id}
                  href={`/showroom?craft=${c.id}`}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-dark/35"
                >
                  <Card hover className="group h-full p-3 sm:p-4">
                    <div className="mb-3 overflow-hidden rounded-xl border border-purple-dark/10 bg-white/80">
                      <img
                        src={thumbnail.src}
                        alt={thumbnail.alt}
                        loading="lazy"
                        className="h-28 w-full object-cover transition-transform duration-200 group-hover:scale-[1.03] sm:h-32"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="line-clamp-1 text-sm font-semibold text-purple-dark font-header">
                        <span className="mr-1.5">{c.emoji}</span>
                        {c.label}
                      </h3>
                      <ArrowRight className="h-4 w-4 shrink-0 text-purple-dark/80 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-section-heritage w-full py-14 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="rounded-[2rem] bg-purple-soft/80 p-5 shadow-[0_20px_50px_rgba(37,20,47,0.04)] lg:p-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
              <div>
                <div className="max-w-2xl">
                  <Badge variant="purple" className="mb-3 uppercase tracking-[0.2em]">
                    Heritage traditions
                  </Badge>
                  <h2 className="font-header text-4xl font-bold tracking-[-0.045em] text-purple-dark lg:text-5xl">
                    Traditional crafts from every continent.
                  </h2>
                  <p className="mt-4 leading-8 text-muted font-body">
                    Discover making traditions rooted in culture and place, shared by makers around the world — from African beadwork and Asian
                    porcelain to European lace and Pacific weaving.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {continents.map((c) => {
                    return (
                      <Link
                        key={c.id}
                        href={`/traditional-crafts?continent=${c.id}`}
                        className={SMALL_CHIP_PATTERN}
                      >
                        <span>{c.emoji}</span>
                        {c.label}
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-6">
                  <Link href="/traditional-crafts">
                    <Button>
                      Browse all traditions
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-purple-dark/12 bg-white/70 p-4 shadow-[0_16px_38px_rgba(37,20,47,0.08)] sm:p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-header text-xs uppercase tracking-[0.18em] text-purple-dark/70">
                      Signup activity map
                    </p>
                    <p className="mt-1 text-sm text-purple-dark font-body">
                      {totalMappedUsers} makers mapped across {mapPoints.length} countries
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-purple-dark/10 bg-gradient-to-b from-white to-purple-soft/40 p-3">
                  <svg viewBox="0 0 960 460" className="h-44 w-full sm:h-48" role="img" aria-label="World map with signup markers">
                    <defs>
                      <linearGradient id="waterTone" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                        <stop offset="100%" stopColor="rgba(223,198,233,0.52)" />
                      </linearGradient>
                      <linearGradient id="landTone" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(80,45,96,0.26)" />
                        <stop offset="100%" stopColor="rgba(80,45,96,0.18)" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="960" height="460" fill="url(#waterTone)" />
                    <g className="stroke-purple-dark/10" strokeWidth="1">
                      <line x1="0" y1="115" x2="960" y2="115" />
                      <line x1="0" y1="230" x2="960" y2="230" />
                      <line x1="0" y1="345" x2="960" y2="345" />
                    </g>
                    <g fill="url(#landTone)" className="stroke-purple-dark/10" strokeWidth="1.2">
                      <path d="M74 134l26-22 44-14 58-7 46 10 40 22 27 30-2 25-20 20-44 3-36-12-34-18-24 5-30-7-22 15-26-9-15-17 6-24z" />
                      <path d="M213 213l20 18 32 8 24 20 6 26-9 42-17 37 10 25-8 20-23 10-21-18-13-35-15-29-10-32 6-39z" />
                      <path d="M405 121l35-19 54-6 41 9 32 20 24-10 24 8 22 20 6 25-12 18-30 7-22 10-20 1-22 18-26 7-24-8-16-18-18-26 1-24z" />
                      <path d="M465 224l28 14 22 17 21 31 4 37-8 43-23 40-31 20-24-13-8-37 8-37-10-38 5-33z" />
                      <path d="M562 144l38-14 60-2 49 8 28-4 44 14 30 24 9 26-13 24-42 9-30-2-25 15-37 14-30 20-29 6-24-9-17-24-13-23-1-23z" />
                      <path d="M701 294l24-10 43 2 30-8 41 17 17 26-3 30-19 21-43 8-50-2-29-16-18-27 0-24z" />
                      <path d="M847 356l16-7 12 8-8 16-18-2z" />
                    </g>
                    {mapPoints.map((point) => (
                      <g key={point.countryKey}>
                        <circle cx={point.x} cy={point.y} r={2.7} className="fill-pink/90 stroke-white/80" strokeWidth="1.3" />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section-events w-full py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="grid items-center gap-5 rounded-[2rem] bg-white/50 p-5 shadow-[0_20px_50px_rgba(37,20,47,0.04)] lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
            <div className="min-w-0">
              <Badge variant="pink" className="mb-3 uppercase tracking-[0.2em]">
                Craft events
              </Badge>
              <h2 className="font-header text-3xl font-bold tracking-[-0.035em] text-purple-dark lg:text-4xl">
                Markets, fairs, and meetups near you.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted font-body">
                Find local craft markets, maker fairs, workshops, and community gatherings — filtered
                by craft type and highlighting the next upcoming event in your area first.
              </p>
              <Link href="/events" className="mt-5 inline-block">
                <Button size="lg">
                  <CalendarDays className="h-4 w-4" />
                  Browse events
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-56 overflow-hidden rounded-[1.5rem] shadow-[0_16px_40px_rgba(37,20,47,0.08)] sm:h-64 lg:h-72">
              <img
                src="https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?auto=format&fit=crop&w=1400&q=80"
                alt="Handmade fair with crafts displayed on market tables"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-dark/35 via-purple-dark/10 to-transparent" />
              <div className="absolute bottom-3 left-3 rounded-xl bg-white/80 px-3 py-2 backdrop-blur-sm">
                <p className="font-header text-xs uppercase tracking-[0.16em] text-purple-dark/80">Next in your area</p>
                <p className="text-sm text-purple-dark font-body">
                  {nextEvent ? `${nextEventDate} · ${nextEventLocation}` : "Upcoming community workshops, markets, and maker meetups"}
                </p>
                {nextEvent && (
                  <p className="text-[11px] text-purple-dark/70 font-body">
                    Local fallback pick from upcoming events list
                  </p>
                )}
              </div>
            </div>
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
                  className="inline-flex items-center gap-1.5 rounded-md border border-purple-dark/20 bg-white/90 px-2.5 py-1.5 text-xs text-purple-dark transition-colors hover:border-purple-dark/35 hover:bg-purple-soft/60 font-header"
                >
                  <span>{subforum.emoji}</span>
                  {subforum.label.split(" & ")[0]}
                </Link>
              ))}
              <Link
                href="/community"
                className="inline-flex items-center gap-1 rounded-md border border-purple-dark/20 bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-purple-dark transition-colors hover:border-purple-dark/35 hover:bg-purple-soft/60 font-header"
              >
                All subforums
              </Link>
            </div>
            <Link href="/community" className="mt-5 inline-block">
                <Button>
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
              <Button>
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
