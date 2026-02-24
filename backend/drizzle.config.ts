import { config } from "@/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "drizzle/migrations",
  schema: "src/schemas/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});
