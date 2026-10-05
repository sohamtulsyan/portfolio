import type { StackItem } from "@/lib/tech-stack";
import { cn } from "@/lib/utils";

/**
 * A project's tech stack. Takes items already resolved on the server
 * (lib/tech-stack), so it renders anywhere, including client components.
 * - "chips": logo + name, for the project page,
 * - "icons": logos only (names as tooltips and for screen readers), for cards;
 *   names without a logo still show as short text.
 */
export function StackList({
  items,
  variant = "chips",
  label = "Built with",
  className,
}: {
  items: StackItem[];
  variant?: "chips" | "icons";
  label?: string;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <ul aria-label={label} className={cn("flex flex-wrap items-center", variant === "icons" ? "gap-x-3.5 gap-y-2" : "gap-2", className)}>
      {items.map(({ name, path }) => (
        <li key={name} title={variant === "icons" ? name : undefined}>
          {variant === "icons" && path ? (
            <>
              <Logo path={path} className="size-[18px] text-subtle transition-colors duration-[var(--motion-fast)] group-hover:text-muted" />
              <span className="sr-only">{name}</span>
            </>
          ) : (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.01em] text-[var(--chip-fg)]",
                variant === "chips" && "rounded-pill bg-[var(--chip-bg)] py-1 pr-3 pl-2.5",
                variant === "icons" && "text-subtle",
                variant === "chips" && !path && "pl-3",
              )}
            >
              {path ? <Logo path={path} className="size-3.5" /> : null}
              {name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function Logo({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={path} />
    </svg>
  );
}
