import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { NotionRenderer } from "@/components/notion/NotionRenderer";
import { ProjectCover } from "@/components/sections/ProjectCover";
import { Button } from "@/components/ui/Button";
import { SoftButton } from "@/components/ui/SoftButton";
import { Tag } from "@/components/ui/primitives";
import { getProject, getProjects } from "@/lib/content";

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

  return (
    <article>
      <header className="container-page pt-28 sm:pt-36">
        <Link
          href="/projects"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-subtle transition-colors hover:text-fg"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All projects
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-fg">{project.name}</h1>
        {project.summary ? <p className="measure mt-5 text-lg text-muted">{project.summary}</p> : null}

        <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5">
          {meta.length ? (
            <dl className="flex gap-10">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="text-xs text-subtle">{m.label}</dt>
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

        {project.liveUrl || project.repoUrl ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {project.liveUrl ? (
              <Button href={project.liveUrl} target="_blank" rel="noreferrer">
                Visit project <ArrowUpRight aria-hidden="true" className="size-4" />
              </Button>
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
          <Link href={`/projects/${next.slug}`} className="group glass lit-edge block rounded-lg p-8 sm:p-10">
            <span className="text-sm text-subtle">Next project</span>
            <span className="mt-2 flex items-center gap-3 text-2xl font-bold text-fg">
              {next.name}
              <ArrowUpRight
                aria-hidden="true"
                className="size-6 text-subtle transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-fg"
              />
            </span>
          </Link>
        </nav>
      ) : null}
    </article>
  );
}
