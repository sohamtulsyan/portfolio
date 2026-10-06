import type { Profile, Project, Social, WorkItem } from "@/lib/notion/types";
import { site } from "@/config/site";

/**
 * Sample content used ONLY in `next dev` when NOTION_TOKEN is not set, so the
 * layout can be designed before real content exists. Production never renders
 * this: without Notion it shows empty states instead.
 */

export const demoProfile: Profile = {
  name: site.name,
  role: site.role,
  headline: "I turn fuzzy problems into products people use.",
  intro:
    "Sample intro. I work across product thinking, design and code, taking ideas from a first sketch to something shipped and measured.",
  location: "India",
  email: "sohamt1028@gmail.com",
  availability: "Open to work",
  photoUrl: null,
  resumes: {},
  aboutSummary:
    "Sample About summary. Replace this with the lead paragraph from the Profile row in Notion.",
  seoDescription: site.description,
  pageId: null,
};

export const demoProjects: Project[] = [
  {
    id: "demo-1",
    slug: "sample-project-one",
    name: "Sample project one",
    summary: "Sample summary: a short, plain description of what the project is and why it mattered.",
    role: "Product lead",
    year: 2026,
    tags: ["Product", "Design"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    coverUrl: null,
    liveUrl: null,
    repoUrl: null,
    featured: true,
    order: 1,
  },
  {
    id: "demo-2",
    slug: "sample-project-two",
    name: "Sample project two",
    summary: "Sample summary: the outcome in one sentence, written for someone skimming.",
    role: "Designer and developer",
    year: 2025,
    tags: ["Engineering", "Design"],
    stack: ["Python", "pandas", "scikit-learn", "Streamlit", "Matplotlib"],
    coverUrl: null,
    liveUrl: null,
    repoUrl: null,
    featured: true,
    order: 2,
  },
  {
    id: "demo-3",
    slug: "sample-project-three",
    name: "Sample project three",
    summary: "Sample summary: research that changed a roadmap decision.",
    role: "Researcher",
    year: 2024,
    tags: ["Research", "Strategy"],
    stack: ["Notion", "Figma", "Google Sheets"],
    coverUrl: null,
    liveUrl: null,
    repoUrl: null,
    featured: false,
    order: 3,
  },
];

export const demoWork: WorkItem[] = [
  {
    id: "demo-w1",
    role: "Sample role",
    company: "Sample company",
    companyUrl: null,
    logoUrl: null,
    type: "Full-time",
    start: "2025-01-01",
    end: null,
    location: "Remote",
  },
  {
    id: "demo-w2",
    role: "Sample internship",
    company: "Another company",
    companyUrl: null,
    logoUrl: null,
    type: "Internship",
    start: "2024-05-01",
    end: "2024-08-01",
    location: "Bengaluru",
  },
];

export const demoSocials: Social[] = [
  { id: "s1", name: "GitHub", url: "https://github.com", handle: "@sample", platform: "github" },
  { id: "s2", name: "LinkedIn", url: "https://linkedin.com", handle: "Sample", platform: "linkedin" },
  { id: "s3", name: "X", url: "https://x.com", handle: "@sample", platform: "x" },
  { id: "s4", name: "Email", url: "mailto:sohamt1028@gmail.com", handle: "sohamt1028@gmail.com", platform: "email" },
];
