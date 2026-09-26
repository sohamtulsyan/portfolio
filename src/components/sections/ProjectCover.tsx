import Image from "next/image";
import type { Project } from "@/lib/notion/types";
import { cn } from "@/lib/utils";

/** Project cover image, or a type-only cover when none is uploaded in Notion. */
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
    <div className={cn("glass lit-edge relative overflow-hidden rounded-lg", className)}>
      {project.coverUrl ? (
        <Image src={project.coverUrl} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-end p-6 sm:p-8">
          <span aria-hidden="true" className="text-3xl leading-none font-extrabold tracking-tight text-fg/15">
            {project.name}
          </span>
        </div>
      )}
    </div>
  );
}
