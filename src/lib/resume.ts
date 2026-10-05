import { resumeFileName, site, type ResumeId } from "@/config/site";
import type { Profile } from "@/lib/notion/types";

export interface ResumeVersion {
  id: ResumeId;
  label: string;
  /** Local copy of the Notion PDF (/cms/...), or null when not uploaded yet. */
  href: string | null;
  fileName: string;
}

/** Every résumé version in tab order, with its file when Notion has one. */
export function resumeVersions(profile: Profile): ResumeVersion[] {
  return site.resumes.map(({ id, label }) => ({
    id,
    label,
    href: profile.resumes?.[id] ?? null, // snapshots synced before versions existed have no `resumes`
    fileName: resumeFileName(label),
  }));
}
