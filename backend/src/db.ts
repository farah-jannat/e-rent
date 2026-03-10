import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/schemas";
import { config } from "@/config";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type SqlDB = typeof db;
