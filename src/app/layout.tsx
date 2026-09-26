import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";
import { BottomBand } from "@/components/layout/BottomBand";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { splashScript } from "@/components/effects/splash-script";
import { site } from "@/config/site";
import { getProfile, getSocials } from "@/lib/content";
import { theme } from "@/themes";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
  themeColor: theme.themeColor,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const profile = getProfile();
  const socials = getSocials();
  const { PageTransition, Splash } = theme.slots;

  return (
    <html lang={site.locale} className={urbanist.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: splashScript }} />
        <noscript>
          <style>{".splash{display:none}"}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[110] rounded-pill bg-fg px-4 py-2 font-semibold text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <Splash />
        <main id="main">
          {children}
          <SiteFooter profile={profile} socials={socials} />
        </main>
        <BottomBand socials={socials} />
        <PageTransition />
      </body>
    </html>
  );
}
