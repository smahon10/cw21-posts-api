import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { connection, db } from "./index";

async function runMigration() {
  console.log("Running migration");

  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });
}

runMigration()
  .then(() => console.log("Migration complete"))
  .catch((err) => console.error("Migration failed", err))
  .finally(() =>
    // Don't forget to close the connection, otherwise the process will remain open
    connection.close(),
  );
