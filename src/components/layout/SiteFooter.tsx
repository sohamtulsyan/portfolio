import type { Profile, Social } from "@/lib/notion/types";
import { SocialLinks } from "./SocialLinks";

/** End-of-page sign-off: the one place every page ends with a way to reach out. */
export function SiteFooter({ profile, socials }: { profile: Profile; socials: Social[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="container-page section-gap pb-[calc(var(--band-height)+1rem)]">
      <div className="flex flex-col gap-10 border-t border-line pt-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-2xl font-bold">Have something worth building?</p>
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="neon-text mt-3 inline-block text-xl font-semibold text-fg underline decoration-line-strong hover:decoration-fg"
            >
              {profile.email}
            </a>
          ) : (
            <p className="mt-3 text-muted">Find me on the links here, or use the Connect page.</p>
          )}
        </div>
        <SocialLinks socials={socials} />
      </div>
      <p className="mt-10 text-xs text-subtle">
        © {year} {profile.name}
      </p>
    </footer>
  );
}
