import type { MetadataRoute } from "next";
import { navItems, site } from "@/config/site";
import { getProjects } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = navItems.map((item) => ({ url: new URL(item.href, site.url).toString() }));
  const projects = getProjects().map((p) => ({ url: new URL(`/projects/${p.slug}/`, site.url).toString() }));
  return [...pages, ...projects];
}
