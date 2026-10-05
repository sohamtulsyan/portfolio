"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState, Tag } from "@/components/ui/primitives";
import { StackList } from "@/components/ui/StackList";
import type { Project } from "@/lib/notion/types";
import type { StackItem } from "@/lib/tech-stack";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./ProjectCover";

export type IndexProject = Project & { stackItems: StackItem[] };

/** Projects page: tag filter + two-column index. */
export function ProjectIndex({ projects }: { projects: IndexProject[] }) {
  const tags = useMemo(() => [...new Set(projects.flatMap((p) => p.tags))].sort(), [projects]);
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? projects.filter((p) => p.tags.includes(active)) : projects;

  if (projects.length === 0) {
    return (
      <EmptyState title="No projects published yet" body="Case studies will appear here as they're published." />
    );
  }

  return (
    <div>
      {tags.length > 1 ? (
        <div role="group" aria-label="Filter by tag" className="flex flex-wrap gap-2">
          {[null, ...tags].map((tag) => {
            const selected = active === tag;
            return (
              <button
                key={tag ?? "all"}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(tag)}
                className={cn(
                  "min-h-11 cursor-pointer rounded-pill px-4 text-sm font-medium transition-[background-color,color,transform] duration-[var(--motion-fast)] active:scale-[0.96] active:duration-[var(--motion-press)]",
                  selected
                    ? "bg-[var(--chip-active-bg)] text-[var(--chip-active-fg)]"
                    : "bg-[var(--chip-bg)] text-[var(--chip-fg)] hover:text-fg",
                )}
              >
                {tag ?? "All"}
              </button>
            );
          })}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? "project" : "projects"} shown
      </p>

      <ul className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
        {shown.map((project) => (
          <li key={project.id}>
            <Link href={`/projects/${project.slug}`} className="group block rounded-lg">
              <ProjectCover
                project={project}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-[16/10]"
              />
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h2 className="title text-xl font-semibold text-fg">{project.name}</h2>
                {project.year ? <span className="meta text-subtle">{project.year}</span> : null}
              </div>
              {project.summary ? <p className="mt-2 text-muted">{project.summary}</p> : null}
              <StackList items={project.stackItems} variant="icons" className="mt-4" />
              {project.tags.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
