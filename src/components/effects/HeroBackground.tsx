"use client";

import dynamic from "next/dynamic";
import type React from "react";
import { useReducedMotion } from "motion/react";
import { useColorTokens } from "@/lib/theme-tokens";
import { cn } from "@/lib/utils";

const GradientWaves = dynamic(() => import("./vendor/GradientWaves"), { ssr: false });

const TOKENS = ["--wave-horizon-color", "--wave-body-color", "--wave-crest-color"] as const;

/**
 * Hero background: React Bits Gradient Waves configured to the theme's
 * palette (#12484c horizon, #2B7574 wave, #71677C crest).
 */
export default function HeroBackground({ className }: { className?: string }) {
  const colors = useColorTokens(TOKENS);
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className={cn("absolute inset-0 overflow-hidden", className)}>
      {colors && !reduceMotion ? (
        <GradientWaves
          horizonColor={colors?.["--wave-horizon-color"] ?? "#12484c"}
          waveColor={colors?.["--wave-body-color"] ?? "#2B7574"}
          crestColor={colors?.["--wave-crest-color"] ?? "#71677C"}
          waveRatio={0.5}
          tilt={0.2}
          grainIntensity={0.28}
          mouseInteraction={false}
          amplitude={1}
          className="h-full w-full"
        />
      ) : null}
      {/* Floor fade so the wave settles into the page instead of ending on a hard edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
