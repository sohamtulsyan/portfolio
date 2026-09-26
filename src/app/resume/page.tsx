import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { WorkTimeline } from "@/components/sections/WorkTimeline";
import { Button } from "@/components/ui/Button";
import { SoftButton } from "@/components/ui/SoftButton";
import { EmptyState, GlassPanel, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { getProfile, getProjects, getWork } from "@/lib/content";
import { resumeHref } from "@/lib/resume";

export const metadata: Metadata = { title: "Résumé" };

export default function ResumePage() {
  const profile = getProfile();
  const resume = resumeHref(profile);
  const work = getWork();
  const projects = getProjects().slice(0, 6);

  return (
    <>
      <PageHeader title="Résumé" lead="Grab the PDF, or skim the short version below." />

      <div className="container-page mt-12">
        {resume.available ? (
          <GlassPanel lit className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xl font-bold text-fg">{profile.name}, résumé (PDF)</p>
              <p className="mt-1 text-sm text-subtle">Updated whenever the site rebuilds.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button href={resume.href} download={resume.download}>
                <Download aria-hidden="true" className="size-4" />
                Download PDF
              </Button>
              <SoftButton href={resume.href} target="_blank" rel="noreferrer">
                Open in browser
              </SoftButton>
            </div>
          </GlassPanel>
        ) : (
          <EmptyState
            title="The PDF isn't uploaded yet"
            body="In the meantime, the summary below covers the same ground, and the Connect page reaches me directly."
          />
        )}
      </div>

      <section aria-labelledby="experience" className="container-page section-gap">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeading id="experience" title="Experience" className="lg:sticky lg:top-24 lg:self-start" />
          <WorkTimeline work={work} compact />
        </div>
      </section>

      {projects.length ? (
        <section aria-labelledby="resume-projects" className="container-page section-gap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <SectionHeading id="resume-projects" title="Projects" className="lg:sticky lg:top-24 lg:self-start" />
            <ul className="divide-y divide-line border-y border-line">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="flex min-h-14 items-baseline justify-between gap-6 py-4 transition-colors hover:text-fg"
                  >
                    <span className="font-semibold text-fg">{p.name}</span>
                    <span className="text-sm text-subtle tabular-nums">{p.year ?? ""}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
