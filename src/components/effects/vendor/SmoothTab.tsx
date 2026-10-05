"use client";

/**
 * KokonutUI "Smooth Tab" (@dorianbaffier, MIT), adapted:
 * - the tab bar sits above the panel and holds any number of tabs (the
 *   original is a fixed 4-column, 400px toolbar under a 200px card),
 * - colours come from theme tokens instead of shadcn names and per-item
 *   Tailwind colours built at runtime (which Tailwind can't detect),
 * - the decorative waveform card is gone; each item brings its own `content`,
 * - controlled `selectedId` so the caller can sync it with the URL,
 * - full tabs pattern: arrow keys / Home / End move and select, tabpanel role,
 * - the pill is positioned imperatively (no layout read → setState loop) and
 *   follows resizes; before it's placed the selected tab fills itself; the
 *   panel height follows its content (popLayout),
 * - under reduced motion panels cross-fade instead of sliding.
 * The spring pill and the direction-aware blur slide are the original's.
 */

import { animate, AnimatePresence, motion, MotionConfig } from "motion/react";
import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SmoothTabItem {
  id: string;
  title: ReactNode;
  /** Accessible name when `title` changes with screen size. */
  label?: string;
  content: ReactNode;
}

const slideVariants = {
  enter: (direction: number) =>
    direction === 0 ? { opacity: 1 } : { x: direction > 0 ? "100%" : "-100%", opacity: 0, filter: "blur(8px)", scale: 0.95 },
  center: { x: 0, opacity: 1, filter: "blur(0px)", scale: 1 },
  exit: (direction: number) =>
    direction === 0
      ? { opacity: 0, transition: { duration: 0 } }
      : { x: direction < 0 ? "100%" : "-100%", opacity: 0, filter: "blur(8px)", scale: 0.95 },
};

const transition = { duration: 0.4, ease: [0.32, 0.72, 0, 1] as const };
const pillSpring = { type: "spring", stiffness: 400, damping: 30 } as const;

export default function SmoothTab({
  items,
  selectedId,
  direction,
  onSelect,
  label,
  idPrefix = "smooth-tab",
  className,
}: {
  items: SmoothTabItem[];
  selectedId: string;
  /** -1 / 1 for the slide direction, 0 to swap without animating. */
  direction: number;
  onSelect: (id: string) => void;
  label: string;
  idPrefix?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const placed = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const pill = pillRef.current;
    if (!container || !pill) return;

    const place = (instant: boolean) => {
      const button = buttonRefs.current.get(selectedId);
      if (!button) return;
      const target = { x: button.offsetLeft, width: button.offsetWidth };
      animate(pill, target, instant ? { duration: 0 } : pillSpring);
      if (!instant) button.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    };

    place(!placed.current);
    placed.current = true;
    container.dataset.ready = "";

    const observer = new ResizeObserver(() => place(true));
    observer.observe(container);
    return () => observer.disconnect();
  }, [selectedId]);

  const index = items.findIndex((item) => item.id === selectedId);
  const selected = items[index];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = items.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    onSelect(items[next].id);
    buttonRefs.current.get(items[next].id)?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn("flex flex-col gap-6", className)}>
        {/* Tab bar */}
        <div className="-mx-1 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            ref={containerRef}
            role="tablist"
            aria-label={label}
            className="group/tabs relative flex w-max gap-0.5 rounded-pill sm:gap-1 bg-surface p-1 ring-1 ring-line"
          >
            <span
              ref={pillRef}
              aria-hidden="true"
              className="absolute top-1 bottom-1 left-0 z-[1] rounded-pill bg-[var(--btn-primary-bg)] shadow-[var(--btn-primary-shadow)]"
            />
            {items.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    if (el) buttonRefs.current.set(item.id, el);
                    else buttonRefs.current.delete(item.id);
                  }}
                  type="button"
                  role="tab"
                  id={`${idPrefix}-tab-${item.id}`}
                  aria-label={item.label}
                  aria-selected={isSelected}
                  aria-controls={`${idPrefix}-panel-${item.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => onSelect(item.id)}
                  onKeyDown={onKeyDown}
                  className={cn(
                    "relative z-[2] min-h-10 cursor-pointer rounded-pill px-2 text-sm font-medium whitespace-nowrap transition-colors duration-300 sm:px-4",
                    "focus-visible:ring-2 focus-visible:ring-[var(--ui-focus)] focus-visible:outline-none",
                    isSelected ? "text-[var(--btn-primary-fg)]" : "text-muted hover:text-fg",
                    // Until the pill is placed (server HTML), the selected tab fills itself.
                    "aria-selected:bg-[var(--btn-primary-bg)] group-data-[ready]/tabs:aria-selected:bg-transparent",
                  )}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel */}
        <div className="relative overflow-hidden">
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            {selected ? (
              <motion.div
                key={selected.id}
                id={`${idPrefix}-panel-${selected.id}`}
                role="tabpanel"
                aria-labelledby={`${idPrefix}-tab-${selected.id}`}
                tabIndex={0}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="w-full rounded-lg will-change-transform"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
              >
                {selected.content}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
