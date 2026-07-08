import { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const pages = [
    "",
    "/patterns",
    "/traditional-crafts",
    "/planner",
    "/shop-finder",
    "/events",
    "/scanner",
    "/feed",
    "/community",
    "/tutorials",
    "/marketplace",
    "/projects",
    "/about",
    "/auth/sign-in",
    "/auth/sign-up",
  ];

  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
