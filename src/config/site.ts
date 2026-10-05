/**
 * Static site config. Content lives in Notion; this file holds what the site
 * needs even when Notion is unreachable (fallbacks, routes, SEO defaults).
 */

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  name: "Soham Tulsyan",
  role: "Product generalist",
  description:
    "Soham Tulsyan is a product generalist working across product thinking, design and code.",
  locale: "en",

  /**
   * Hero illustration, one per colour scheme (transparent line art, lines
   * tinted to each scheme's text colour). Cropped from public/hero photo/.
   */
  heroArt: {
    light: "/images/hero-light.webp",
    dark: "/images/hero-dark.webp",
    width: 1030,
    height: 917,
  },

  /** Used on the About page and as the share image when the Notion Profile has no photo yet. */
  portrait: {
    src: "/images/portrait.jpg",
    width: 1600,
    height: 1067,
    /** Where the subject sits inside the photo, used for cropping in framed mode. */
    focus: "62% 40%",
  },

  resume: {
    /** Used when the Notion Profile has no Resume file. Drop a PDF in /public and set e.g. "/resume.pdf". */
    fallbackPath: null as string | null,
    fileName: "Soham-Tulsyan-Resume.pdf",
  },

  /** Content revalidation window in seconds (Notion file URLs expire after 1 hour). */
  revalidateSeconds: 900,
} as const;

export type NavKey = "home" | "about" | "projects" | "work" | "resume" | "connect";

export const navItems: { key: NavKey; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About", href: "/about" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "work", label: "Work", href: "/work" },
  { key: "resume", label: "Résumé", href: "/resume" },
  { key: "connect", label: "Connect", href: "/connect" },
];
