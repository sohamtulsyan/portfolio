import type { Social } from "@/lib/notion/types";
import { cn } from "@/lib/utils";
import { SocialIcon } from "@/components/icons/SocialIcon";

/**
 * Icon row of socials. `variant="chrome"` sits inside a nav capsule or the
 * mobile sheet (no borders of its own, nav hover colours).
 */
export function SocialLinks({
  socials,
  variant = "row",
  className,
}: {
  socials: Social[];
  variant?: "row" | "chrome";
  className?: string;
}) {
  if (socials.length === 0) return null;
  return (
    <ul className={cn("flex items-center", variant === "chrome" ? "gap-0.5" : "gap-2", className)}>
      {socials.map((social) => (
        <li key={social.id}>
          <a
            href={social.url}
            target={social.url.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer me"
            aria-label={social.name || social.platform}
            title={social.name || social.platform}
            className={cn(
              "flex items-center justify-center rounded-full transition-[color,background-color,border-color,transform] duration-[var(--motion-fast)] active:scale-[0.94] active:duration-[var(--motion-press)]",
              variant === "chrome"
                ? "size-10 text-[var(--nav-fg)] hover:bg-[var(--nav-hover-bg)] hover:text-[var(--nav-fg-hover)]"
                : "size-11 border border-line text-muted hover:border-line-strong hover:text-fg",
            )}
          >
            <SocialIcon platform={social.platform} className="size-[17px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
