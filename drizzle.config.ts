import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import type { Config } from "drizzle-kit";

// Prefer .env.local (standard for Next.js); fall back to .env.local.example.
const envFile = existsSync(".env.local")
  ? ".env.local"
  : existsSync(".env.local.example")
    ? ".env.local.example"
    : ".env";
loadEnv({ path: envFile });

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: false,
  verbose: false,
} satisfies Config;
