// Setup verification script
require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Required environment variables
const requiredEnvVars = [
  "PORT",
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_SECRET",
];

// Check if uploads directory exists
const checkUploadsDir = () => {
  const uploadsPath = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsPath)) {
    console.log("❌ Uploads directory not found, creating it...");
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log("✅ Uploads directory created successfully");
  } else {
    console.log("✅ Uploads directory exists");
  }
};

// Check environment variables
const checkEnvVars = () => {
  const missingVars = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    console.log(`❌ Missing environment variables: ${missingVars.join(", ")}`);
    console.log("Please add these variables to your .env file");
    return false;
  }

  console.log("✅ All required environment variables are present");
  return true;
};

// Check database connection and create database if it doesn't exist
const checkDatabase = async () => {
  try {
    // First try to connect without database name to create it if needed
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
    });

    // Check if database exists
    const [rows] = await connection.query(
      `SHOW DATABASES LIKE '${process.env.DB_NAME}'`
    );

    if (rows.length === 0) {
      console.log(
        `❌ Database '${process.env.DB_NAME}' not found, creating it...`
      );
      await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ Database '${process.env.DB_NAME}' created successfully`);
    } else {
      console.log(`✅ Database '${process.env.DB_NAME}' exists`);
    }

    await connection.end();
    return true;
  } catch (error) {
    console.log("❌ Database connection failed:");
    console.error(error.message);
    console.log("\nPlease check your database credentials in the .env file");
    return false;
  }
};

// Main function
const checkSetup = async () => {
  console.log("🔍 Checking Hands2gether setup...\n");

  // Check environment variables
  const envVarsOk = checkEnvVars();
  if (!envVarsOk) {
    console.log(
      "\n❌ Environment variables check failed. Please fix the issues and try again."
    );
    process.exit(1);
  }

  // Check uploads directory
  checkUploadsDir();

  // Check database
  const dbOk = await checkDatabase();
  if (!dbOk) {
    console.log(
      "\n❌ Database check failed. Please fix the issues and try again."
    );
    process.exit(1);
  }

  console.log(
    "\n✅ All checks passed! Your environment is ready to run Hands2gether."
  );
  console.log("\nNext steps:");
  console.log('  - Run "npm run seed" to populate the database with test data');
  console.log('  - Run "npm run dev" to start the development server');

  process.exit(0);
};

// Run the checks
checkSetup();
