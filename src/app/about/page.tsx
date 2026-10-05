import type { Metadata } from "next";
import Image from "next/image";
import { NotionRenderer } from "@/components/notion/NotionRenderer";
import { SoftButton } from "@/components/ui/SoftButton";
import { PageHeader } from "@/components/ui/primitives";
import { site } from "@/config/site";
import { getAboutBlocks, getProfile } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const profile = getProfile();
  const blocks = getAboutBlocks();

  const facts = [
    { label: "Based in", value: profile.location },
    { label: "Status", value: profile.availability },
    { label: "Focus", value: profile.role },
  ].filter((f) => f.value);

  return (
    <>
      <PageHeader title="About" lead={profile.aboutSummary || profile.intro || undefined} />

      <div className="container-page mt-16 grid gap-14 lg:grid-cols-[17rem_1fr] lg:gap-20">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="max-w-[17rem]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-raise)]">
              <Image
                src={profile.photoUrl ?? site.portrait.src}
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="17rem"
                className="object-cover"
                style={{ objectPosition: profile.photoUrl ? "50% 35%" : site.portrait.focus }}
              />
            </div>
          </div>

          {facts.length ? (
            <dl className="mt-8 space-y-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="meta text-xs text-subtle">{f.label}</dt>
                  <dd className="font-semibold text-fg">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <SoftButton href="/resume" className="mt-8">
            View résumé
          </SoftButton>
        </aside>

        <article>
          {blocks.length ? (
            <NotionRenderer blocks={blocks} />
          ) : (
            <p className="measure text-lg text-muted">
              The longer story is being written. Until then, the projects and work pages say the most about how I work.
            </p>
          )}
        </article>
      </div>
    </>
  );
}
