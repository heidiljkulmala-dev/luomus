import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Pattern } from "@/types";

const badgeVariant = (i: number) =>
  i % 3 === 0 ? "purple" : i % 3 === 1 ? "pink" : "yellow";

export function HeroShowcase({ patterns }: { patterns: Pattern[] }) {
  const [hero, topRight, midRight, bottomLeft, bottomRight] = patterns;

  if (!hero) return null;

  return (
    <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-5 rounded-[2rem] bg-white/55 shadow-[0_30px_80px_rgba(37,20,47,0.08)]"
      />

      <div className="relative grid grid-cols-2 gap-3 sm:h-[min(560px,72vh)] sm:grid-cols-12 sm:grid-rows-8">
        <ShowcaseTile
          pattern={hero}
          href="/patterns"
          className="col-span-2 sm:col-span-7 sm:row-span-5 min-h-[220px] sm:min-h-0"
          badgeVariant={badgeVariant(0)}
          priority
          sizes="(max-width: 1024px) 100vw, 42vw"
        />

        {topRight && (
          <ShowcaseTile
            pattern={topRight}
            href="/patterns"
            className="col-span-1 sm:col-span-5 sm:row-span-3 min-h-[140px] sm:min-h-0"
            badgeVariant={badgeVariant(1)}
            sizes="(max-width: 1024px) 50vw, 28vw"
          />
        )}

        {midRight && (
          <ShowcaseTile
            pattern={midRight}
            href="/patterns"
            className="col-span-1 sm:col-span-5 sm:row-span-2 min-h-[120px] sm:min-h-0"
            badgeVariant={badgeVariant(2)}
            sizes="(max-width: 1024px) 50vw, 28vw"
          />
        )}

        {bottomLeft && (
          <ShowcaseTile
            pattern={bottomLeft}
            href="/patterns"
            className="col-span-1 sm:col-span-4 sm:row-span-3 min-h-[130px] sm:min-h-0"
            badgeVariant={badgeVariant(3)}
            sizes="(max-width: 1024px) 50vw, 22vw"
          />
        )}

        {bottomRight && (
          <ShowcaseTile
            pattern={bottomRight}
            href="/patterns"
            className="col-span-1 sm:col-span-3 sm:row-span-3 min-h-[130px] sm:min-h-0"
            badgeVariant={badgeVariant(4)}
            sizes="(max-width: 1024px) 50vw, 18vw"
          />
        )}
      </div>

      <p className="mt-4 text-center text-xs uppercase tracking-[0.18em] text-muted sm:text-left font-header">
        Real projects from makers around the world
      </p>
    </div>
  );
}

function ShowcaseTile({
  pattern,
  href,
  className,
  badgeVariant,
  priority = false,
  sizes,
}: {
  pattern: Pattern;
  href: string;
  className?: string;
  badgeVariant: "purple" | "pink" | "yellow";
  priority?: boolean;
  sizes: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-sm ring-1 ring-purple-dark/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:ring-purple-dark/10 ${className ?? ""}`}
    >
      <Image
        src={pattern.image}
        alt={pattern.title}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover saturate-[0.9] transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-dark/75 via-purple-dark/12 to-transparent opacity-85" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <Badge variant={badgeVariant} className="mb-1.5 capitalize">
          {pattern.craft}
        </Badge>
        <p className="line-clamp-2 font-header text-sm font-semibold leading-snug text-white">
          {pattern.title}
        </p>
      </div>
    </Link>
  );
}
