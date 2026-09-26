import { site } from "@/config/site";
import type { Profile } from "@/lib/notion/types";

/**
 * Where "Download résumé" points. Notion's Resume file is copied to
 * /cms/<fileName> at build time; otherwise the site config fallback; otherwise
 * the Résumé page, which explains it isn't uploaded yet.
 */
export function resumeHref(profile: Profile): { href: string; download?: string; available: boolean } {
  const file = profile.resumeUrl ?? site.resume.fallbackPath;
  if (file) return { href: file, download: site.resume.fileName, available: true };
  return { href: "/resume", available: false };
}
