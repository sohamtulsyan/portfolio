"use client";

// SmoothUI "Progressive Blur" (github.com/educlopez/smoothui), adapted only to
// import `cn` from this project. Stacked backdrop-filter layers, each doubling
// the blur and masked one band further along.

import { useReducedMotion } from "motion/react";
import { type CSSProperties, type ReactNode, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

export type ProgressiveBlurDirection = "top" | "bottom" | "left" | "right" | "radial";

export interface ProgressiveBlurProps {
  /** Peak blur radius in pixels, reached by the last layer. */
  blur?: number;
  children?: ReactNode;
  className?: string;
  direction?: ProgressiveBlurDirection;
  /** Fade the stack in on mount. Ignored when reduced motion is preferred. */
  fadeIn?: boolean;
  /** Opacity applied to every layer, `0` to `1`. */
  intensity?: number;
  /** Number of stacked layers (2-12). More layers means a smoother ramp. */
  layers?: number;
}

const TRANSPARENT = "rgba(0, 0, 0, 0)";
const OPAQUE = "rgb(0, 0, 0)";
const STOPS_PER_LAYER = 3;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const buildMask = (direction: ProgressiveBlurDirection, index: number, layers: number) => {
  const step = 100 / layers;
  const start = index * step;
  const rampIn = (index + 1) * step;
  const rampOut = (index + STOPS_PER_LAYER - 1) * step;
  const end = (index + STOPS_PER_LAYER) * step;
  const stops = `${TRANSPARENT} ${start}%, ${OPAQUE} ${rampIn}%, ${OPAQUE} ${rampOut}%, ${TRANSPARENT} ${end}%`;
  return direction === "radial"
    ? `radial-gradient(circle at center, ${stops})`
    : `linear-gradient(to ${direction}, ${stops})`;
};

export default function ProgressiveBlur({
  blur = 24,
  children,
  className,
  direction = "bottom",
  fadeIn = true,
  intensity = 1,
  layers = 6,
}: ProgressiveBlurProps) {
  const shouldReduceMotion = useReducedMotion();
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const layerCount = Math.max(2, Math.min(12, Math.round(layers)));
  const opacity = clamp01(intensity);
  const shouldFade = fadeIn && !shouldReduceMotion;
  const isVisible = hasMounted || !shouldFade;

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: shouldFade ? "opacity 250ms cubic-bezier(.23, 1, .32, 1)" : undefined,
        }}
      >
        {Array.from({ length: layerCount }, (_, index) => {
          const layerBlur = blur / 2 ** (layerCount - 1 - index);
          const mask = buildMask(direction, index, layerCount);
          const style: CSSProperties = {
            backdropFilter: `blur(${layerBlur}px)`,
            WebkitBackdropFilter: `blur(${layerBlur}px)`,
            maskImage: mask,
            WebkitMaskImage: mask,
            inset: 0,
            opacity,
            position: "absolute",
            zIndex: index,
          };
          return <div key={index} style={style} />;
        })}
      </div>

      {children ? <div className="pointer-events-auto relative z-10 h-full w-full">{children}</div> : null}
    </div>
  );
}
