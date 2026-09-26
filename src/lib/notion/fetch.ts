import { collectPaginatedAPI, isFullBlock, isFullPage, type PageObjectResponse } from "@notionhq/client";
import { site } from "../../config/site";
import { emptyProfile } from "../../content/snapshot";
import { slugify } from "../utils";
import { getNotion } from "./client";
import { notionConfig } from "./config";
import * as prop from "./properties";
import type { Availability, NotionBlock, Profile, Project, Social, SocialPlatform, WorkItem, WorkType } from "./types";

/**
 * Build-time Notion reader. Only scripts/sync-content.ts calls this; the site
 * itself renders from the snapshot it produces (GitHub Pages is static).
 * Errors throw on purpose: a bad token should fail the build, not ship blank.
 */

async function queryAll(dataSourceId: string, published = true): Promise<PageObjectResponse[]> {
  const notion = getNotion();
  if (!notion) throw new Error("NOTION_TOKEN is not set");
  const rows = await collectPaginatedAPI(notion.dataSources.query, {
    data_source_id: dataSourceId,
    ...(published ? { filter: { property: "Published", checkbox: { equals: true } } } : {}),
  });
  return rows.filter(isFullPage);
}

function byOrder<T extends { order?: number | null }>(a: T, b: T) {
  return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
}

export async function fetchProfile(): Promise<Profile> {
  const [row] = await queryAll(notionConfig.dataSources.profile, false);
  if (!row) return emptyProfile;
  const p = row.properties;
  return {
    name: prop.text(p, "Name") || site.name,
    role: prop.text(p, "Role") || site.role,
    headline: prop.text(p, "Headline"),
    intro: prop.text(p, "Intro"),
    location: prop.text(p, "Location"),
    email: prop.email(p, "Email"),
    availability: prop.select(p, "Availability") as Availability | null,
    photoUrl: prop.firstFile(p, "Photo"),
    resumeUrl: prop.firstFile(p, "Resume"),
    aboutSummary: prop.text(p, "About Summary"),
    seoDescription: prop.text(p, "SEO Description") || site.description,
    pageId: row.id,
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const rows = await queryAll(notionConfig.dataSources.projects);
  const seen = new Set<string>();
  return rows
    .map((row): Project => {
      const p = row.properties;
      const name = prop.text(p, "Name") || "Untitled project";
      let slug = slugify(prop.text(p, "Slug") || name) || row.id;
      if (seen.has(slug)) slug = `${slug}-${row.id.slice(0, 6)}`;
      seen.add(slug);
      return {
        id: row.id,
        slug,
        name,
        summary: prop.text(p, "Summary"),
        role: prop.text(p, "Role"),
        year: prop.number(p, "Year"),
        tags: prop.multiSelect(p, "Tags"),
        coverUrl: prop.firstFile(p, "Cover"),
        liveUrl: prop.url(p, "Live URL"),
        repoUrl: prop.url(p, "Repo URL"),
        featured: prop.checkbox(p, "Featured"),
        order: prop.number(p, "Order"),
      };
    })
    .sort((a, b) => byOrder(a, b) || (b.year ?? 0) - (a.year ?? 0));
}

export async function fetchWork(): Promise<WorkItem[]> {
  const rows = await queryAll(notionConfig.dataSources.work);
  return rows
    .map((row) => {
      const p = row.properties;
      const { start, end } = prop.dateRange(p, "Dates");
      return {
        id: row.id,
        role: prop.text(p, "Role") || "Untitled role",
        company: prop.text(p, "Company"),
        companyUrl: prop.url(p, "Company URL"),
        type: prop.select(p, "Type") as WorkType | null,
        start,
        end,
        location: prop.text(p, "Location"),
        summary: prop.text(p, "Summary"),
        highlights: prop
          .text(p, "Highlights")
          .split("\n")
          .map((line) => line.replace(/^[-•*]\s*/, "").trim())
          .filter(Boolean),
        order: prop.number(p, "Order"),
      };
    })
    .sort((a, b) => byOrder(a, b) || (b.start ?? "").localeCompare(a.start ?? ""))
    .map(({ order: _order, ...item }) => item);
}

const platforms: SocialPlatform[] = [
  "github", "linkedin", "x", "instagram", "dribbble", "behance", "medium", "youtube", "email", "website", "other",
];

export async function fetchSocials(): Promise<Social[]> {
  const rows = await queryAll(notionConfig.dataSources.socials);
  return rows
    .map((row) => {
      const p = row.properties;
      const platform = (prop.select(p, "Platform") ?? "other") as SocialPlatform;
      return {
        id: row.id,
        name: prop.text(p, "Name"),
        url: prop.url(p, "URL") ?? "",
        handle: prop.text(p, "Handle"),
        platform: platforms.includes(platform) ? platform : "other",
        order: prop.number(p, "Order"),
      };
    })
    .filter((s) => s.url)
    .sort(byOrder)
    .map(({ order: _order, ...social }) => social);
}

const MAX_DEPTH = 3;

export async function fetchBlocks(blockId: string, depth = 0): Promise<NotionBlock[]> {
  const notion = getNotion();
  if (!notion) throw new Error("NOTION_TOKEN is not set");
  const results = await collectPaginatedAPI(notion.blocks.children.list, { block_id: blockId });
  const blocks = results.filter(isFullBlock) as NotionBlock[];
  if (depth >= MAX_DEPTH) return blocks;
  return Promise.all(
    blocks.map(async (block) =>
      block.has_children && block.type !== "child_page" && block.type !== "child_database"
        ? { ...block, children: await fetchBlocks(block.id, depth + 1) }
        : block,
    ),
  );
}
