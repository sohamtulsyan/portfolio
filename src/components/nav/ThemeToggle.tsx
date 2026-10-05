"use client";

import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { setThemeMode, useThemeMode, type ThemeMode } from "@/lib/theme-mode";
import { cn } from "@/lib/utils";

const spring = { type: "spring", bounce: 0, duration: 0.4 } as const;

/** Single icon button that flips the scheme. Used in the desktop nav capsule. */
export function ThemeToggle({ className }: { className?: string }) {
  const mode = useThemeMode();
  const next: ThemeMode = mode === "light" ? "dark" : "light";
  const label = `Switch to ${next} theme`;

  return (
    <button
      type="button"
      onClick={() => setThemeMode(next)}
      aria-label={label}
      title={label}
      className={cn(
        "relative flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-[var(--nav-fg)] transition-[color,background-color,transform] duration-[var(--motion-fast)] hover:bg-[var(--nav-hover-bg)] hover:text-[var(--nav-fg-hover)] active:scale-[0.94] active:duration-[var(--motion-press)]",
        className,
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {mode ? (
          <motion.span
            key={mode}
            initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
            transition={spring}
            className="flex"
          >
            {mode === "light" ? (
              <Sun aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
            ) : (
              <Moon aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
            )}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  );
}

/** Two-option segmented control. Used in the mobile "More" sheet, where a label helps. */
export function ThemeSegmented({ className }: { className?: string }) {
  const mode = useThemeMode();
  const options: { value: ThemeMode; label: string; Icon: typeof Sun }[] = [
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
  ];

  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn("grid grid-cols-2 gap-1 rounded-pill bg-[var(--nav-hover-bg)] p-1", className)}
    >
      {options.map(({ value, label, Icon }) => {
        const selected = mode === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={selected}
            onClick={() => setThemeMode(value)}
            className={cn(
              "relative flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-pill text-sm font-medium transition-colors duration-[var(--motion-fast)]",
              selected ? "text-[var(--nav-active-fg)]" : "text-[var(--nav-fg)]",
            )}
          >
            {selected ? (
              <motion.span
                layoutId="theme-segment"
                transition={spring}
                className="absolute inset-0 rounded-pill bg-[var(--nav-active-bg)]"
              />
            ) : null}
            <Icon aria-hidden="true" className="relative size-4" strokeWidth={1.9} />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
