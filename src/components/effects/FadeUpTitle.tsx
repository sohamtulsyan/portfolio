"use client";

import { MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { FadeUpWord } from "./vendor/FadeUpWord";

/**
 * BadtzUI "Fade Up Word" set as display type. The vendored file stays
 * unmodified; this wrapper overrides its size/tracking/gap with theme tokens
 * (tailwind-merge drops the originals) and honours reduced motion, which
 * keeps the fade but drops the lift.
 */
export default function FadeUpTitle({
  children,
  id,
  className,
}: {
  children: string;
  id?: string;
  className?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <FadeUpWord
        as="h1"
        id={id}
        className={cn(
          "display text-[length:var(--type-size-display)] gap-x-[0.24em] gap-y-0 tracking-[var(--type-tracking-display)] text-fg",
          className,
        )}
      >
        {children}
      </FadeUpWord>
    </MotionConfig>
  );
}
