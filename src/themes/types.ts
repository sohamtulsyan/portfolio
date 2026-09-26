import type { ComponentType } from "react";

/**
 * Contract every theme fulfils. The layout only renders slots from the active
 * theme, so a new theme can swap any effect without touching pages.
 */
export interface ThemeDefinition {
  name: string;
  slots: {
    /** Full-bleed layer behind the hero content. */
    HeroBackground: ComponentType<{ className?: string }>;
    /** Route-change effect, mounted once in the root layout. */
    PageTransition: ComponentType;
    /** First-load overlay, mounted once in the root layout. Can render null. */
    Splash: ComponentType;
    /** Inline loading indicator. */
    Loader: ComponentType<{ label?: string }>;
  };
  hero: {
    portrait: "framed" | "cutout";
  };
  /** Browser UI colour (address bar on mobile). Must be a literal colour. */
  themeColor: string;
}
