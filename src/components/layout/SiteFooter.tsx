import type { Profile, Social } from "@/lib/notion/types";
import { SocialLinks } from "./SocialLinks";

/** End-of-page sign-off: the one place every page ends with a way to reach out. */
export function SiteFooter({ profile, socials }: { profile: Profile; socials: Social[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="container-page section-gap pb-[calc(var(--band-height)+1rem)] md:pb-14">
      <div className="flex flex-col gap-10 border-t border-line pt-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="max-w-[20ch] text-2xl font-semibold text-fg">
            Found this interesting? <span className="text-subtle">Let&apos;s connect.</span>
          </p>
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="mt-4 inline-block text-lg font-medium text-accent-text underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--motion-fast)] hover:decoration-current"
            >
              {profile.email}
            </a>
          ) : (
            <p className="mt-4 text-muted">Find me on the links here, or use the Connect page.</p>
          )}
        </div>
        <SocialLinks socials={socials} />
      </div>
      <p className="meta mt-12 text-xs text-subtle">
        © {year} {profile.name}
      </p>
    </footer>
  );
}
