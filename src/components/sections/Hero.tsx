import Image from "next/image";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { SoftButton } from "@/components/ui/SoftButton";
import FadeUpTitle from "@/components/effects/FadeUpTitle";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { site } from "@/config/site";
import type { Profile, Social } from "@/lib/notion/types";
import { resumeHref } from "@/lib/resume";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Home hero: a greeting set large (its words fade up in turn), a two-tone
 * statement under it, and the waving illustration on the right. The rest
 * of the content settles into focus after the greeting.
 */
export function Hero({ profile, socials }: { profile: Profile; socials: Social[] }) {
  const [first] = profile.name.split(" ");
  const lead = profile.headline || profile.role;
  const resume = resumeHref(profile);

  return (
    <section aria-labelledby="hero-name" className="relative">
      <div className="container-page grid min-h-[min(100svh,60rem)] content-center items-center gap-10 pt-16 pb-[calc(var(--band-height)+2rem)] md:pt-32 md:pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div className="order-2 lg:order-1">
          <FadeUpTitle id="hero-name">{`Hi, I’m ${first}`}</FadeUpTitle>

          <p className="rise mt-6 max-w-[24ch] text-2xl font-semibold text-muted" style={step(3)}>
            {lead}
          </p>
          {profile.intro ? (
            <p className="rise mt-5 max-w-[46ch] text-lg text-muted" style={step(4)}>
              {profile.intro}
            </p>
          ) : null}

          <div className="rise mt-10 flex flex-wrap items-center gap-4" style={step(5)}>
            <Button href="/projects">See projects</Button>
            <SoftButton href={resume.href} download={resume.download}>
              Download résumé
            </SoftButton>
          </div>

          <div className="rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" style={step(6)}>
            {profile.availability && profile.availability !== "Not available" ? (
              <p className="meta flex items-center gap-2.5 text-muted">
                <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
                {profile.availability}
                {profile.location ? <span className="text-subtle">in {profile.location}</span> : null}
              </p>
            ) : null}
            <SocialLinks socials={socials.slice(0, 4)} className="lg:hidden" />
          </div>
        </div>

        <HeroArt name={first} />
      </div>
    </section>
  );
}

/**
 * The waving line drawing. Both scheme variants are in the page; CSS shows
 * the one matching html[data-theme], so switching themes never refetches.
 * Its open bottom strokes dissolve into the page instead of ending on a cut.
 */
function HeroArt({ name }: { name: string }) {
  const { light, dark, width, height } = site.heroArt;
  const alt = `Line drawing of ${name} waving hello`;
  const shared = {
    width,
    height,
    priority: true,
    sizes: "(min-width: 1024px) 30rem, 15rem",
    className: "h-auto w-full",
  };

  return (
    <div
      className="rise order-1 w-full max-w-[13rem] [mask-image:linear-gradient(to_bottom,black_82%,transparent)] sm:max-w-[16rem] lg:order-2 lg:max-w-[30rem] lg:justify-self-end"
      style={step(1)}
    >
      <Image src={light} alt={alt} {...shared} className={`${shared.className} only-light`} />
      <Image src={dark} alt={alt} {...shared} className={`${shared.className} only-dark`} />
    </div>
  );
}
