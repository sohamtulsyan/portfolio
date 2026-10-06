import type { Metadata } from "next";
import Link from "next/link";
import { WorkTimeline } from "@/components/sections/WorkTimeline";
import { ResumeTabs } from "@/components/sections/ResumeTabs";
import { PageHeader, SectionHeading } from "@/components/ui/primitives";
import { StackList } from "@/components/ui/StackList";
import { getProfile, getProjects, getWork } from "@/lib/content";
import { resumeVersions } from "@/lib/resume";
import { resolveStack } from "@/lib/tech-stack";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  const profile = getProfile();
  const versions = resumeVersions(profile);
  const work = getWork();
  const projects = getProjects().slice(0, 6);

  return (
    <>
      <PageHeader title="Resume" lead="One version per kind of role. Pick the closest fit, or skim the short version below." />

      <div className="container-page mt-12">
        <ResumeTabs versions={versions} name={profile.name} />
      </div>

      <section aria-labelledby="experience" className="container-page section-gap">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeading id="experience" title="Experience." lead="Roles, newest first." className="lg:sticky lg:top-28 lg:self-start" />
          <WorkTimeline work={work} compact />
        </div>
      </section>

      {projects.length ? (
        <section aria-labelledby="resume-projects" className="container-page section-gap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <SectionHeading id="resume-projects" title="Projects." lead="A few worth a look." className="lg:sticky lg:top-28 lg:self-start" />
            <ul className="divide-y divide-line border-y border-line">
              {projects.map((p) => {
                const stackItems = resolveStack(p.stack);
                return (
                  <li key={p.id}>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="group flex min-h-14 items-center justify-between gap-6 py-4 underline-offset-4 hover:underline"
                    >
                      <span className="font-medium text-fg">{p.name}</span>
                      <span className="flex items-center gap-4">
                        {stackItems.length > 0 && (
                          <StackList items={stackItems} variant="icons" label={`${p.name} stack`} />
                        )}
                        <span className="meta text-subtle">{p.year ?? ""}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
