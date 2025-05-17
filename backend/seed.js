// Seed script for initializing database with test data
require("dotenv").config();
const { seedAll } = require("./utils/seedData");

async function runSeed() {
  try {
    console.log("Starting database seeding...");
    await seedAll();
    console.log("Database seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

runSeed();
