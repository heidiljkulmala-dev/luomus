import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { site, craftCategories } from "@/lib/site";

export const metadata = {
  title: "About",
  description: `About ${site.name} — a global handmade craft community for slow making in a technology-dominated world.`,
};

export default function AboutPage() {
  return (
    <div className="page-shell min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 lg:px-6">
        <Logo />
        <Badge variant="accent" className="mt-6 mb-4">About</Badge>
        <h1 className="font-header text-3xl font-bold text-purple-dark tracking-tight">
          Making by hand, together
        </h1>
        <p className="mt-4 text-muted leading-relaxed">
          {site.name} is a global community for people who make things with their hands — for joy, for work, or for
          both. In a technology-dominated world built around screens and speed, there is still room for slow craft,
          patient skill-building, and the tactile satisfaction that only hands-on making provides.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          Makers from every continent share work-in-progress, ask questions, trade skills, and find real human
          connection here. Beading, knitting, pottery, fiber crafts, and more live side by side — a worldwide network
          of people who believe making by hand still matters.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          We also believe craft traditions deserve respect. Through Cultures of Making, you can learn about techniques,
          histories, and makers from around the world — studying with care, honoring sources, and approaching cultural
          craft with humility rather than appropriation.
        </p>

        <div className="mt-10 pt-8 border-t border-border">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-dark mb-3">Crafts</h2>
          <div className="flex flex-wrap gap-2">
            {craftCategories.map((c) => (
              <span key={c.id} className="rounded-md border border-border bg-white px-2.5 py-1 text-sm text-muted">
                {c.emoji} {c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Link href="/patterns"><Button>Browse templates</Button></Link>
        </div>
      </div>
    </div>
  );
}
