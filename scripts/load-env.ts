/**
 * Loads .env, .env.local, .env.development etc. the same way `next` does.
 * `tsx` doesn't read env files on its own, so this must be the sync script's
 * first import: modules evaluate in import order, and src/lib/notion/config
 * reads process.env as soon as it loads. Variables already set in the
 * environment (CI secrets) win over the files.
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");
