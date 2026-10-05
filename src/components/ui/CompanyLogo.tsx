import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Company logo on a light plate, so dark marks stay visible in dark mode.
 * The plate is a fixed box and the logo is contained inside it, so square
 * marks and wide wordmarks line up the same way. Without a logo it shows the
 * company's initial. Decorative: the company name is always written beside it.
 */
export function CompanyLogo({
  src,
  company,
  className,
}: {
  src: string | null;
  company: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[var(--logo-plate)] ring-1 ring-line",
        className,
      )}
    >
      {src ? (
        <Image src={src} alt="" fill sizes="80px" className="object-contain p-2" />
      ) : (
        <span className="text-lg font-semibold text-[var(--logo-plate-fg)]">{company.trim().charAt(0).toUpperCase() || "·"}</span>
      )}
    </span>
  );
}
