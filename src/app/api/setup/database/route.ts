import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Security check - only allow in development or with admin credentials
    const { adminKey } = await request.json();
    const isValidAdmin = adminKey === process.env.ADMIN_SETUP_KEY;
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment && !isValidAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. This endpoint is only available in development or with admin key.' },
        { status: 403 }
      );
    }

    const results: string[] = [];
    
    // Step 1: Drop existing tables
    results.push('[DELETE] Dropping existing tables...');
    
    const dropTables = [
      'training_details',
      'clothes_details', 
      'food_details',
      'comments',
      'cause_views',
      'cause_likes',
      'supporters',
      'causes',
      'categories',
      'users'
    ];

    for (const table of dropTables) {
      try {
        await Database.query(`DROP TABLE IF EXISTS \`${table}\``);
        results.push(`[SUCCESS] Dropped table: ${table}`);
      } catch (error) {
        results.push(`[WARNING] Failed to drop ${table}: ${error.message}`);
      }
    }

    // Step 2: Create tables
    results.push('[CREATE] Creating new tables...');
    
    // Create users table
    await Database.query(`
      CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) DEFAULT NULL,
        \`avatar\` varchar(500) DEFAULT NULL,
        \`bio\` text,
        \`phone\` varchar(20) DEFAULT NULL,
        \`location\` varchar(255) DEFAULT NULL,
        \`website\` varchar(255) DEFAULT NULL,
        \`social_links\` json DEFAULT NULL,
        \`email_verified\` tinyint(1) DEFAULT '0',
        \`is_active\` tinyint(1) DEFAULT '1',
        \`role\` enum('user','admin','moderator') DEFAULT 'user',
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`email\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push('[SUCCESS] Created users table');

    // Create categories table
    await Database.query(`
      CREATE TABLE \`categories\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(50) NOT NULL,
        \`display_name\` varchar(100) NOT NULL,
        \`description\` text,
        \`icon\` varchar(50) DEFAULT NULL,
        \`color\` varchar(7) DEFAULT '#007bff',
        \`is_active\` tinyint(1) DEFAULT '1',
        \`sort_order\` int DEFAULT '0',
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`name\` (\`name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push('[SUCCESS] Created categories table');

    // Create causes table
    await Database.query(`
      CREATE TABLE \`causes\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL,
        \`description\` text NOT NULL,
        \`short_description\` varchar(500) DEFAULT NULL,
        \`category_id\` int NOT NULL,
        \`user_id\` int NOT NULL,
        \`cause_type\` enum('wanted','offered') NOT NULL DEFAULT 'wanted',
        \`location\` varchar(255) NOT NULL,
        \`latitude\` decimal(10,8) DEFAULT NULL,
        \`longitude\` decimal(11,8) DEFAULT NULL,
        \`image\` varchar(500) DEFAULT NULL,
        \`gallery\` json DEFAULT NULL,
        \`priority\` enum('low','medium','high','urgent') DEFAULT 'medium',
        \`status\` enum('active','completed','cancelled','expired') DEFAULT 'active',
        \`contact_phone\` varchar(20) DEFAULT NULL,
        \`contact_email\` varchar(255) NOT NULL,
        \`contact_person\` varchar(255) DEFAULT NULL,
        \`availability_hours\` varchar(255) DEFAULT NULL,
        \`special_instructions\` text,
        \`tags\` json DEFAULT NULL,
        \`expires_at\` timestamp NULL DEFAULT NULL,
        \`view_count\` int DEFAULT '0',
        \`like_count\` int DEFAULT '0',
        \`comment_count\` int DEFAULT '0',
        \`is_featured\` tinyint(1) DEFAULT '0',
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_category_id\` (\`category_id\`),
        KEY \`idx_user_id\` (\`user_id\`),
        KEY \`idx_cause_type\` (\`cause_type\`),
        KEY \`idx_status\` (\`status\`),
        KEY \`idx_priority\` (\`priority\`),
        KEY \`idx_location\` (\`location\`),
        KEY \`idx_created_at\` (\`created_at\`),
        CONSTRAINT \`causes_ibfk_1\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`causes_ibfk_2\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push('[SUCCESS] Created causes table');

    // Create food_details table
    await Database.query(`
      CREATE TABLE \`food_details\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`cause_id\` int NOT NULL,
        \`food_type\` enum('meals','fresh-produce','packaged-goods','beverages','snacks','baby-food','other') DEFAULT 'meals',
        \`cuisine_type\` varchar(50) DEFAULT NULL,
        \`quantity\` int NOT NULL DEFAULT '1',
        \`unit\` enum('servings','plates','kilograms','pounds','packages','boxes','bags') DEFAULT 'servings',
        \`serving_size\` int DEFAULT NULL,
        \`dietary_restrictions\` json DEFAULT NULL,
        \`allergens\` json DEFAULT NULL,
        \`expiration_date\` date DEFAULT NULL,
        \`preparation_date\` date DEFAULT NULL,
        \`storage_requirements\` varchar(255) DEFAULT NULL,
        \`temperature_requirements\` enum('hot','room-temp','refrigerated','frozen') DEFAULT 'room-temp',
        \`pickup_instructions\` text,
        \`delivery_available\` tinyint(1) DEFAULT '0',
        \`delivery_radius\` int DEFAULT NULL,
        \`is_urgent\` tinyint(1) DEFAULT '0',
        \`ingredients\` text,
        \`nutritional_info\` json DEFAULT NULL,
        \`halal\` tinyint(1) DEFAULT '0',
        \`kosher\` tinyint(1) DEFAULT '0',
        \`vegan\` tinyint(1) DEFAULT '0',
        \`vegetarian\` tinyint(1) DEFAULT '0',
        \`organic\` tinyint(1) DEFAULT '0',
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`cause_id\` (\`cause_id\`),
        CONSTRAINT \`food_details_ibfk_1\` FOREIGN KEY (\`cause_id\`) REFERENCES \`causes\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push('[SUCCESS] Created food_details table');

    // Create clothes_details table
    await Database.query(`
      CREATE TABLE \`clothes_details\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`cause_id\` int NOT NULL,
        \`clothes_type\` enum('shirts','pants','dresses','jackets','shoes','underwear','accessories','uniforms','formal-wear','sportswear') DEFAULT 'shirts',
        \`gender\` enum('men','women','unisex','boys','girls') DEFAULT 'unisex',
        \`age_group\` enum('infant','toddler','child','teen','adult','senior') DEFAULT 'adult',
        \`size_range\` json NOT NULL,
        \`condition\` enum('new','like-new','good','fair','poor') DEFAULT 'good',
        \`season\` enum('spring','summer','fall','winter','all-season') DEFAULT 'all-season',
        \`quantity\` int NOT NULL DEFAULT '1',
        \`colors\` json DEFAULT NULL,
        \`brands\` json DEFAULT NULL,
        \`material_composition\` varchar(255) DEFAULT NULL,
        \`care_instructions\` text,
        \`special_requirements\` text,
        \`pickup_instructions\` text,
        \`delivery_available\` tinyint(1) DEFAULT '0',
        \`delivery_radius\` int DEFAULT NULL,
        \`is_urgent\` tinyint(1) DEFAULT '0',
        \`is_cleaned\` tinyint(1) DEFAULT '0',
        \`donation_receipt_available\` tinyint(1) DEFAULT '0',
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`cause_id\` (\`cause_id\`),
        CONSTRAINT \`clothes_details_ibfk_1\` FOREIGN KEY (\`cause_id\`) REFERENCES \`causes\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push('[SUCCESS] Created clothes_details table');

    // Create training_details table
    await Database.query(`
      CREATE TABLE \`training_details\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`cause_id\` int NOT NULL,
        \`training_type\` enum('workshop','course','mentoring','seminar','bootcamp','certification','skills','academic') DEFAULT 'course',
        \`skill_level\` enum('beginner','intermediate','advanced','expert','all-levels') DEFAULT 'all-levels',
        \`topics\` json NOT NULL,
        \`max_participants\` int NOT NULL DEFAULT '20',
        \`current_participants\` int DEFAULT '0',
        \`duration_hours\` decimal(5,2) NOT NULL DEFAULT '1.00',
        \`number_of_sessions\` int DEFAULT '1',
        \`prerequisites\` text,
        \`learning_objectives\` text,
        \`curriculum\` text,
        \`start_date\` date NOT NULL,
        \`end_date\` date NOT NULL,
        \`registration_deadline\` date DEFAULT NULL,
        \`schedule\` json NOT NULL,
        \`delivery_method\` enum('in-person','online','hybrid','self-paced') DEFAULT 'in-person',
        \`location_details\` varchar(255) DEFAULT NULL,
        \`meeting_platform\` enum('zoom','google-meet','microsoft-teams','skype','discord','custom','other') DEFAULT NULL,
        \`meeting_link\` varchar(500) DEFAULT NULL,
        \`instructor_name\` varchar(255) NOT NULL,
        \`instructor_email\` varchar(255) DEFAULT NULL,
        \`instructor_bio\` text,
        \`instructor_qualifications\` text,
        \`certification_provided\` tinyint(1) DEFAULT '0',
        \`certification_body\` varchar(255) DEFAULT NULL,
        \`materials_provided\` json DEFAULT NULL,
        \`materials_required\` json DEFAULT NULL,
        \`software_required\` json DEFAULT NULL,
        \`price\` decimal(10,2) DEFAULT '0.00',
        \`is_free\` tinyint(1) DEFAULT '1',
        \`course_language\` varchar(50) DEFAULT 'English',
        \`subtitles_available\` json DEFAULT NULL,
        \`difficulty_rating\` int DEFAULT '1',
        \`course_materials_url\` varchar(500) DEFAULT NULL,
        \`enrollment_status\` enum('open','closed','full','cancelled') DEFAULT 'open',
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`cause_id\` (\`cause_id\`),
        CONSTRAINT \`training_details_ibfk_1\` FOREIGN KEY (\`cause_id\`) REFERENCES \`causes\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push('[SUCCESS] Created training_details table');

    // Create supporting tables
    await Database.query(`
      CREATE TABLE \`supporters\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`cause_id\` int NOT NULL,
        \`user_id\` int NOT NULL,
        \`support_type\` enum('like','support','volunteer','donate') DEFAULT 'support',
        \`message\` text,
        \`amount\` decimal(10,2) DEFAULT NULL,
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`unique_support\` (\`cause_id\`,\`user_id\`,\`support_type\`),
        KEY \`idx_cause_id\` (\`cause_id\`),
        KEY \`idx_user_id\` (\`user_id\`),
        CONSTRAINT \`supporters_ibfk_1\` FOREIGN KEY (\`cause_id\`) REFERENCES \`causes\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`supporters_ibfk_2\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push('[SUCCESS] Created supporters table');

    await Database.query(`
      CREATE TABLE \`cause_views\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`cause_id\` int NOT NULL,
        \`user_id\` int DEFAULT NULL,
        \`ip_address\` varchar(45) DEFAULT NULL,
        \`user_agent\` text,
        \`viewed_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_cause_id\` (\`cause_id\`),
        KEY \`idx_user_id\` (\`user_id\`),
        CONSTRAINT \`cause_views_ibfk_1\` FOREIGN KEY (\`cause_id\`) REFERENCES \`causes\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`cause_views_ibfk_2\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push('[SUCCESS] Created cause_views table');

    await Database.query(`
      CREATE TABLE \`cause_likes\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`cause_id\` int NOT NULL,
        \`user_id\` int NOT NULL,
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`unique_like\` (\`cause_id\`,\`user_id\`),
        KEY \`idx_cause_id\` (\`cause_id\`),
        KEY \`idx_user_id\` (\`user_id\`),
        CONSTRAINT \`cause_likes_ibfk_1\` FOREIGN KEY (\`cause_id\`) REFERENCES \`causes\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`cause_likes_ibfk_2\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push('[SUCCESS] Created cause_likes table');

    await Database.query(`
      CREATE TABLE \`comments\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`cause_id\` int NOT NULL,
        \`user_id\` int NOT NULL,
        \`parent_id\` int DEFAULT NULL,
        \`content\` text NOT NULL,
        \`is_approved\` tinyint(1) DEFAULT '1',
        \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_cause_id\` (\`cause_id\`),
        KEY \`idx_user_id\` (\`user_id\`),
        KEY \`idx_parent_id\` (\`parent_id\`),
        CONSTRAINT \`comments_ibfk_1\` FOREIGN KEY (\`cause_id\`) REFERENCES \`causes\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`comments_ibfk_2\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`comments_ibfk_3\` FOREIGN KEY (\`parent_id\`) REFERENCES \`comments\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    results.push('[SUCCESS] Created comments table');

    // Step 3: Insert seed data
    results.push('[SEED] Seeding initial data...');

    // Insert categories
    await Database.query(`
      INSERT INTO \`categories\` (\`name\`, \`display_name\`, \`description\`, \`icon\`, \`color\`, \`sort_order\`) VALUES
      ('food', 'Food Support', 'Share meals and food supplies with those in need', 'food', '#ff6b35', 1),
      ('clothes', 'Clothing', 'Donate and request clothing items for all ages', 'clothes', '#4ecdc4', 2),
      ('training', 'Training', 'Share knowledge through courses and workshops', 'training', '#45b7d1', 3)
    `);
    results.push('[SUCCESS] Inserted categories');

    // Insert sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await Database.query(`
      INSERT INTO \`users\` (\`name\`, \`email\`, \`password\`, \`bio\`, \`location\`, \`role\`) VALUES
      ('Admin User', 'admin@hands2gether.com', ?, 'System administrator', 'New York, NY', 'admin'),
      ('John Doe', 'john@example.com', ?, 'Community volunteer passionate about helping others', 'San Francisco, CA', 'user'),
      ('Jane Smith', 'jane@example.com', ?, 'Food coordinator with 5 years experience', 'Los Angeles, CA', 'user'),
      ('Mike Johnson', 'mike@example.com', ?, 'Professional trainer and mentor', 'Chicago, IL', 'user'),
      ('Sarah Wilson', 'sarah@example.com', ?, 'Social worker focused on clothing donations', 'Miami, FL', 'user')
    `, [hashedPassword, hashedPassword, hashedPassword, hashedPassword, hashedPassword]);
    results.push('[SUCCESS] Inserted sample users');

    // Get user and category IDs for sample causes
    const users = await Database.query('SELECT id FROM users LIMIT 5');
    const categories = await Database.query('SELECT id, name FROM categories');
    
    // Validate we have the required data
    if (!users || users.length < 4) {
      throw new Error(`Not enough users created. Expected at least 4, got ${users?.length || 0}`);
    }
    
    if (!categories || categories.length < 3) {
      throw new Error(`Not enough categories created. Expected 3, got ${categories?.length || 0}`);
    }
    
    const foodCategory = categories.find(c => c.name === 'food');
    const clothesCategory = categories.find(c => c.name === 'clothes');
    const trainingCategory = categories.find(c => c.name === 'training');
    
    if (!foodCategory || !clothesCategory || !trainingCategory) {
      throw new Error('Missing required categories: food, clothes, or training');
    }
    
    const foodCategoryId = foodCategory.id;
    const clothesCategoryId = clothesCategory.id;
    const trainingCategoryId = trainingCategory.id;

    // Insert sample causes
    const sampleCauses = [
      {
        title: 'Fresh Vegetable Surplus from Local Farm',
        description: 'We have excess fresh vegetables including tomatoes, carrots, lettuce, and peppers from our organic farm. Perfect for families in need or community kitchens.',
        category_id: foodCategoryId,
        user_id: users[1].id,
        cause_type: 'offered',
        location: 'San Francisco Bay Area, CA',
        priority: 'medium',
        contact_email: 'john@example.com'
      },
      {
        title: 'Winter Coats Needed for Homeless Shelter',
        description: 'Our local homeless shelter urgently needs winter coats in all sizes. We serve 200+ individuals daily and are preparing for the winter season.',
        category_id: clothesCategoryId,
        user_id: users[2].id,
        cause_type: 'wanted',
        location: 'Los Angeles, CA',
        priority: 'urgent',
        contact_email: 'jane@example.com'
      },
      {
        title: 'Free Web Development Bootcamp',
        description: 'Offering a comprehensive 8-week web development course covering HTML, CSS, JavaScript, and React. Perfect for beginners looking to start their tech career.',
        category_id: trainingCategoryId,
        user_id: users[3].id,
        cause_type: 'offered',
        location: 'Chicago, IL (Online Available)',
        priority: 'medium',
        contact_email: 'mike@example.com'
      }
    ];

    for (const cause of sampleCauses) {
      const causeResult = await Database.query(`
        INSERT INTO \`causes\` (
          \`title\`, \`description\`, \`short_description\`, \`category_id\`, \`user_id\`, 
          \`cause_type\`, \`location\`, \`priority\`, \`contact_email\`, \`contact_person\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        cause.title,
        cause.description,
        cause.description.substring(0, 200) + '...',
        cause.category_id,
        cause.user_id,
        cause.cause_type,
        cause.location,
        cause.priority,
        cause.contact_email,
        'Contact Person'
      ]);

      // Extract insertId using the same pattern as UserService
      const causeId = (causeResult as any).insertId;
      
      if (!causeId) {
        console.error('Failed to get insertId from cause insertion. Full result:', causeResult);
        console.error('Result type:', typeof causeResult);
        console.error('Result keys:', causeResult ? Object.keys(causeResult) : 'null/undefined');
        throw new Error(`Failed to create cause - no insertId returned. Result: ${JSON.stringify(causeResult)}`);
      }

      // Insert category-specific details
      if (cause.category_id === foodCategoryId) {
        await Database.query(`
          INSERT INTO \`food_details\` (
            \`cause_id\`, \`food_type\`, \`quantity\`, \`unit\`, \`dietary_restrictions\`, 
            \`temperature_requirements\`, \`is_urgent\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          causeId, 'fresh-produce', 50, 'pounds', 
          JSON.stringify(['organic', 'fresh']), 'refrigerated', false
        ]);
      } else if (cause.category_id === clothesCategoryId) {
        await Database.query(`
          INSERT INTO \`clothes_details\` (
            \`cause_id\`, \`clothes_type\`, \`gender\`, \`age_group\`, \`size_range\`, 
            \`condition\`, \`season\`, \`quantity\`, \`is_urgent\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          causeId, 'jackets', 'unisex', 'adult', 
          JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']), 'good', 'winter', 100, true
        ]);
      } else if (cause.category_id === trainingCategoryId) {
        await Database.query(`
          INSERT INTO \`training_details\` (
            \`cause_id\`, \`training_type\`, \`skill_level\`, \`topics\`, \`max_participants\`,
            \`duration_hours\`, \`number_of_sessions\`, \`start_date\`, \`end_date\`,
            \`schedule\`, \`delivery_method\`, \`instructor_name\`, \`is_free\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          causeId, 'bootcamp', 'beginner', 
          JSON.stringify(['web-development', 'programming', 'javascript', 'react']),
          25, 320, 40, '2024-02-01', '2024-03-31',
          JSON.stringify([{day: 'Monday', time: '18:00-22:00'}, {day: 'Wednesday', time: '18:00-22:00'}]),
          'hybrid', 'Mike Johnson', true
        ]);
      }
    }
    results.push('[SUCCESS] Inserted sample causes with details');

    // Get final statistics
    const stats = await Database.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM categories) as categories,
        (SELECT COUNT(*) FROM causes) as causes,
        (SELECT COUNT(*) FROM food_details) as food_details,
        (SELECT COUNT(*) FROM clothes_details) as clothes_details,
        (SELECT COUNT(*) FROM training_details) as training_details
    `);
    
    results.push('');
    results.push('[COMPLETE] Database setup completed successfully!');
    results.push('');
    results.push('[STATS] Final Statistics:');
    results.push(`[INFO] Users: ${stats[0].users}`);
    results.push(`[INFO] Categories: ${stats[0].categories}`);
    results.push(`[INFO] Causes: ${stats[0].causes}`);
    results.push(`[INFO] Food Details: ${stats[0].food_details}`);
    results.push(`[INFO] Clothes Details: ${stats[0].clothes_details}`);
    results.push(`[INFO] Training Details: ${stats[0].training_details}`);
    results.push('');
    results.push('[CREDENTIALS] Sample Login Credentials:');
    results.push('[ADMIN] admin@hands2gether.com / password123');
    results.push('[USER] john@example.com / password123');

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      results,
      statistics: stats[0]
    });

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database setup failed', 
        details: error.message,
        results: [`[ERROR] ${error.message}`]
      },
      { status: 500 }
    );
  }
}