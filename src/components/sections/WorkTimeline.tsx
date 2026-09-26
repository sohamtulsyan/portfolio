import { ArrowUpRight } from "lucide-react";
import { EmptyState } from "@/components/ui/primitives";
import type { WorkItem } from "@/lib/notion/types";
import { formatRange } from "@/lib/utils";

/** Work history as a lit timeline. `compact` is the home-page summary version. */
export function WorkTimeline({ work, compact = false }: { work: WorkItem[]; compact?: boolean }) {
  if (work.length === 0) {
    return <EmptyState title="Work history coming soon" body="Roles will show up here once they're published." />;
  }

  return (
    <ol className="relative space-y-6 pl-8 sm:pl-10">
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-accent via-line-strong to-transparent sm:left-[11px]"
      />
      {work.map((item, i) => (
        <li key={item.id} className="relative">
          <span
            aria-hidden="true"
            className={
              i === 0 && !item.end
                ? "absolute top-2 -left-8 size-[15px] rounded-full border-2 border-fg bg-accent shadow-[var(--glow-md)] sm:-left-10 sm:size-[23px]"
                : "absolute top-2 -left-8 size-[15px] rounded-full border border-line-strong bg-bg sm:-left-10 sm:size-[23px]"
            }
          />
          <div className={compact ? "py-1" : "glass rounded-lg p-6 sm:p-8"}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-xl font-bold text-fg">{item.role}</h3>
              <p className="text-sm text-subtle tabular-nums">{formatRange(item.start, item.end)}</p>
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
              <ul className="mt-4 list-disc space-y-1.5 pl-5 text-muted marker:text-accent">
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
