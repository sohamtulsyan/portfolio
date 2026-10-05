import Image from "next/image";
import type { Project } from "@/lib/notion/types";
import { cn } from "@/lib/utils";

/**
 * Project cover image, or a type-only cover when none is uploaded in Notion.
 * Inside a `group` link, the image eases in a touch on hover.
 */
export function ProjectCover({
  project,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  project: Project;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-surface", className)}>
      {project.coverUrl ? (
        <Image
          src={project.coverUrl}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[var(--motion-slow)] ease-[var(--motion-ease-out)] group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex items-end p-6 [background:var(--cover-placeholder)] sm:p-8">
          <span aria-hidden="true" className="text-3xl leading-none font-semibold tracking-[-0.03em] text-fg/20">
            {project.name}
          </span>
        </div>
      )}
    </div>
  );
}
