import type { PageObjectResponse } from "@notionhq/client";

/**
 * Typed readers for Notion page properties. Each returns a safe empty value
 * when a column is missing or has the wrong type, so a renamed column in
 * Notion degrades the page instead of crashing the build.
 */

type Props = PageObjectResponse["properties"];

export function text(props: Props, name: string): string {
  const p = props[name];
  if (!p) return "";
  if (p.type === "title") return p.title.map((t) => t.plain_text).join("").trim();
  if (p.type === "rich_text") return p.rich_text.map((t) => t.plain_text).join("").trim();
  return "";
}

export function number(props: Props, name: string): number | null {
  const p = props[name];
  return p?.type === "number" ? p.number : null;
}

export function checkbox(props: Props, name: string): boolean {
  const p = props[name];
  return p?.type === "checkbox" ? p.checkbox : false;
}

/**
 * Notion accepts URLs without a scheme ("amuselabs.com"), which a browser
 * would resolve relative to the current page. Bare domains get https://;
 * anything with a scheme (mailto:, tel:) or a leading / or # is kept.
 */
export function absoluteUrl(value: string | null | undefined): string | null {
  const v = value?.trim();
  if (!v) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v) || v.startsWith("/") || v.startsWith("#")) return v;
  return `https://${v.replace(/^\/\//, "")}`;
}

export function url(props: Props, name: string): string | null {
  const p = props[name];
  return p?.type === "url" ? absoluteUrl(p.url) : null;
}

export function email(props: Props, name: string): string {
  const p = props[name];
  return p?.type === "email" ? (p.email ?? "") : "";
}

export function select(props: Props, name: string): string | null {
  const p = props[name];
  return p?.type === "select" ? (p.select?.name ?? null) : null;
}

export function multiSelect(props: Props, name: string): string[] {
  const p = props[name];
  return p?.type === "multi_select" ? p.multi_select.map((o) => o.name) : [];
}

export function dateRange(props: Props, name: string): { start: string | null; end: string | null } {
  const p = props[name];
  if (p?.type !== "date" || !p.date) return { start: null, end: null };
  return { start: p.date.start, end: p.date.end };
}

/** First file URL in a Files property (uploaded or external). */
export function firstFile(props: Props, name: string): string | null {
  const p = props[name];
  if (p?.type !== "files" || p.files.length === 0) return null;
  const f = p.files[0];
  if (f.type === "external") return absoluteUrl(f.external.url);
  if (f.type === "file") return f.file.url;
  return null;
}

/** A Files property (uploaded or "embed link") or a URL property, whichever the column is. */
export function fileOrUrl(props: Props, name: string): string | null {
  return props[name]?.type === "url" ? url(props, name) : firstFile(props, name);
}

/** A list from a multi-select, or from text separated by commas, semicolons or new lines. */
export function list(props: Props, name: string): string[] {
  const p = props[name];
  if (p?.type === "multi_select") return multiSelect(props, name);
  return text(props, name)
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
