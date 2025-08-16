const mysql = require("mysql2/promise");

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hands2gether_revamped",
  port: parseInt(process.env.DB_PORT || "3306"),
};

async function addCommentCountColumn() {
  let connection;
  try {
    console.log("Connecting to database...");
    connection = await mysql.createConnection(dbConfig);

    console.log("Adding comment_count column to causes table...");

    // Add the comment_count column
    await connection.execute(`
      ALTER TABLE causes 
      ADD COLUMN comment_count INT NOT NULL DEFAULT 0 
      AFTER like_count
    `);

    console.log("✅ comment_count column added successfully");

    // Update existing causes with actual comment counts
    console.log("Updating existing comment counts...");

    const updateQuery = `
      UPDATE causes c 
      SET comment_count = (
        SELECT COUNT(*) 
        FROM comments 
        WHERE cause_id = c.id
      )
    `;

    await connection.execute(updateQuery);

    console.log("✅ Comment counts updated for existing causes");

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function addCommentCountColumn() {
  let connection;
  try {
    console.log("Connecting to database...");
    connection = await mysql.createConnection(dbConfig);

    console.log("Adding comment_count column to causes table...");

    // Add the comment_count column
    await connection.execute(`
      ALTER TABLE causes 
      ADD COLUMN comment_count INT NOT NULL DEFAULT 0 
      AFTER like_count
    `);

    console.log("✅ comment_count column added successfully");

    // Update existing causes with actual comment counts
    console.log("Updating existing comment counts...");

    const updateQuery = `
      UPDATE causes c 
      SET comment_count = (
        SELECT COUNT(*) 
        FROM comments 
        WHERE cause_id = c.id
      )
    `;

    await connection.execute(updateQuery);

    console.log("✅ Comment counts updated for existing causes");

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the migration
addCommentCountColumn()
  .then(() => {
    console.log("All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
