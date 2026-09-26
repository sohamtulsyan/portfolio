import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState, SectionHeading, Tag } from "@/components/ui/primitives";
import type { Project } from "@/lib/notion/types";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./ProjectCover";

/** Home page: featured projects as large alternating rows, not a card grid. */
export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section aria-labelledby="featured" className="container-page section-gap">
      <SectionHeading
        id="featured"
        title="Selected projects"
        action={projects.length ? <Button href="/projects" variant="ghost">All projects</Button> : null}
      />

      {projects.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="Projects are on their way" body="Case studies will appear here soon." />
        </div>
      ) : (
        <ol className="mt-12 space-y-20 sm:space-y-28">
          {projects.map((project, i) => (
            <li key={project.id}>
              <Link
                href={`/projects/${project.slug}`}
                className="group grid items-center gap-8 rounded-lg lg:grid-cols-12 lg:gap-12"
              >
                <ProjectCover
                  project={project}
                  priority={i === 0}
                  className={cn(
                    "aspect-[16/10] transition-shadow duration-500 group-hover:shadow-[var(--card-hover-glow)] lg:col-span-7",
                    i % 2 === 1 && "lg:order-2",
                  )}
                />
                <div className={cn("lg:col-span-5", i % 2 === 1 && "lg:order-1")}>
                  <p className="text-sm text-subtle">
                    {[project.role, project.year].filter(Boolean).join(", ")}
                  </p>
                  <h3 className="mt-2 flex items-start gap-2 text-2xl font-bold text-fg">
                    {project.name}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-1 size-6 shrink-0 text-subtle transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-fg"
                    />
                  </h3>
                  {project.summary ? <p className="mt-4 text-muted">{project.summary}</p> : null}
                  {project.tags.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
