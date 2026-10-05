import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small, theme-driven building blocks shared by every page. */

export function PageHeader({ title, lead, children }: { title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="container-page pt-28 sm:pt-40">
      <h1 className="rise text-3xl font-semibold text-fg">{title}</h1>
      {lead ? (
        <p className="rise measure mt-5 text-lg text-muted" style={{ "--i": 1 } as CSSProperties}>
          {lead}
        </p>
      ) : null}
      {children}
    </header>
  );
}

/**
 * Two-tone heading: the title in full contrast, then a muted sentence that
 * finishes the thought on the same line.
 */
export function SectionHeading({
  id,
  title,
  lead,
  action,
  className,
}: {
  id?: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-8 gap-y-4", className)}>
      <h2 id={id} className="max-w-[28ch] text-2xl font-semibold text-fg">
        {title}
        {lead ? <span className="text-subtle"> {lead}</span> : null}
      </h2>
      {action}
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-pill bg-[var(--chip-bg)] px-3 py-1 text-xs font-medium tracking-[0.01em] text-[var(--chip-fg)]">
      {children}
    </span>
  );
}

export function Panel({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "aside" | "li";
}) {
  return <Tag className={cn("surface rounded-lg", className)}>{children}</Tag>;
}

/** Shown when a Notion database has no published rows yet. */
export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Panel className="px-6 py-12 text-center sm:px-10">
      <p className="title text-lg font-semibold text-fg">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
    </Panel>
  );
}

export function SampleNotice() {
  return (
    <p className="container-page mt-6 text-xs text-subtle">
      Showing sample content. Add a NOTION_TOKEN to .env.local and run <code>npm run sync</code> to load real content.
    </p>
  );
}
