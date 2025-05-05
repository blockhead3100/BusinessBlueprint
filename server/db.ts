import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
neonConfig.webSocketConstructor = ws;

// Attempt to connect to the primary database, fallback to secondary if it fails
const primaryDatabaseUrl = process.env.DATABASE_URL;
const fallbackDatabaseUrl = process.env.DATABSE_URL; // Note: Typo in the env variable name

if (!primaryDatabaseUrl && !fallbackDatabaseUrl) {
  throw new Error(
    "At least one database URL must be set. Did you forget to provision a database?",
  );
}

export const prisma = new PrismaClient();
let pool;
try {
  if (primaryDatabaseUrl) {
    pool = new Pool({ connectionString: primaryDatabaseUrl });
    console.log("Connected to the primary database.");
  } else {
    throw new Error("Primary database URL is not set.");
  }
} catch (error) {
  if (error instanceof Error) {
    console.error("Failed to connect to the primary database:", error.message);
  } else {
    console.error("Failed to connect to the primary database:", error);
  }
  if (fallbackDatabaseUrl) {
    pool = new Pool({ connectionString: fallbackDatabaseUrl });
    console.log("Connected to the fallback database.");
  } else {
    throw new Error("Fallback database URL is not set or connection failed.");
  }
}

export const db = drizzle({ client: pool, schema });
