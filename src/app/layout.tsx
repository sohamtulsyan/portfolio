import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import FloatingNavigation from "@/components/nav/FloatingNavigation";
import { site } from "@/config/site";
import { getProfile, getSocials } from "@/lib/content";
import { themeScript } from "@/lib/theme-script";
import { theme } from "@/themes";
import "./globals.css";

/** Fallback for non-Apple platforms; Apple devices get SF Pro (see --type-font-sans). */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

export function generateMetadata(): Metadata {
  const profile = getProfile();
  return {
    metadataBase: new URL(site.url),
    title: { default: `${profile.name}, ${profile.role}`, template: `%s | ${profile.name}` },
    description: profile.seoDescription,
    openGraph: {
      type: "website",
      siteName: profile.name,
      locale: site.locale,
      images: [{ url: profile.photoUrl ?? site.portrait.src }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: theme.themeColor.dark },
    { media: "(prefers-color-scheme: light)", color: theme.themeColor.light },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const profile = getProfile();
  const socials = getSocials();

  return (
    <html lang={site.locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[110] rounded-pill bg-fg px-4 py-2 font-semibold text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <FloatingNavigation socials={socials} />
        <main id="main">
          {children}
          <SiteFooter profile={profile} socials={socials} />
        </main>
      </body>
    </html>
  );
}
