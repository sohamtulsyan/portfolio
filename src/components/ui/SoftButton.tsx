import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Secondary action: RareUI "Soft Button" (neumorphic, letter-spacing hover).
 * Adapted to be a real <a>/<button> (the original is a div) and to read its
 * shadows and hover colours from theme tokens (--btn-soft-*).
 */

type Common = { className?: string; children: ReactNode };
type AsLink = Common & { href: string; download?: string | boolean; target?: string; rel?: string };
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

const outer =
  "group relative inline-flex h-[50px] min-w-[160px] cursor-pointer items-center justify-center rounded-[30px] focus-visible:outline-offset-4";

const inner =
  "z-10 flex h-full w-full items-center justify-center gap-2 rounded-[30px] border-t border-b border-[color-mix(in_srgb,var(--shadow-ink)_20%,transparent)] bg-transparent px-6 text-sm font-medium tracking-[1px] text-[var(--btn-soft-fg)] shadow-[var(--btn-soft-shadow)] transition-all duration-[600ms] ease-out group-hover:scale-[1.05] group-hover:bg-[var(--btn-soft-hover-bg)] group-hover:tracking-[2px] group-hover:text-[var(--btn-soft-hover-fg)] group-hover:shadow-[var(--btn-soft-hover-shadow)] group-active:scale-[0.98]";

export function SoftButton(props: AsLink | AsButton) {
  const { className, children } = props;
  const content = <span className={inner}>{children}</span>;

  if (props.href !== undefined) {
    const { href, download, target, rel } = props;
    if (download !== undefined || /^(https?:|mailto:)/.test(href) || href.endsWith(".pdf")) {
      return (
        <a href={href} download={download} target={target} rel={rel} className={cn(outer, className)}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cn(outer, className)}>
        {content}
      </Link>
    );
  }

  const { className: _c, children: _ch, href: _h, ...rest } = props;
  return (
    <button type="button" className={cn(outer, className)} {...rest}>
      {content}
    </button>
  );
}
