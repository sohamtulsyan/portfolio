"use client";

/**
 * RareUI "Floating Navigation", adapted for routing:
 * - items are real <Link>s with aria-current instead of role="tab" buttons,
 * - the active item follows the URL rather than click state,
 * - labels show on hover *and* keyboard focus,
 * - every colour/glow comes from --nav-* theme tokens.
 * The spring pill (layoutId) and per-icon animations are the original's.
 */

import { AnimatePresence, motion, type Variants } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BriefcaseBusiness, FileText, FolderOpen, House, Send, UserRound, type LucideIcon } from "lucide-react";
import { navItems, type NavKey } from "@/config/site";
import { cn } from "@/lib/utils";

const icons: Record<NavKey, LucideIcon> = {
  home: House,
  about: UserRound,
  projects: FolderOpen,
  work: BriefcaseBusiness,
  resume: FileText,
  connect: Send,
};

const iconVariants: Record<NavKey, Variants> = {
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
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function FloatingNavigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<NavKey | null>(null);

  return (
    <nav aria-label="Primary" className={className}>
      <ul
        className="flex items-center gap-1 rounded-full border border-[var(--nav-border)] bg-[var(--nav-bg)] p-1.5 shadow-[var(--shadow-float)] backdrop-blur-xl transition-shadow duration-300 sm:gap-2 sm:p-2"
        onMouseLeave={() => setHovered(null)}
      >
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const showLabel = hovered === item.key;
          const Icon = icons[item.key];

          return (
            <li key={item.key} className="relative">
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setHovered(item.key)}
                onFocus={() => setHovered(item.key)}
                onBlur={() => setHovered(null)}
                className={cn(
                  "relative flex size-11 items-center justify-center rounded-full outline-none transition-colors duration-300 select-none sm:size-12",
                  "focus-visible:ring-2 focus-visible:ring-[var(--ui-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-bg)]",
                  active ? "text-[var(--nav-active-fg)]" : "text-[var(--nav-fg)] hover:text-[var(--nav-fg-hover)]",
                )}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {showLabel && !active ? (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-[var(--nav-hover-bg)]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                ) : null}

                {active ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full [background:var(--nav-active-bg)] shadow-[var(--nav-active-glow)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                ) : null}

                <motion.span
                  className="relative z-10 block"
                  variants={iconVariants[item.key]}
                  animate={active ? "active" : "inactive"}
                >
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
                </motion.span>
              </Link>

              <AnimatePresence>
                {showLabel ? (
                  <motion.span
                    role="presentation"
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -50, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 rounded-sm bg-[var(--nav-tooltip-bg)] px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[var(--nav-tooltip-fg)] shadow-[var(--shadow-float)]"
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
    </nav>
  );
}
