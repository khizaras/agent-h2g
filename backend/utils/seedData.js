// This file contains functions to seed the database with initial data
const bcrypt = require("bcrypt");
const { pool } = require("../config/db");
const { seedActivities } = require("./seedActivities");

// Seed Users
const seedUsers = async () => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [
      {
        name: "Admin User",
        email: "admin@hands2gether.com",
        password: hashedPassword,
        is_admin: true,
        bio: "System Administrator",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        bio: "Regular user who loves to help communities",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        bio: "Food bank volunteer and community organizer",
      },
    ];

    console.log("Seeding users...");

    for (const user of users) {
      await pool.query(
        "INSERT INTO users (name, email, password, is_admin, bio) VALUES (?, ?, ?, ?, ?)",
        [user.name, user.email, user.password, user.is_admin || false, user.bio]
      );
    }

    console.log("Users seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding users:", error);
    return false;
  }
};

// Seed Causes
const seedCauses = async () => {
  try {
    const causes = [
      {
        title: "Emergency Food Relief for Downtown Shelter",
        description:
          "The downtown shelter is in urgent need of food supplies to serve the increasing number of homeless individuals. Your contributions will help provide hot meals and essential food packages for those in need.",
        location: "Downtown Area",
        category: "emergency",
        funding_goal: 5000.0,
        food_goal: 200,
        user_id: 2, // John Doe
      },
      {
        title: "Weekly Community Kitchen Program",
        description:
          "Our community kitchen provides free meals every weekend. We need support to continue this service and expand it to reach more people in the neighborhood.",
        location: "Westside Community Center",
        category: "recurring",
        funding_goal: 2500.0,
        food_goal: 100,
        user_id: 3, // Jane Smith
      },
      {
        title: "School Lunch Support for Low-Income Families",
        description:
          "Many children from low-income families in our district go without proper lunches. This cause aims to provide nutritious meal packages for these children during the school week.",
        location: "Eastside School District",
        category: "local",
        funding_goal: 3000.0,
        food_goal: 150,
        user_id: 2, // John Doe
      },
    ];

    console.log("Seeding causes...");

    for (const cause of causes) {
      await pool.query(
        "INSERT INTO causes (title, description, location, category, funding_goal, food_goal, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          cause.title,
          cause.description,
          cause.location,
          cause.category,
          cause.funding_goal,
          cause.food_goal,
          cause.user_id,
        ]
      );
    }

    console.log("Causes seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding causes:", error);
    return false;
  }
};

// Seed Contributions
const seedContributions = async () => {
  try {
    const contributions = [
      {
        amount: 250.0,
        food_quantity: 0,
        cause_id: 1,
        user_id: 3,
        message: "Happy to support this important cause!",
        anonymous: false,
      },
      {
        amount: 100.0,
        food_quantity: 20,
        cause_id: 2,
        user_id: 2,
        message: "Keep up the great work with the community kitchen!",
        anonymous: false,
      },
      {
        amount: 0,
        food_quantity: 30,
        cause_id: 3,
        user_id: 3,
        message: "Donating some food items for the school lunch program",
        anonymous: false,
      },
      {
        amount: 500.0,
        food_quantity: 0,
        cause_id: 1,
        user_id: null,
        message: "Anonymous donation to help those in need",
        anonymous: true,
      },
    ];

    console.log("Seeding contributions...");

    for (const contribution of contributions) {
      await pool.query(
        "INSERT INTO contributions (amount, food_quantity, cause_id, user_id, message, anonymous) VALUES (?, ?, ?, ?, ?, ?)",
        [
          contribution.amount,
          contribution.food_quantity,
          contribution.cause_id,
          contribution.user_id,
          contribution.message,
          contribution.anonymous,
        ]
      );

      // Update cause funding and food items
      if (contribution.amount > 0) {
        await pool.query(
          "UPDATE causes SET current_funding = current_funding + ? WHERE id = ?",
          [contribution.amount, contribution.cause_id]
        );
      }

      if (contribution.food_quantity > 0) {
        await pool.query(
          "UPDATE causes SET current_food = current_food + ? WHERE id = ?",
          [contribution.food_quantity, contribution.cause_id]
        );
      }
    }

    console.log("Contributions seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding contributions:", error);
    return false;
  }
};

// Seed Feedback
const seedFeedback = async () => {
  try {
    const feedback = [
      {
        rating: 5,
        comment: "This cause is making a real difference in our community!",
        cause_id: 1,
        user_id: 2,
      },
      {
        rating: 4,
        comment: "Good initiative, but could use more organization",
        cause_id: 2,
        user_id: 3,
      },
      {
        rating: 5,
        comment: "The school lunch program is amazing and well-managed",
        cause_id: 3,
        user_id: 3,
      },
    ];

    console.log("Seeding feedback...");

    for (const item of feedback) {
      await pool.query(
        "INSERT INTO feedback (rating, comment, cause_id, user_id) VALUES (?, ?, ?, ?)",
        [item.rating, item.comment, item.cause_id, item.user_id]
      );
    }

    console.log("Feedback seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding feedback:", error);
    return false;
  }
};

// Seed Notifications
const seedNotifications = async () => {
  try {
    const notifications = [
      {
        title: "New Contribution Received",
        message:
          'Your cause "Emergency Food Relief for Downtown Shelter" received a new contribution of $250.00',
        type: "contribution",
        cause_id: 1,
        user_id: 2,
      },
      {
        title: "New Feedback on Your Cause",
        message:
          'Someone left a 5-star rating on your cause "Emergency Food Relief for Downtown Shelter"',
        type: "feedback",
        cause_id: 1,
        user_id: 2,
      },
      {
        title: "Welcome to Hands2gether",
        message:
          "Thank you for joining our platform. Start by exploring causes or creating your own to help those in need.",
        type: "system",
        cause_id: null,
        user_id: 3,
      },
    ];

    console.log("Seeding notifications...");

    for (const notification of notifications) {
      await pool.query(
        "INSERT INTO notifications (title, message, type, cause_id, user_id) VALUES (?, ?, ?, ?, ?)",
        [
          notification.title,
          notification.message,
          notification.type,
          notification.cause_id,
          notification.user_id,
        ]
      );
    }

    console.log("Notifications seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding notifications:", error);
    return false;
  }
};

// Seed Followed Causes
const seedFollowedCauses = async () => {
  try {
    const followedCauses = [
      {
        user_id: 2,
        cause_id: 2,
      },
      {
        user_id: 3,
        cause_id: 1,
      },
      {
        user_id: 3,
        cause_id: 3,
      },
    ];

    console.log("Seeding followed causes...");

    for (const followedCause of followedCauses) {
      await pool.query(
        "INSERT INTO followed_causes (user_id, cause_id) VALUES (?, ?)",
        [followedCause.user_id, followedCause.cause_id]
      );
    }

    console.log("Followed causes seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding followed causes:", error);
    return false;
  }
};

// Run all seed functions
const seedAll = async () => {
  try {
    // Get connection
    const connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    try {
      // Run seeders in order
      await seedUsers();
      await seedCauses();
      await seedContributions();
      await seedFeedback();
      await seedNotifications();
      await seedFollowedCauses();

      // Commit if all succeeded
      await connection.commit();
      console.log("All data seeded successfully!");
    } catch (error) {
      // Rollback if any failed
      await connection.rollback();
      console.error("Error seeding data. Transaction rolled back:", error);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error in seed process:", error);
  }
};

// Export the seeders
module.exports = {
  seedUsers,
  seedCauses,
  seedContributions,
  seedFeedback,
  seedNotifications,
  seedFollowedCauses,
  seedAll,
};
