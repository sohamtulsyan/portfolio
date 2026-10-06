import { readFileSync } from "node:fs";
import path from "node:path";
import { demoProfile, demoProjects, demoSocials, demoWork } from "@/content/demo";
import { emptySnapshot, type ContentSnapshot, type ProjectWithBody, type WorkWithBody } from "@/content/snapshot";
import type { Profile, Social } from "@/lib/notion/types";

/**
 * The site's content API. Server components call these at build time; they
 * read the snapshot written by `npm run sync` (see scripts/sync-content.ts).
 * In `next dev` without Notion content, sample content fills the layout.
 */

let snapshot: ContentSnapshot | null = null;

function load(): ContentSnapshot {
  if (snapshot && process.env.NODE_ENV === "production") return snapshot;
  try {
    const file = path.join(process.cwd(), "src", "content", "generated", "snapshot.json");
    snapshot = JSON.parse(readFileSync(file, "utf8")) as ContentSnapshot;
  } catch {
    snapshot = emptySnapshot();
  }
  return snapshot;
}

const showDemo = () => load().source === "empty" && process.env.NODE_ENV === "development";

export function getProfile(): Profile {
  return showDemo() ? demoProfile : load().profile;
}

export function getAboutBlocks() {
  return load().aboutBlocks;
}

export function getProjects(): ProjectWithBody[] {
  return showDemo() ? demoProjects.map((p) => ({ ...p, blocks: [] })) : load().projects;
}

export function getProject(slug: string) {
  return getProjects().find((p) => p.slug === slug) ?? null;
}

export function getWork(): WorkWithBody[] {
  return showDemo() ? demoWork.map((w) => ({ ...w, blocks: [] })) : load().work;
}

export function getSocials(): Social[] {
  return showDemo() ? demoSocials : load().socials;
}

export function isSampleContent() {
  return showDemo();
}
