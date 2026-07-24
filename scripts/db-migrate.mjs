import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import pg from "pg";

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Missing DATABASE_URL. See .env.example.");
  process.exit(1);
}

const migrationsDir = path.join(__dirname, "..", "db", "migrations");

async function main() {
  const files = (await fs.readdir(migrationsDir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (!files.length) {
    console.log("No migrations found.");
    return;
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    await client.query(`
      create table if not exists schema_migrations (
        id text primary key,
        applied_at timestamptz not null default now()
      )
    `);

    for (const file of files) {
      const applied = await client.query(
        `select 1 from schema_migrations where id = $1`,
        [file],
      );
      if (applied.rowCount) {
        console.log(`Skip ${file}`);
        continue;
      }

      const fullPath = path.join(migrationsDir, file);
      const sql = await fs.readFile(fullPath, "utf8");
      await client.query("begin");
      try {
        await client.query(sql);
        await client.query(`insert into schema_migrations (id) values ($1)`, [
          file,
        ]);
        await client.query("commit");
        console.log(`Applied ${file}`);
      } catch (e) {
        await client.query("rollback");
        throw e;
      }
    }
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
