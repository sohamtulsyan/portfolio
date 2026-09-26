import { Client } from "@notionhq/client";
import { notionConfig } from "./config";

let client: Client | null = null;

export function getNotion(): Client | null {
  if (!notionConfig.token) return null;
  client ??= new Client({ auth: notionConfig.token, timeoutMs: 15_000 });
  return client;
}
