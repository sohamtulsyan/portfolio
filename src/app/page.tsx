import { Hero } from "@/components/sections/Hero";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { WorkTimeline } from "@/components/sections/WorkTimeline";
import { Button } from "@/components/ui/Button";
import { SampleNotice, SectionHeading } from "@/components/ui/primitives";
import { getProfile, getProjects, getSocials, getWork, isSampleContent } from "@/lib/content";

export default function HomePage() {
  const profile = getProfile();
  const socials = getSocials();
  const projects = getProjects();
  const featured = projects.filter((p) => p.featured);
  const work = getWork().slice(0, 3);

  return (
    <>
      <Hero profile={profile} socials={socials} />
      {isSampleContent() ? <SampleNotice /> : null}

      <FeaturedProjects projects={(featured.length ? featured : projects).slice(0, 4)} />

      {work.length ? (
        <section aria-labelledby="lately" className="container-page section-gap">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <SectionHeading
              id="lately"
              title="Experience."
              lead="Where I've been working lately."
              action={
                <Button href="/work" variant="link">
                  Full history
                </Button>
              }
              className="flex-col items-start lg:sticky lg:top-24 lg:self-start"
            />
            <WorkTimeline work={work} compact />
          </div>
        </section>
      ) : null}
    </>
  );
}
