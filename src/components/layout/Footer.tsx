import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/lib/site";

const footerLinks = {
  Explore: [
    { href: "/showroom", label: "Showroom" },
    { href: "/traditional-crafts", label: "Traditional crafts" },
    { href: "/tutorials", label: "Tutorials" },
    { href: "/shop-finder", label: "Suppliers" },
    { href: "/events", label: "Craft events" },
  ],
  Community: [
    { href: "/feed", label: "Feed" },
    { href: "/community", label: "Forum" },
    { href: "/marketplace", label: "Shop" },
  ],
  Site: [
    { href: "/about", label: "About" },
    { href: "#", label: "Privacy" },
    { href: "#", label: "Terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-purple-dark text-white mt-auto font-header">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo light />
            <p className="text-white/65 text-sm leading-relaxed mt-3 max-w-xs font-body">
              {site.tagline} A global community for crafters to connect and share their work.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-yellow mb-3">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-white/55 hover:text-pink-light transition-colors font-body">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 text-sm text-white/65 font-body">
          © {new Date().getFullYear()} {site.name}
        </div>
      </div>
    </footer>
  );
}
