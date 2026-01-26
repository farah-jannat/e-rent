import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

export const catchError = async <T, E = Error>(
  promise: Promise<T>
): Promise<[E | null, T | null]> => {
  try {
    const result = await promise;
    return [null, result];
  } catch (error: unknown) {
    return [error as E, null];
  }
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set for migrations");
}

// Use a separate pool for migration and ensure it is closed afterward
const pool = new Pool({
  connectionString: connectionString,
  //   connectionString: config.DATABASE_URL,
});

const db = drizzle(pool);

async function runMigrations() {
  console.log("--- Starting Drizzle Migrations (migrate.ts) ---");

  const [error, su] = await catchError(
    migrate(db, { migrationsFolder: "./migrations" })
  );

  if (su) console.log("--- Migrations finished successfully ---");

  if (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }

  await pool.end();
}

runMigrations();