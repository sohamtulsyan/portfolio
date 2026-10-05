import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Primary and text-link actions. For the neumorphic secondary style use <SoftButton>.
 * Renders a link when `href` is set, otherwise a button. All colour and
 * radius come from theme tokens (--btn-primary-*, --ui-accent-text).
 * Press feedback lands on pointer-down (:active), not on release.
 */

type Variant = "primary" | "link";

const variants: Record<Variant, string> = {
  primary:
    "min-h-12 px-6 rounded-pill bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] font-medium hover:bg-[var(--btn-primary-bg-hover)] active:scale-[0.97] active:duration-[var(--motion-press)]",
  link: "group/link min-h-11 gap-0.5 text-accent-text font-medium hover:underline",
};

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[0.9375rem] tracking-[-0.01em] transition-[background-color,color,transform] duration-[var(--motion-fast)] ease-out disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

type Common = { variant?: Variant; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", className, children } = props;
  const classes = cn(base, variants[variant], className);
  const content =
    variant === "link" ? (
      <>
        {children}
        <ChevronRight
          aria-hidden="true"
          className="size-4 transition-transform duration-[var(--motion-fast)] group-hover/link:translate-x-0.5"
          strokeWidth={2.2}
        />
      </>
    ) : (
      children
    );

  if (props.href !== undefined) {
    const { variant: _v, className: _c, children: _ch, href, ...rest } = props;
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external || "download" in rest) {
      return (
        <a href={href} className={classes} {...(rest as ComponentProps<"a">)}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, href: _h, ...rest } = props;
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
