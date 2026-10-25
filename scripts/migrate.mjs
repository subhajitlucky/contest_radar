import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";

const { Client } = pg;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const dbDir = path.resolve("db");
const files = (await readdir(dbDir))
  .filter((file) => file.endsWith(".sql") && file !== "schema_migrations.sql")
  .sort();

const client = new Client({
  connectionString: databaseUrl,
  ssl:
    process.env.DATABASE_SSL === "disable"
      ? false
      : { rejectUnauthorized: false },
});

await client.connect();

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const appliedResult = await client.query("SELECT filename FROM schema_migrations");
  const applied = new Set(appliedResult.rows.map((row) => row.filename));

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip    ${file}`);
      continue;
    }

    const sql = await readFile(path.join(dbDir, file), "utf8");
    await client.query("BEGIN");

    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(`applied ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`Failed to apply ${file}: ${error.message}`, { cause: error });
    }
  }
} finally {
  await client.end();
}
