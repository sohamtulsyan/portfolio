"use client";

import dynamic from "next/dynamic";
import type React from "react";
import { useReducedMotion } from "motion/react";
import { useColorTokens } from "@/lib/theme-tokens";
import { cn } from "@/lib/utils";

const LiquidWave = dynamic(() => import("./vendor/LiquidWave"), { ssr: false });

const TOKENS = ["--wave-color-1", "--wave-color-2", "--wave-color-3"] as const;

/**
 * Hero background: RareUI Liquid Wave, coloured from the theme's
 * --wave-color-* tokens. Pointer input is read from this layer, so keep the
 * content above it `pointer-events-none` except for real controls.
 */
export default function HeroBackground({ className }: { className?: string }) {
  const colors = useColorTokens(TOKENS);
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className={cn("absolute inset-0 overflow-hidden", className)}>
      {colors && !reduceMotion ? (
        <LiquidWave
          color1={colors["--wave-color-1"]}
          color2={colors["--wave-color-2"]}
          color3={colors["--wave-color-3"]}
          mouseForce={26}
          cursorSize={120}
          resolution={0.5}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={3}
          style={{
            touchAction: "pan-y",
            opacity: "var(--wave-opacity, 1)",
            mixBlendMode: "var(--wave-blend, normal)" as React.CSSProperties["mixBlendMode"],
            filter: "var(--wave-filter, none)",
          }}
        />
      ) : null}
      {/* Floor fade so the wave settles into the page instead of ending on a hard edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
