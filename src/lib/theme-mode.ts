"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY } from "./theme-script";

export type ThemeMode = "light" | "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function read(): ThemeMode {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** Applies a scheme with a short cross-fade (View Transitions) and remembers it. */
export function setThemeMode(mode: ThemeMode) {
  const apply = () => {
    document.documentElement.dataset.theme = mode;
  };
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    // Private mode or blocked storage: the choice just won't persist.
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "startViewTransition" in document) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
}

/** Current scheme on the client; `null` during SSR and hydration. */
export function useThemeMode(): ThemeMode | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
