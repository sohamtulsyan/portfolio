import { ArrowUpRight } from "lucide-react";
import { EmptyState } from "@/components/ui/primitives";
import type { WorkItem } from "@/lib/notion/types";
import { cn, formatRange } from "@/lib/utils";

/** Work history as a hairline timeline. `compact` is the home-page summary version. */
export function WorkTimeline({ work, compact = false }: { work: WorkItem[]; compact?: boolean }) {
  if (work.length === 0) {
    return <EmptyState title="Work history coming soon" body="Roles will show up here once they're published." />;
  }

  return (
    <ol className={cn("relative pl-8 sm:pl-10", compact ? "space-y-8" : "space-y-6")}>
      <span aria-hidden="true" className="absolute top-3 bottom-3 left-[5px] w-px bg-line-strong" />
      {work.map((item, i) => {
        const current = i === 0 && !item.end;
        return (
          <li key={item.id} className="relative">
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-[0.6rem] -left-8 size-[11px] rounded-full sm:-left-10",
                current ? "bg-accent ring-4 ring-[color-mix(in_srgb,var(--ui-accent)_22%,transparent)]" : "border border-line-strong bg-bg",
              )}
            />
            <div className={compact ? "" : "surface rounded-lg p-6 sm:p-8"}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="title text-xl font-semibold text-fg">{item.role}</h3>
                <p className="meta text-subtle">{formatRange(item.start, item.end)}</p>
              </div>
              <p className="mt-1 text-muted">
                {item.companyUrl ? (
                  <a
                    href={item.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-fg underline decoration-line-strong hover:decoration-fg"
                  >
                    {item.company}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                ) : (
                  item.company
                )}
                {!compact && (item.type || item.location) ? (
                  <span className="text-subtle">
                    {item.company ? ", " : ""}
                    {[item.type, item.location].filter(Boolean).join(", ")}
                  </span>
                ) : null}
              </p>
              {!compact && item.summary ? <p className="mt-4 text-muted">{item.summary}</p> : null}
              {!compact && item.highlights.length ? (
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-muted marker:text-subtle">
                  {item.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
