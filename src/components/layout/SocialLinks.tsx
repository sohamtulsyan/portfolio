import type { Social } from "@/lib/notion/types";
import { cn } from "@/lib/utils";
import { SocialIcon } from "@/components/icons/SocialIcon";

/** Icon row of socials. `variant="dock"` is the compact glass pill used in the bottom band. */
export function SocialLinks({
  socials,
  variant = "row",
  className,
}: {
  socials: Social[];
  variant?: "row" | "dock";
  className?: string;
}) {
  if (socials.length === 0) return null;
  return (
    <ul
      className={cn(
        "flex items-center",
        variant === "dock"
          ? "gap-0.5 rounded-full border border-[var(--nav-border)] bg-[var(--nav-bg)] p-1.5 shadow-[var(--shadow-float)] backdrop-blur-xl"
          : "gap-2",
        className,
      )}
    >
      {socials.map((social) => (
        <li key={social.id}>
          <a
            href={social.url}
            target={social.url.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer me"
            aria-label={social.name || social.platform}
            title={social.name || social.platform}
            className={cn(
              "flex items-center justify-center rounded-full text-subtle transition-[color,box-shadow,background-color] duration-300 hover:text-fg",
              variant === "dock"
                ? "size-10 hover:bg-[var(--nav-hover-bg)]"
                : "size-11 border border-line hover:border-line-strong hover:shadow-[var(--glow-sm)]",
            )}
          >
            <SocialIcon platform={social.platform} className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
