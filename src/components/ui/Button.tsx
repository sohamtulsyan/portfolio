import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Primary / ghost actions. For the neumorphic secondary style use <SoftButton>.
 * Renders a link when `href` is set, otherwise a button. All colour, glow and
 * radius come from theme tokens (--btn-primary-*).
 */

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold text-sm min-h-12 px-6 rounded-pill transition-[box-shadow,background-color,color,transform] duration-300 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] border border-[var(--btn-primary-border)] shadow-[var(--btn-primary-glow)] hover:shadow-[var(--btn-primary-glow-hover)]",
  ghost: "text-fg hover:bg-[var(--nav-hover-bg)] underline-offset-4 hover:underline px-4",
};

type Common = { variant?: Variant; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", className, children } = props;
  const classes = cn(base, variants[variant], className);

  if (props.href !== undefined) {
    const { variant: _v, className: _c, children: _ch, href, ...rest } = props;
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external || "download" in rest) {
      return (
        <a href={href} className={classes} {...(rest as ComponentProps<"a">)}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, href: _h, ...rest } = props;
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
