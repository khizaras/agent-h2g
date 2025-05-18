require("dotenv").config();
const path = require("path");
const { exec } = require("child_process");

// List of migration scripts to run in order
const migrations = [
  "../backend/migrations/add_imageFileId_to_causes.js",
  "../backend/migrations/migrate_images_to_imagekit.js",
];

async function runMigrations() {
  for (const migration of migrations) {
    const migrationPath = path.resolve(__dirname, migration);
    console.log(`Running migration: ${migrationPath}`);

    try {
      await execPromise(`node ${migrationPath}`);
      console.log(`Migration ${migration} completed successfully.`);
    } catch (error) {
      console.error(`Migration ${migration} failed:`, error);
      process.exit(1);
    }
  }

  console.log("All migrations completed successfully.");
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      console.log(stdout);
      if (stderr) console.error(stderr);

      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

runMigrations();
