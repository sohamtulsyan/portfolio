/**
 * Pulls all site content from Notion into a static snapshot.
 *
 *   npm run sync            (also runs automatically before dev and build)
 *
 * GitHub Pages can't call Notion at request time, and Notion file URLs expire
 * after an hour, so this script:
 *   1. reads every database + page body through the Notion API,
 *   2. downloads every Notion-hosted file (photos, covers, images, résumé)
 *      into public/cms/, rewriting URLs to those local copies,
 *   3. writes src/content/generated/snapshot.json for the site to render.
 */
import "./load-env";
import { createHash } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { resumeFileName, site } from "../src/config/site";
import { isNotionConfigured } from "../src/lib/notion/config";
import { fetchBlocks, fetchProfile, fetchProjects, fetchSocials, fetchWork } from "../src/lib/notion/fetch";
import type { NotionBlock } from "../src/lib/notion/types";
import { emptySnapshot, type ContentSnapshot } from "../src/content/snapshot";

const root = process.cwd();
const assetDir = path.join(root, "public", "cms");
const outFile = path.join(root, "src", "content", "generated", "snapshot.json");

const extByType: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
  "application/pdf": ".pdf",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "audio/mpeg": ".mp3",
};

/** Notion-hosted files live on S3 with signed, expiring URLs. */
function isNotionHosted(url: string) {
  try {
    const { hostname } = new URL(url);
    return hostname.endsWith("amazonaws.com") || hostname.endsWith("notion.so") || hostname.endsWith("notion-static.com") || hostname.endsWith("notionusercontent.com");
  } catch {
    return false;
  }
}

const downloaded = new Map<string, string>();

async function localize(url: string | null, fileName?: string): Promise<string | null> {
  if (!url || !isNotionHosted(url)) return url;
  const { pathname } = new URL(url);
  const key = pathname; // stable across re-signed URLs
  const cached = downloaded.get(key);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${pathname}`);
  const type = res.headers.get("content-type")?.split(";")[0] ?? "";
  const ext = path.extname(decodeURIComponent(pathname)) || extByType[type] || "";
  const name = fileName ?? `${createHash("sha1").update(key).digest("hex").slice(0, 16)}${ext.toLowerCase()}`;
  await writeFile(path.join(assetDir, name), Buffer.from(await res.arrayBuffer()));

  const local = `/cms/${name}`;
  downloaded.set(key, local);
  return local;
}

const fileBlockTypes = ["image", "video", "audio", "pdf", "file"] as const;

async function localizeBlocks(blocks: NotionBlock[]): Promise<NotionBlock[]> {
  return Promise.all(
    blocks.map(async (block) => {
      const next = { ...block } as NotionBlock;
      const type = block.type as (typeof fileBlockTypes)[number];
      if (fileBlockTypes.includes(type)) {
        const media = (next as unknown as Record<string, { type: string; file?: { url: string } }>)[type];
        if (media?.type === "file" && media.file) {
          media.file = { ...media.file, url: (await localize(media.file.url)) ?? media.file.url };
        }
      }
      if (block.children) next.children = await localizeBlocks(block.children);
      return next;
    }),
  );
}

async function main() {
  await mkdir(path.dirname(outFile), { recursive: true });

  if (!isNotionConfigured) {
    if (process.env.CI) {
      throw new Error("NOTION_TOKEN is missing in CI. Add it as a repository secret (Settings → Secrets → Actions).");
    }
    await writeFile(outFile, JSON.stringify(emptySnapshot(), null, 2));
    console.log("[sync] NOTION_TOKEN not set. Wrote an empty snapshot (dev shows sample content).");
    return;
  }

  console.log("[sync] Fetching content from Notion…");
  await rm(assetDir, { recursive: true, force: true });
  await mkdir(assetDir, { recursive: true });

  const [profile, projects, work, socials] = await Promise.all([
    fetchProfile(),
    fetchProjects(),
    fetchWork(),
    fetchSocials(),
  ]);

  const aboutBlocks = profile.pageId ? await localizeBlocks(await fetchBlocks(profile.pageId)) : [];

  const snapshot: ContentSnapshot = {
    source: "notion",
    syncedAt: new Date().toISOString(),
    profile: {
      ...profile,
      photoUrl: await localize(profile.photoUrl),
      resumes: Object.fromEntries(
        await Promise.all(
          site.resumes
            .filter(({ id }) => profile.resumes[id])
            .map(async ({ id, label }) => [id, await localize(profile.resumes[id]!, resumeFileName(label))]),
        ),
      ),
    },
    aboutBlocks,
    projects: await Promise.all(
      projects.map(async (project) => ({
        ...project,
        coverUrl: await localize(project.coverUrl),
        blocks: await localizeBlocks(await fetchBlocks(project.id)),
      })),
    ),
    work: await Promise.all(
      work.map(async (item) => ({
        ...item,
        logoUrl: await localize(item.logoUrl),
        blocks: await localizeBlocks(await fetchBlocks(item.id)),
      })),
    ),
    socials,
  };

  await writeFile(outFile, JSON.stringify(snapshot, null, 2));
  console.log(
    `[sync] Done: ${projects.length} projects, ${work.length} roles, ${socials.length} socials, ${downloaded.size} files.`,
  );
}

main().catch((error) => {
  console.error("[sync] Failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
