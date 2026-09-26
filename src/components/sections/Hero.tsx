import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SoftButton } from "@/components/ui/SoftButton";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { site } from "@/config/site";
import type { Profile, Social } from "@/lib/notion/types";
import { resumeHref } from "@/lib/resume";
import { theme } from "@/themes";

/**
 * Home hero: the name set large over the liquid wave, with the portrait as the
 * light source on the right. The text layer ignores the pointer (so the wave
 * reacts under it); only real controls opt back in.
 */
export function Hero({ profile, socials }: { profile: Profile; socials: Social[] }) {
  const { HeroBackground } = theme.slots;
  const [first, ...rest] = profile.name.split(" ");
  const lead = profile.headline || profile.role;
  const resume = resumeHref(profile);

  return (
    <section aria-labelledby="hero-name" className="relative isolate min-h-[100svh] overflow-hidden">
      <HeroBackground className="-z-10" />

      <div className="container-page pointer-events-none grid min-h-[100svh] content-center items-center gap-8 pt-10 pb-[calc(var(--band-height)+1rem)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pt-10">
        <div className="order-2 lg:order-1">
          <h1 id="hero-name" className="display neon-text text-fg">
            {first}
            {rest.length ? (
              <>
                <br />
                {rest.join(" ")}
              </>
            ) : null}
          </h1>

          <p className="mt-6 max-w-[22ch] text-xl font-semibold text-fg sm:text-2xl">{lead}</p>
          {profile.intro ? <p className="measure mt-4 text-lg text-muted">{profile.intro}</p> : null}

          <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4">
            <Button href="/projects">See projects</Button>
            <SoftButton href={resume.href} download={resume.download}>
              Download résumé
            </SoftButton>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            {profile.availability && profile.availability !== "Not available" ? (
              <p className="flex items-center gap-2.5 text-sm text-muted">
                <span aria-hidden="true" className="relative flex size-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative size-2.5 rounded-full bg-fg shadow-[var(--glow-md)]" />
                </span>
                {profile.availability}
                {profile.location ? <span className="text-subtle">in {profile.location}</span> : null}
              </p>
            ) : null}
            <SocialLinks socials={socials.slice(0, 4)} className="pointer-events-auto xl:hidden" />
          </div>
        </div>

        <Portrait profile={profile} />
      </div>
    </section>
  );
}

function Portrait({ profile }: { profile: Profile }) {
  const src = profile.photoUrl ?? site.portrait.src;
  const focus = profile.photoUrl ? "50% 35%" : site.portrait.focus;
  const alt = `Portrait of ${profile.name}`;

  if (theme.hero.portrait === "cutout") {
    return (
      <div className="relative order-1 mx-auto h-[42svh] w-full max-w-md self-end lg:order-2 lg:h-[78svh] lg:max-w-none">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-contain object-bottom [filter:var(--portrait-glow)]"
        />
      </div>
    );
  }

  return (
    <div className="order-1 w-full max-w-[11rem] sm:max-w-[14rem] lg:order-2 lg:mx-auto lg:max-w-[26rem] lg:justify-self-end">
      <div className="glass lit-edge rounded-lg p-2 shadow-[var(--glow-md)]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--shape-lg)-0.5rem)]">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 26rem, 19rem"
            className="object-cover"
            style={{ objectPosition: focus }}
          />
          <div aria-hidden="true" className="absolute inset-0 [background:var(--portrait-tint)]" />
        </div>
      </div>
    </div>
  );
}
