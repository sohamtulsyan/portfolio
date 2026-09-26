import HeroBackground from "@/components/effects/HeroBackground";
import Loader from "@/components/effects/Loader";
import PageTransition from "@/components/effects/PageTransition";
import Splash from "@/components/effects/Splash";
import type { ThemeDefinition } from "../types";

/**
 * Neon Glass: the component half of the theme. theme.css holds every value;
 * this file picks which effect components fill the layout's slots.
 */
export const neonGlass: ThemeDefinition = {
  name: "Neon Glass",
  slots: {
    HeroBackground,
    PageTransition,
    Splash,
    Loader,
  },
  hero: {
    /** How the portrait sits in the hero: "framed" (glass card) or "cutout" (transparent PNG on the floor). */
    portrait: "framed",
  },
  themeColor: "#353535",
};
