const mysql = require("mysql2/promise");

async function runMigration() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hands2gether_revamped",
  });

  try {
    console.log("Creating activities table...");

    // Create the activities table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS \`activities\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`user_id\` INT NOT NULL,
        \`cause_id\` INT NULL DEFAULT NULL,
        \`type\` ENUM('cause_created', 'cause_updated', 'cause_viewed', 'activity_logged', 'registration', 'donation', 'comment_added', 'support_given') NOT NULL,
        \`description\` TEXT NOT NULL,
        \`metadata\` JSON NULL DEFAULT NULL,
        \`ip_address\` VARCHAR(45) NULL DEFAULT NULL,
        \`user_agent\` TEXT NULL DEFAULT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_user_id\` (\`user_id\` ASC),
        INDEX \`idx_cause_id\` (\`cause_id\` ASC),
        INDEX \`idx_type\` (\`type\` ASC),
        INDEX \`idx_created_at\` (\`created_at\` ASC),
        INDEX \`idx_user_cause\` (\`user_id\` ASC, \`cause_id\` ASC),
        INDEX \`idx_user_type\` (\`user_id\` ASC, \`type\` ASC)
      ) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci
    `;

    // Check if there are existing users and causes to populate sample data
    const [users] = await connection.execute(
      "SELECT COUNT(*) as count FROM users",
    );
    const [causes] = await connection.execute(
      "SELECT COUNT(*) as count FROM causes",
    );

    if (users[0].count > 0) {
      console.log("Adding registration activities for existing users...");
      const registrationSQL = `
        INSERT IGNORE INTO \`activities\` (\`user_id\`, \`type\`, \`description\`, \`created_at\`)
        SELECT 
          \`id\` as user_id,
          'registration' as type,
          CONCAT('User ', \`name\`, ' registered on the platform') as description,
          \`created_at\`
        FROM \`users\`
        WHERE NOT EXISTS (
          SELECT 1 FROM \`activities\` a WHERE a.user_id = \`users\`.id AND a.type = 'registration'
        )
      `;
      await connection.execute(registrationSQL);
    }

    if (causes[0].count > 0) {
      console.log("Adding cause creation activities...");
      const causeCreationSQL = `
        INSERT IGNORE INTO \`activities\` (\`user_id\`, \`cause_id\`, \`type\`, \`description\`, \`created_at\`)
        SELECT 
          \`user_id\`,
          \`id\` as cause_id,
          'cause_created' as type,
          CONCAT('Created cause: ', \`title\`) as description,
          \`created_at\`
        FROM \`causes\`
        WHERE NOT EXISTS (
          SELECT 1 FROM \`activities\` a WHERE a.cause_id = \`causes\`.id AND a.type = 'cause_created'
        )
      `;
      await connection.execute(causeCreationSQL);

      console.log("Adding sample view activities...");
      const viewActivitiesSQL = `
        INSERT IGNORE INTO \`activities\` (\`user_id\`, \`cause_id\`, \`type\`, \`description\`, \`created_at\`)
        SELECT 
          FLOOR(1 + (RAND() * ?)) as user_id,
          c.id as cause_id,
          'cause_viewed' as type,
          CONCAT('Viewed cause: ', c.title) as description,
          DATE_ADD(c.created_at, INTERVAL FLOOR(RAND() * 30) DAY) as created_at
        FROM \`causes\` c
        CROSS JOIN (SELECT 1 UNION SELECT 2 UNION SELECT 3) AS multiple
        LIMIT 100
      `;
      await connection.execute(viewActivitiesSQL, [users[0].count]);
    }

    console.log("Migration completed successfully!");

    // Verify table was created
    const [rows] = await connection.execute('SHOW TABLES LIKE "activities"');
    if (rows.length > 0) {
      console.log("Activities table created successfully!");

      // Check table structure
      const [columns] = await connection.execute("DESCRIBE activities");
      console.log("Table structure:");
      columns.forEach((col) => {
        console.log(
          `  ${col.Field}: ${col.Type} ${col.Null === "NO" ? "NOT NULL" : "NULL"} ${col.Key ? `(${col.Key})` : ""}`,
        );
      });
    } else {
      console.log("Error: Activities table was not created");
    }
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await connection.end();
  }
}

runMigration();
