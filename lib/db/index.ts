import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

type DB = NeonHttpDatabase<typeof schema>;

let _db: DB | null = null;

function getDb(): DB {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.local.example to .env.local and fill it in.",
    );
  }
  const sql = neon(url);
  _db = drizzle(sql, { schema });
  return _db;
}

export const db = new Proxy({} as DB, {
  get(_target, prop) {
    return Reflect.get(getDb() as object, prop);
  },
});

export { schema };
