import {
  siDocker,
  siEjs,
  siExpress,
  siFastapi,
  siFigma,
  siFirebase,
  siFramer,
  siGit,
  siGithub,
  siGithubactions,
  siGooglecloud,
  siGooglegemini,
  siGooglesheets,
  siHuggingface,
  siJavascript,
  siJupyter,
  siLangchain,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siNotion,
  siNumpy,
  siPandas,
  siPlotly,
  siPostgresql,
  siPostman,
  siPreact,
  siPrisma,
  siPydantic,
  siPython,
  siPytorch,
  siRadixui,
  siReact,
  siScikitlearn,
  siScipy,
  siShadcnui,
  siSocketdotio,
  siSqlite,
  siStrapi,
  siStreamlit,
  siSupabase,
  siTailwindcss,
  siTensorflow,
  siTypescript,
  siVercel,
  siVite,
  siWxt,
  siZod,
  type SimpleIcon,
} from "simple-icons";

/**
 * Tech-stack logos for projects. Notion's "Tech Stack" multi-select holds
 * plain names; this maps them to simple-icons glyphs (SVG paths bundled at
 * build time: no image files, no CDN requests). Resolve on the server and
 * pass the result down, so the registry never ships to the browser.
 *
 * Names without a logo here (OpenAI, Matplotlib…) still render, as text.
 * To add one: import its `si…` export and list it below with any aliases.
 */

const registry: [SimpleIcon, ...string[]][] = [
  // Web
  [siTypescript, "ts"],
  [siJavascript, "js"],
  [siReact, "reactjs"],
  [siNextdotjs, "next", "nextjs"],
  [siTailwindcss, "tailwind"],
  [siPreact],
  [siVite],
  [siWxt, "chrome extension", "chrome extensions"],
  [siRadixui, "radix"],
  [siShadcnui, "shadcn"],
  [siFramer, "framer motion"],
  [siZod],
  // Backend & data stores
  [siNodedotjs, "node", "nodejs"],
  [siExpress, "expressjs"],
  [siPrisma],
  [siPostgresql, "postgres"],
  [siMysql],
  [siSqlite],
  [siSupabase],
  [siFirebase],
  [siMongodb, "mongo"],
  [siStrapi],
  [siEjs],
  [siSocketdotio, "socketio", "socket io"],
  [siFastapi],
  [siPydantic],
  // Data & ML
  [siPython],
  [siPandas],
  [siNumpy],
  [siScipy],
  [siScikitlearn, "sklearn"],
  [siJupyter, "jupyter notebook", "jupyterlab"],
  [siStreamlit],
  [siPlotly],
  [siPytorch, "torch"],
  [siTensorflow],
  [siHuggingface],
  [siLangchain],
  [siGooglegemini, "gemini", "gemini api"],
  // Tools & platforms
  [siGooglecloud, "gcp", "google apis"],
  [siGooglesheets, "sheets"],
  [siNotion],
  [siFigma],
  [siGit],
  [siGithub],
  [siGithubactions],
  [siVercel],
  [siDocker],
  [siPostman],
];

const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "");

const lookup = new Map<string, SimpleIcon>();
for (const [icon, ...aliases] of registry) {
  for (const key of [icon.title, icon.slug, ...aliases]) lookup.set(normalize(key), icon);
}

export interface StackItem {
  /** The name as written in Notion. */
  name: string;
  /** SVG path in a 24×24 viewBox, or null when there's no logo. */
  path: string | null;
}

export function resolveStack(names: string[] | undefined): StackItem[] {
  return (names ?? []).map((name) => ({ name, path: lookup.get(normalize(name))?.path ?? null }));
}
