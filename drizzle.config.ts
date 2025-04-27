import { defineConfig } from "drizzle-kit"; // Ensure this is correct or replace with the appropriate method

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Ensure the database is provisioned and the environment variable is set.");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
});
