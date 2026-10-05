"use client";

/**
 * RareUI "Floating Navigation", adapted for routing:
 * - items are real <Link>s with aria-current instead of role="tab" buttons,
 * - the active item follows the URL rather than click state,
 * - labels show on hover *and* keyboard focus,
 * - every colour comes from --nav-* theme tokens.
 * The spring pill (layoutId) and per-icon animations are the original's.
 *
 * Desktop: three capsules across the top, socials | pages | theme.
 * Mobile: one dock at the bottom; Résumé, socials and the theme switch
 * live in a "More" sheet that rises out of the dock.
 */

import { AnimatePresence, motion, type Variants } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import {
  BriefcaseBusiness,
  Ellipsis,
  FileText,
  FolderOpen,
  House,
  Send,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { navItems, type NavKey } from "@/config/site";
import type { Social } from "@/lib/notion/types";
import { cn } from "@/lib/utils";
import { ThemeSegmented, ThemeToggle } from "./ThemeToggle";

type ItemKey = NavKey | "more";

const icons: Record<ItemKey, LucideIcon> = {
  home: House,
  about: UserRound,
  projects: FolderOpen,
  work: BriefcaseBusiness,
  resume: FileText,
  connect: Send,
  more: Ellipsis,
};

const iconVariants: Record<ItemKey, Variants> = {
  home: {
    active: { scale: 1.1, y: -2, transition: { type: "spring", stiffness: 400, damping: 10 } },
    inactive: { scale: 1, y: 0 },
  },
  about: {
    active: { scale: 1.1, transition: { type: "spring", stiffness: 300 } },
    inactive: { scale: 1 },
  },
  projects: {
    active: { rotate: [0, -10, 10, 0], scale: 1.1, transition: { duration: 0.5, ease: "easeInOut" } },
    inactive: { rotate: 0, scale: 1 },
  },
  work: {
    active: { y: [0, -3, 0], scale: 1.1, transition: { duration: 0.4 } },
    inactive: { y: 0, scale: 1 },
  },
  resume: {
    active: { rotate: [0, 15, -15, 10, -10, 0], transition: { duration: 0.5 } },
    inactive: { rotate: 0 },
  },
  connect: {
    active: { x: [0, 3, 0], y: [0, -3, 0], rotate: 0, transition: { duration: 0.45 } },
    inactive: { x: 0, y: 0 },
  },
  more: {
    active: { rotate: 90, transition: { type: "spring", bounce: 0, duration: 0.4 } },
    inactive: { rotate: 0 },
  },
};

/** Items that only appear on one layout. */
const DESKTOP_ONLY: ItemKey[] = ["resume"];
const MOBILE_ONLY: ItemKey[] = ["more"];

const DESKTOP_QUERY = "(min-width: 768px)";
const subscribeDesktop = (onChange: () => void) => {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const itemClass =
  "relative flex items-center justify-center rounded-full outline-none transition-[color,transform] duration-200 select-none cursor-pointer active:scale-[0.94] active:duration-[var(--motion-press)] " +
  "size-11 md:size-auto md:h-10 md:px-3.5 md:gap-2 " +
  "focus-visible:ring-2 focus-visible:ring-[var(--ui-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-bg)]";

export default function FloatingNavigation({ socials }: { socials: Social[] }) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<ItemKey | null>(null);
  // The sheet remembers which page it was opened on, so navigating closes it.
  const [sheetPath, setSheetPath] = useState<string | null>(null);
  const sheetOpen = sheetPath === pathname;
  const sheetId = useId();
  const moreRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // null until hydrated: CSS decides visibility until then.
  const desktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP_QUERY).matches, () => null);

  const resumeActive = isActive(pathname, "/resume");
  const activeKey: ItemKey | null =
    desktop === false && resumeActive
      ? "more"
      : (navItems.find((item) => isActive(pathname, item.href))?.key ?? null);

  useEffect(() => {
    if (!sheetOpen) return;
    sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSheetPath(null);
        moreRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!sheetRef.current?.contains(target) && !moreRef.current?.contains(target)) setSheetPath(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [sheetOpen]);

  const items: { key: ItemKey; label: string; href?: string }[] = [
    ...navItems,
    { key: "more", label: "More" },
  ];

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50",
        "bottom-[max(1.25rem,env(safe-area-inset-bottom))] md:top-5 md:bottom-auto",
      )}
    >
      <div className="container-page flex justify-center md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
        {/* Left capsule: socials */}
        {socials.length ? (
          <div className="chrome pointer-events-auto hidden justify-self-start rounded-full p-1.5 lg:flex">
            <SocialLinks socials={socials.slice(0, 4)} variant="chrome" />
          </div>
        ) : null}

        {/* Centre capsule: pages (the dock on mobile) */}
        <nav aria-label="Primary navigation" className="pointer-events-auto relative md:col-start-2">
          <ul
            className="chrome flex items-center gap-1 rounded-full p-1.5"
            onMouseLeave={() => setHovered(null)}
          >
            {items.map((item) => {
              const active = activeKey === item.key;
              const showLabel = hovered === item.key;
              const Icon = icons[item.key];

              const inner = (
                <>
                  {showLabel && !active ? (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-[var(--nav-hover-bg)]"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  ) : null}
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-[var(--nav-active-bg)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  ) : null}
                  <span className="relative z-10 flex items-center gap-2">
                    <motion.span
                      className="flex items-center justify-center"
                      variants={iconVariants[item.key]}
                      animate={active || (item.key === "more" && sheetOpen) ? "active" : "inactive"}
                    >
                      <Icon aria-hidden="true" className="size-5 md:size-4" strokeWidth={1.9} />
                    </motion.span>
                    <span className="hidden text-sm font-medium tracking-[-0.01em] whitespace-nowrap md:inline">
                      {item.label}
                    </span>
                  </span>
                </>
              );

              const interaction = {
                onMouseEnter: () => setHovered(item.key),
                onFocus: () => setHovered(item.key),
                onBlur: () => setHovered(null),
                style: { WebkitTapHighlightColor: "transparent" },
                className: cn(
                  itemClass,
                  active
                    ? "font-semibold text-[var(--nav-active-fg)]"
                    : "text-[var(--nav-fg)] hover:text-[var(--nav-fg-hover)]",
                ),
              };

              return (
                <li
                  key={item.key}
                  className={cn(
                    "relative",
                    DESKTOP_ONLY.includes(item.key) && "hidden md:block",
                    MOBILE_ONLY.includes(item.key) && "md:hidden",
                  )}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                      {...interaction}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <button
                      ref={moreRef}
                      type="button"
                      aria-label="More: résumé, socials and theme"
                      aria-expanded={sheetOpen}
                      aria-controls={sheetId}
                      onClick={() => setSheetPath(sheetOpen ? null : pathname)}
                      {...interaction}
                    >
                      {inner}
                    </button>
                  )}

                  {/* Mobile floating tooltip (desktop shows the label inline) */}
                  <AnimatePresence>
                    {showLabel && !(item.key === "more" && sheetOpen) ? (
                      <motion.span
                        role="presentation"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -48, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 rounded-sm bg-[var(--nav-tooltip-bg)] px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[var(--nav-tooltip-fg)] shadow-[var(--shadow-float)] md:hidden"
                      >
                        <span className="absolute inset-x-0 -bottom-1 mx-auto size-2 rotate-45 bg-[var(--nav-tooltip-bg)]" />
                        {item.label}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Mobile "More" sheet: rises out of the dock */}
          <AnimatePresence>
            {sheetOpen ? (
              <motion.div
                ref={sheetRef}
                id={sheetId}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.16 } }}
                transition={{ type: "spring", bounce: 0, duration: 0.38 }}
                style={{ transformOrigin: "bottom right" }}
                className="chrome absolute right-0 bottom-[calc(100%+0.625rem)] !bg-[var(--chrome-bg-heavy)] shadow-[var(--shadow-raise)] w-[min(18rem,calc(100vw-2rem))] rounded-lg p-2 md:hidden"
              >
                <Link
                  href="/resume"
                  aria-current={resumeActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-md px-3 font-medium transition-colors",
                    resumeActive
                      ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-fg)]"
                      : "text-fg hover:bg-[var(--nav-hover-bg)]",
                  )}
                >
                  <FileText aria-hidden="true" className="size-5" strokeWidth={1.9} />
                  Résumé
                </Link>

                <div className="mx-3 my-2 h-px bg-line" />

                <ThemeSegmented className="mx-1" />

                {socials.length ? (
                  <>
                    <div className="mx-3 my-2 h-px bg-line" />
                    <SocialLinks socials={socials.slice(0, 5)} variant="chrome" className="justify-around px-1" />
                  </>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </nav>

        {/* Right capsule: theme */}
        <div className="chrome pointer-events-auto hidden justify-self-end rounded-full p-1.5 md:flex">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
