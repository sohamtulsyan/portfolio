import { site } from "../config/site";
import type { NotionBlock, Profile, Project, Social, WorkItem } from "../lib/notion/types";

/** Shape of src/content/generated/snapshot.json, written by `npm run sync`. */
export interface ContentSnapshot {
  /** "notion" = real content; "empty" = synced without a token. */
  source: "notion" | "empty";
  syncedAt: string;
  profile: Profile;
  aboutBlocks: NotionBlock[];
  projects: ProjectWithBody[];
  work: WorkWithBody[];
  socials: Social[];
}

export interface ProjectWithBody extends Project {
  blocks: NotionBlock[];
}

/** A role plus its Notion page body (the write-up and highlights callout). */
export interface WorkWithBody extends WorkItem {
  blocks: NotionBlock[];
}

export const emptyProfile: Profile = {
  name: site.name,
  role: site.role,
  headline: "",
  intro: "",
  location: "",
  email: "",
  availability: null,
  photoUrl: null,
  resumes: {},
  aboutSummary: "",
  seoDescription: site.description,
  pageId: null,
};

export const emptySnapshot = (): ContentSnapshot => ({
  source: "empty",
  syncedAt: new Date().toISOString(),
  profile: emptyProfile,
  aboutBlocks: [],
  projects: [],
  work: [],
  socials: [],
});
