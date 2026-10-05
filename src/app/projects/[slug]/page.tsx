import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { NotionRenderer } from "@/components/notion/NotionRenderer";
import { ProjectCover } from "@/components/sections/ProjectCover";
import { SoftButton } from "@/components/ui/SoftButton";
import { Tag } from "@/components/ui/primitives";
import { StackList } from "@/components/ui/StackList";
import { getProject, getProjects } from "@/lib/content";
import { resolveStack } from "@/lib/tech-stack";

export const dynamicParams = false;

/** Static export needs at least one path; a placeholder 404s when there are no projects yet. */
const EMPTY_SLUG = "coming-soon";

export function generateStaticParams() {
  const projects = getProjects();
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: EMPTY_SLUG }];
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary || undefined,
    openGraph: project.coverUrl ? { images: [{ url: project.coverUrl }] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const projects = getProjects();
  const next = projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length];

  const meta = [
    { label: "Role", value: project.role },
    { label: "Year", value: project.year ? String(project.year) : "" },
  ].filter((m) => m.value);
  const stack = resolveStack(project.stack);

  return (
    <article>
      <header className="container-page pt-28 sm:pt-40">
        <Link
          href="/projects"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent-text hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All projects
        </Link>
        <h1 className="mt-6 text-3xl font-semibold text-fg">{project.name}</h1>
        {project.summary ? <p className="measure mt-5 text-lg text-muted">{project.summary}</p> : null}

        <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5">
          {meta.length ? (
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="meta text-xs text-subtle">{m.label}</dt>
                  <dd className="font-semibold text-fg">{m.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {project.tags.length ? (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          ) : null}
        </div>

        {stack.length ? (
          <div className="mt-8">
            <p className="meta text-xs text-subtle">Built with</p>
            <StackList items={stack} className="mt-2" />
          </div>
        ) : null}

        {project.liveUrl || project.repoUrl ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {project.liveUrl ? (
              <SoftButton href={project.liveUrl} target="_blank" rel="noreferrer" tone="primary">
                Visit project <ArrowUpRight aria-hidden="true" className="size-4" />
              </SoftButton>
            ) : null}
            {project.repoUrl ? (
              <SoftButton href={project.repoUrl} target="_blank" rel="noreferrer">
                View source
              </SoftButton>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="container-page mt-14">
        <ProjectCover project={project} priority sizes="(min-width: 1216px) 1216px, 100vw" className="aspect-[16/9]" />
      </div>

      <div className="container-page mt-16">
        {project.blocks.length ? (
          <NotionRenderer blocks={project.blocks} className="mx-auto" />
        ) : (
          <p className="measure mx-auto text-muted">The full write-up for this project is on its way.</p>
        )}
      </div>

      {next && next.slug !== project.slug ? (
        <nav aria-label="Next project" className="container-page section-gap">
          <Link href={`/projects/${next.slug}`} className="group surface block rounded-lg p-8 transition-colors duration-[var(--motion-base)] hover:bg-surface-2 sm:p-10">
            <span className="meta text-subtle">Next project</span>
            <span className="mt-2 flex items-center gap-3 text-2xl font-semibold tracking-[var(--type-tracking-heading)] text-fg">
              {next.name}
              <ArrowUpRight
                aria-hidden="true"
                className="size-6 text-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
              />
            </span>
          </Link>
        </nav>
      ) : null}
    </article>
  );
}
