import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * RareUI "Soft Button" (neumorphic, letter-spacing hover).
 * Adapted to be a real <a>/<button> (the original is a div) and to read its
 * shadows and hover colours from theme tokens. Two tones share the emboss:
 * - "soft" (default, secondary): transparent, inverts to the text colour on hover (--btn-soft-*),
 * - "primary": filled teal, deepens on hover (--btn-primary-*).
 */

type Tone = "soft" | "primary";
type Common = { className?: string; children: ReactNode; tone?: Tone };
type AsLink = Common & { href: string; download?: string | boolean; target?: string; rel?: string };
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

const outer =
  "group relative inline-flex h-[50px] min-w-[160px] cursor-pointer items-center justify-center rounded-[30px] focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-60";

const inner =
  "z-10 flex h-full w-full items-center justify-center gap-2 rounded-[30px] border-t border-b px-6 text-[0.9375rem] font-medium tracking-[0.02em] whitespace-nowrap transition-all duration-[600ms] ease-[var(--motion-ease-out)] group-hover:scale-[1.04] group-hover:tracking-[0.08em] group-active:scale-[0.97] group-active:duration-[var(--motion-press)]";

const tones: Record<Tone, string> = {
  soft: "border-[var(--btn-soft-edge)] bg-transparent text-[var(--btn-soft-fg)] shadow-[var(--btn-soft-shadow)] group-hover:bg-[var(--btn-soft-hover-bg)] group-hover:text-[var(--btn-soft-hover-fg)] group-hover:shadow-[var(--btn-soft-hover-shadow)]",
  primary:
    "border-[var(--btn-primary-edge)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] shadow-[var(--btn-primary-shadow)] group-hover:bg-[var(--btn-primary-bg-hover)] group-hover:shadow-[var(--btn-primary-hover-shadow)]",
};

export function SoftButton(props: AsLink | AsButton) {
  const { className, children, tone = "soft" } = props;
  const content = <span className={cn(inner, tones[tone])}>{children}</span>;

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

  const { className: _c, children: _ch, href: _h, tone: _t, ...rest } = props;
  return (
    <button type="button" className={cn(outer, className)} {...rest}>
      {content}
    </button>
  );
}
