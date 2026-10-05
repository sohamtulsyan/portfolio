import type { Metadata } from "next";
import { ConnectForm } from "@/components/sections/ConnectForm";
import { SocialIcon } from "@/components/icons/SocialIcon";
import { PageHeader } from "@/components/ui/primitives";
import { getProfile, getSocials } from "@/lib/content";

export const metadata: Metadata = { title: "Connect" };

export default function ConnectPage() {
  const profile = getProfile();
  const socials = getSocials();

  return (
    <>
      <PageHeader title="Let's talk" lead="Tell me what you're working on, or just say hello." />

      <div className="container-page mt-14 grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <ConnectForm email={profile.email} />

        <div>
          {profile.email ? (
            <div>
              <p className="meta text-subtle">Email</p>
              <a
                href={`mailto:${profile.email}`}
                className="title mt-1 inline-block text-xl font-semibold break-all text-accent-text underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--motion-fast)] hover:decoration-current sm:text-2xl"
              >
                {profile.email}
              </a>
            </div>
          ) : null}

          {socials.length ? (
            <ul className={profile.email ? "mt-10 divide-y divide-line border-y border-line" : "divide-y divide-line border-y border-line"}>
              {socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target={s.url.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer me"
                    className="group flex min-h-16 items-center gap-4 py-3"
                  >
                    <span className="flex size-11 items-center justify-center rounded-full border border-line text-muted transition-[color,border-color] duration-[var(--motion-fast)] group-hover:border-line-strong group-hover:text-fg">
                      <SocialIcon platform={s.platform} className="size-[18px]" />
                    </span>
                    <span className="flex-1 font-medium text-fg">{s.name}</span>
                    {s.handle ? <span className="truncate text-sm text-subtle">{s.handle}</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </>
  );
}
