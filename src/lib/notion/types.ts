import type { ResumeId } from "../../config/site";
import type { BlockObjectResponse } from "@notionhq/client";

export type Availability = "Open to work" | "Open to freelance" | "Not available";

export interface Profile {
  name: string;
  role: string;
  headline: string;
  intro: string;
  location: string;
  email: string;
  availability: Availability | null;
  photoUrl: string | null;
  /** One PDF per résumé version (see site.resumes); null when not uploaded. */
  resumes: Partial<Record<ResumeId, string>>;
  aboutSummary: string;
  seoDescription: string;
  /** Notion page id of the profile row; its body is the About content. */
  pageId: string | null;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  summary: string;
  role: string;
  year: number | null;
  tags: string[];
  /** Tools and languages, as named in Notion ("Next.js", "Python"). Logos resolve in lib/tech-stack. */
  stack: string[];
  coverUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  order: number | null;
}

export type WorkType = "Full-time" | "Internship" | "Freelance" | "Contract" | "Volunteer";

export interface WorkItem {
  id: string;
  role: string;
  company: string;
  companyUrl: string | null;
  /** Company logo: a Notion upload (copied locally at sync) or an external link. Any aspect ratio. */
  logoUrl: string | null;
  type: WorkType | null;
  start: string | null;
  end: string | null;
  location: string;
}

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "x"
  | "instagram"
  | "dribbble"
  | "behance"
  | "medium"
  | "youtube"
  | "email"
  | "website"
  | "other";

export interface Social {
  id: string;
  name: string;
  url: string;
  handle: string;
  platform: SocialPlatform;
}

/** A block with its children resolved, ready for the renderer. */
export type NotionBlock = BlockObjectResponse & { children?: NotionBlock[] };
