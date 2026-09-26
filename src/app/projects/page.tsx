import type { Metadata } from "next";
import { ProjectIndex } from "@/components/sections/ProjectIndex";
import { PageHeader } from "@/components/ui/primitives";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  // Strip page bodies: the index only needs card fields, and this is a client component.
  const projects = getProjects().map(({ blocks: _blocks, ...project }) => project);

  return (
    <>
      <PageHeader title="Projects" lead="Case studies across product, design and engineering." />
      <div className="container-page mt-12">
        <ProjectIndex projects={projects} />
      </div>
    </>
  );
}
