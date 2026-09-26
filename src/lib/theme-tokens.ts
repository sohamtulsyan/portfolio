"use client";

import { useSyncExternalStore } from "react";

/**
 * Reads CSS custom properties from the active theme at runtime, so canvas and
 * WebGL effects take their colours from theme.css instead of hard-coded props.
 * Values are resolved through a probe element, which turns `var(--palette-x)`
 * chains and colour-mix() into a concrete rgb() string WebGL can parse.
 */
export function readToken(name: string, fallback = ""): string {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallback;
  return raw;
}

export function readColorToken(name: string, fallback = "#ffffff"): string {
  if (typeof window === "undefined") return fallback;
  const probe = document.createElement("span");
  probe.style.color = `var(${name}, ${fallback})`;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved || fallback;
}

const tokenCache = new Map<string, Record<string, string>>();
const noopSubscribe = () => () => {};

/** Resolved colour tokens on the client, `null` during SSR and hydration. */
export function useColorTokens<T extends string>(names: readonly T[]): Record<T, string> | null {
  const key = names.join("|");
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      let values = tokenCache.get(key);
      if (!values) {
        values = {};
        for (const name of key.split("|")) values[name] = readColorToken(name);
        tokenCache.set(key, values);
      }
      return values as Record<T, string>;
    },
    () => null,
  );
}

/** Parses rgb()/rgba() or #hex into 0-1 floats for shader uniforms. */
export function toRgbFloats(color: string): [number, number, number] {
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const parts = color.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255];
  return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
}
