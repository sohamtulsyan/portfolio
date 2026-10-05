"use client";

/**
 * Aceternity UI "Layout Text Flip", adapted:
 * - colours come from theme tokens instead of bg-white / dark: variants
 *   (dark: follows the OS, not html[data-theme]),
 * - `className` / `chipClassName` props so the caller sets the type,
 * - the first word renders without its entrance (it's in the server HTML),
 * - the static text no longer has a global layoutId,
 * - the interval re-arms when `words` or `duration` change, and skips while
 *   the tab is hidden,
 * - the rotating part is hidden from screen readers; an sr-only sentence
 *   lists every word instead,
 * - under reduced motion the words cross-fade instead of sliding.
 * The chip's layout spring and the blur-slide word swap are the original's.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";

function listSentence(text: string, words: string[]) {
  const items = words.map((w) => (/^[A-Z]{2,}$/.test(w) ? w : w.toLowerCase()));
  const list = items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items.at(-1)}` : items[0];
  return `${text} ${list}.`;
}

export const LayoutTextFlip = ({
  text,
  words,
  duration = 3000,
  className,
  chipClassName,
}: {
  text: string;
  words: string[];
  duration?: number;
  className?: string;
  chipClassName?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Hidden tabs throttle animation frames, so exiting words would pile up.
      if (document.hidden) return;
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <MotionConfig reducedMotion="user">
      <span className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
        <span className="sr-only">{listSentence(text, words)}</span>
        <span aria-hidden="true">{text}</span>

        <motion.span
          layout
          aria-hidden="true"
          transition={{ type: "spring", bounce: 0, duration: 0.45 }}
          className={cn(
            "relative w-fit overflow-hidden rounded-md bg-surface px-3 py-1 text-fg shadow-[var(--shadow-float)] ring-1 ring-line",
            chipClassName,
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={currentIndex}
              initial={{ y: "-110%", filter: "blur(8px)", opacity: 0 }}
              animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
              exit={{ y: "120%", filter: "blur(8px)", opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block whitespace-nowrap"
            >
              {words[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </span>
    </MotionConfig>
  );
};
