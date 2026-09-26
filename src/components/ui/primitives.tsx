import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small, theme-driven building blocks shared by every page. */

export function PageHeader({ title, lead, children }: { title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="container-page pt-28 sm:pt-36">
      <h1 className="text-3xl font-bold text-fg">{title}</h1>
      {lead ? <p className="measure mt-5 text-lg text-muted">{lead}</p> : null}
      {children}
    </header>
  );
}

export function SectionHeading({
  id,
  title,
  action,
  className,
}: {
  id?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <h2 id={id} className="text-2xl font-bold">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-pill bg-[var(--chip-bg)] px-3 py-1 text-xs font-medium text-[var(--chip-fg)]">
      {children}
    </span>
  );
}

export function GlassPanel({
  children,
  className,
  lit = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  lit?: boolean;
  as?: "div" | "section" | "article" | "aside" | "li";
}) {
  return <Tag className={cn("glass rounded-lg", lit && "lit-edge", className)}>{children}</Tag>;
}

/** Shown when a Notion database has no published rows yet. */
export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <GlassPanel className="px-6 py-10 text-center sm:px-10">
      <p className="text-lg font-semibold text-fg">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-subtle">{body}</p>
    </GlassPanel>
  );
}

export function SampleNotice() {
  return (
    <p className="container-page mt-6 text-xs text-subtle">
      Showing sample content. Add a NOTION_TOKEN to .env.local and run <code>npm run sync</code> to load real content.
    </p>
  );
}
