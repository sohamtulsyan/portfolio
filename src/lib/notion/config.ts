/**
 * Notion data source IDs (not secrets). These point at the databases inside
 * "Portfolio Website Content". Override any of them with env vars if you
 * duplicate the workspace. Only NOTION_TOKEN is required.
 */
export const notionConfig = {
  token: process.env.NOTION_TOKEN,
  dataSources: {
    profile: process.env.NOTION_PROFILE_DS ?? "51252fa1-0176-4fe4-ae25-51770ec04cdf",
    projects: process.env.NOTION_PROJECTS_DS ?? "dfc65363-d344-4e4f-8c2b-6d3dac60a7e5",
    work: process.env.NOTION_WORK_DS ?? "7cf086eb-0a50-4929-a29a-9cb737fcd19d",
    socials: process.env.NOTION_SOCIALS_DS ?? "4f276a31-ee47-4f1a-9607-ea4b6de0619f",
  },
} as const;

export const isNotionConfigured = Boolean(notionConfig.token);
