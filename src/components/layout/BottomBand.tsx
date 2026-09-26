import ProgressiveBlur from "@/components/effects/ProgressiveBlur";
import FloatingNavigation from "@/components/nav/FloatingNavigation";
import type { Social } from "@/lib/notion/types";
import { SocialLinks } from "./SocialLinks";

/**
 * Fixed chrome at the bottom of every page: SmoothUI progressive blur so
 * content dissolves under the controls, the floating nav in the centre, and
 * the socials dock at the right on wide screens.
 */
export function BottomBand({ socials }: { socials: Social[] }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-[var(--band-height)]">
      <ProgressiveBlur direction="bottom" blur={20} layers={7} />
      <div aria-hidden="true" className="absolute inset-0 [background:var(--band-tint)]" />
      <div className="container-page relative flex h-full items-end justify-center pb-5 sm:pb-7">
        <FloatingNavigation className="pointer-events-auto" />
        <SocialLinks
          socials={socials.slice(0, 5)}
          variant="dock"
          className="pointer-events-auto absolute right-[var(--layout-gutter)] bottom-7 hidden xl:flex"
        />
      </div>
    </div>
  );
}
