"use client";

import { useEffect, useState } from "react";
import Loader from "./Loader";
import { SPLASH_SEEN_KEY as SEEN_KEY } from "./splash-script";

const MIN_VISIBLE_MS = 900;

/**
 * First-visit splash with the lattice loader. It's part of the static HTML so
 * it paints before any JS; it lifts once fonts are ready and hydration is done.
 * Skipped for the rest of the session (see splashScript in layout.tsx), and a
 * CSS failsafe hides it after 5s if JavaScript never runs.
 */
export default function Splash() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const elapsed = performance.now();
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    Promise.all([document.fonts?.ready, new Promise((r) => setTimeout(r, wait))]).then(() => {
      if (cancelled) return;
      setHidden(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="splash fixed inset-0 z-[100] grid place-items-center bg-[var(--loader-bg)] transition-[opacity,visibility,filter] duration-700 ease-out data-[hidden=true]:invisible data-[hidden=true]:opacity-0 data-[hidden=true]:blur-sm"
      data-hidden={hidden}
      aria-hidden={hidden}
    >
      <Loader />
    </div>
  );
}
