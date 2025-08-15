-- Hands2gether Revamped Database Schema
-- Version: 4.0.0 - Complete Revamp
-- Created for: Revamped Hands2gether Community Platform
-- Database Design: WITHOUT FOREIGN KEYS (as per PRD requirement)
-- Features: Food, Clothes, Training causes with markdown support

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `hands2gether_revamped` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hands2gether_revamped`;

-- -----------------------------------------------------
-- Table: users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  `avatar` VARCHAR(255) NULL DEFAULT NULL,
  `bio` TEXT NULL DEFAULT NULL,
  `phone` VARCHAR(20) NULL DEFAULT NULL,
  `address` TEXT NULL DEFAULT NULL,
  `location` VARCHAR(255) NULL DEFAULT NULL,
  `is_admin` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `email_notifications` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_email_key` (`email` ASC),
  INDEX `idx_email` (`email` ASC),
  INDEX `idx_location` (`location` ASC),
  INDEX `idx_created_at` (`created_at` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: categories
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `display_name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `icon` VARCHAR(50) NULL DEFAULT NULL,
  `color` VARCHAR(7) NULL DEFAULT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `categories_name_key` (`name` ASC),
  INDEX `idx_active` (`is_active` ASC),
  INDEX `idx_sort_order` (`sort_order` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: causes
-- Core table for all cause types (Food, Clothes, Training)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `causes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` LONGTEXT NOT NULL COMMENT 'Main description with markdown support',
  `short_description` VARCHAR(500) NULL DEFAULT NULL,
  `category_id` INT NOT NULL COMMENT 'References categories.id (no FK constraint)',
  `user_id` INT NOT NULL COMMENT 'References users.id (no FK constraint)',
  `cause_type` ENUM('wanted', 'offered') NOT NULL COMMENT 'For Food and Clothes: wanted or offered',
  `location` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10,8) NULL DEFAULT NULL,
  `longitude` DECIMAL(11,8) NULL DEFAULT NULL,
  `image` VARCHAR(255) NULL DEFAULT NULL,
  `gallery` JSON NULL DEFAULT NULL COMMENT 'Array of image URLs',
  `status` ENUM('pending', 'active', 'completed', 'cancelled', 'expired') NOT NULL DEFAULT 'pending',
  `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  `is_featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `view_count` INT NOT NULL DEFAULT 0,
  `like_count` INT NOT NULL DEFAULT 0,
  `share_count` INT NOT NULL DEFAULT 0,
  `contact_phone` VARCHAR(20) NULL DEFAULT NULL,
  `contact_email` VARCHAR(100) NULL DEFAULT NULL,
  `contact_person` VARCHAR(100) NULL DEFAULT NULL,
  `availability_hours` VARCHAR(255) NULL DEFAULT NULL,
  `special_instructions` TEXT NULL DEFAULT NULL COMMENT 'With markdown support',
  `tags` JSON NULL DEFAULT NULL COMMENT 'Array of tags',
  `expires_at` DATETIME NULL DEFAULT NULL,
  `completed_at` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category_id` (`category_id` ASC),
  INDEX `idx_user_id` (`user_id` ASC),
  INDEX `idx_cause_type` (`cause_type` ASC),
  INDEX `idx_status` (`status` ASC),
  INDEX `idx_priority` (`priority` ASC),
  INDEX `idx_location` (`latitude` ASC, `longitude` ASC),
  INDEX `idx_featured` (`is_featured` ASC, `status` ASC),
  INDEX `idx_created_at` (`created_at` ASC),
  INDEX `idx_expires_at` (`expires_at` ASC),
  FULLTEXT INDEX `idx_search` (`title`, `description`, `short_description`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: food_details
-- Specific details for Food causes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `food_details` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cause_id` INT NOT NULL COMMENT 'References causes.id (no FK constraint)',
  `food_type` VARCHAR(100) NOT NULL COMMENT 'e.g., cooked meals, groceries, snacks',
  `cuisine_type` VARCHAR(100) NULL DEFAULT NULL,
  `quantity` INT NOT NULL,
  `unit` VARCHAR(20) NOT NULL DEFAULT 'servings' COMMENT 'servings, kg, liters, etc.',
  `serving_size` INT NULL DEFAULT NULL COMMENT 'Number of people it can feed',
  `dietary_restrictions` JSON NULL DEFAULT NULL COMMENT 'Array of restrictions',
  `allergens` JSON NULL DEFAULT NULL COMMENT 'Array of allergens',
  `expiration_date` DATE NULL DEFAULT NULL,
  `preparation_date` DATE NULL DEFAULT NULL,
  `storage_requirements` TEXT NULL DEFAULT NULL,
  `temperature_requirements` ENUM('frozen', 'refrigerated', 'room-temp', 'hot') NOT NULL DEFAULT 'room-temp',
  `pickup_instructions` TEXT NULL DEFAULT NULL COMMENT 'With markdown support',
  `delivery_available` BOOLEAN NOT NULL DEFAULT FALSE,
  `delivery_radius` INT NULL DEFAULT NULL COMMENT 'Radius in kilometers',
  `is_urgent` BOOLEAN NOT NULL DEFAULT FALSE,
  `ingredients` TEXT NULL DEFAULT NULL COMMENT 'With markdown support',
  `nutritional_info` JSON NULL DEFAULT NULL,
  `halal` BOOLEAN NOT NULL DEFAULT FALSE,
  `kosher` BOOLEAN NOT NULL DEFAULT FALSE,
  `vegan` BOOLEAN NOT NULL DEFAULT FALSE,
  `vegetarian` BOOLEAN NOT NULL DEFAULT FALSE,
  `organic` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `food_details_cause_id_key` (`cause_id` ASC),
  INDEX `idx_food_type` (`food_type` ASC),
  INDEX `idx_expiration_date` (`expiration_date` ASC),
  INDEX `idx_is_urgent` (`is_urgent` ASC),
  INDEX `idx_dietary` (`vegan` ASC, `vegetarian` ASC, `halal` ASC, `kosher` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: clothes_details
-- Specific details for Clothes causes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clothes_details` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cause_id` INT NOT NULL COMMENT 'References causes.id (no FK constraint)',
  `clothes_type` ENUM('shirts', 'pants', 'dresses', 'shoes', 'accessories', 'underwear', 'outerwear', 'sleepwear', 'workwear', 'formal', 'casual', 'sportswear', 'winter', 'summer') NOT NULL,
  `gender` ENUM('men', 'women', 'unisex', 'boys', 'girls') NOT NULL DEFAULT 'unisex',
  `age_group` ENUM('infant', 'toddler', 'child', 'teen', 'adult', 'senior') NOT NULL DEFAULT 'adult',
  `size_range` JSON NOT NULL COMMENT 'Array of sizes: XS, S, M, L, XL, XXL, or numeric sizes',
  `condition` ENUM('new', 'like-new', 'good', 'fair', 'poor') NOT NULL,
  `season` ENUM('spring', 'summer', 'fall', 'winter', 'all-season') NOT NULL DEFAULT 'all-season',
  `quantity` INT NOT NULL,
  `colors` JSON NULL DEFAULT NULL COMMENT 'Array of colors',
  `brands` JSON NULL DEFAULT NULL COMMENT 'Array of brand names',
  `material_composition` TEXT NULL DEFAULT NULL,
  `care_instructions` TEXT NULL DEFAULT NULL COMMENT 'With markdown support',
  `special_requirements` TEXT NULL DEFAULT NULL COMMENT 'With markdown support',
  `pickup_instructions` TEXT NULL DEFAULT NULL COMMENT 'With markdown support',
  `delivery_available` BOOLEAN NOT NULL DEFAULT FALSE,
  `delivery_radius` INT NULL DEFAULT NULL COMMENT 'Radius in kilometers',
  `is_urgent` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_cleaned` BOOLEAN NOT NULL DEFAULT FALSE,
  `donation_receipt_available` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `clothes_details_cause_id_key` (`cause_id` ASC),
  INDEX `idx_clothes_type` (`clothes_type` ASC),
  INDEX `idx_gender` (`gender` ASC),
  INDEX `idx_age_group` (`age_group` ASC),
  INDEX `idx_condition` (`condition` ASC),
  INDEX `idx_season` (`season` ASC),
  INDEX `idx_is_urgent` (`is_urgent` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: training_details
-- Specific details for Training/Education causes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `training_details` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cause_id` INT NOT NULL COMMENT 'References causes.id (no FK constraint)',
  `training_type` ENUM('workshop', 'course', 'mentoring', 'seminar', 'bootcamp', 'certification', 'skills', 'academic') NOT NULL,
  `skill_level` ENUM('beginner', 'intermediate', 'advanced', 'expert', 'all-levels') NOT NULL DEFAULT 'all-levels',
  `topics` JSON NOT NULL COMMENT 'Array of topics covered',
  `max_participants` INT NOT NULL,
  `current_participants` INT NOT NULL DEFAULT 0,
  `duration_hours` INT NOT NULL,
  `number_of_sessions` INT NOT NULL DEFAULT 1,
  `prerequisites` LONGTEXT NULL DEFAULT NULL COMMENT 'Prerequisites with markdown support',
  `learning_objectives` JSON NULL DEFAULT NULL COMMENT 'Array of learning objectives',
  `curriculum` LONGTEXT NULL DEFAULT NULL COMMENT 'Detailed curriculum with markdown support',
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `registration_deadline` DATE NULL DEFAULT NULL,
  `schedule` JSON NOT NULL COMMENT 'Array of session schedules',
  `delivery_method` ENUM('in-person', 'online', 'hybrid', 'self-paced') NOT NULL,
  `location_details` TEXT NULL DEFAULT NULL COMMENT 'Physical location details',
  `meeting_platform` VARCHAR(100) NULL DEFAULT NULL COMMENT 'Zoom, Teams, Meet, etc.',
  `meeting_link` VARCHAR(500) NULL DEFAULT NULL,
  `meeting_id` VARCHAR(100) NULL DEFAULT NULL,
  `meeting_password` VARCHAR(100) NULL DEFAULT NULL,
  `instructor_name` VARCHAR(100) NOT NULL,
  `instructor_email` VARCHAR(100) NULL DEFAULT NULL,
  `instructor_phone` VARCHAR(20) NULL DEFAULT NULL,
  `instructor_bio` LONGTEXT NULL DEFAULT NULL COMMENT 'Instructor bio with markdown support',
  `instructor_qualifications` LONGTEXT NULL DEFAULT NULL COMMENT 'Qualifications with markdown support',
  `certification_provided` BOOLEAN NOT NULL DEFAULT FALSE,
  `certification_body` VARCHAR(100) NULL DEFAULT NULL,
  `materials_provided` JSON NULL DEFAULT NULL COMMENT 'Array of provided materials',
  `materials_required` JSON NULL DEFAULT NULL COMMENT 'Array of required materials',
  `software_required` JSON NULL DEFAULT NULL COMMENT 'Array of required software',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `is_free` BOOLEAN NOT NULL DEFAULT TRUE,
  `course_language` VARCHAR(50) NOT NULL DEFAULT 'English',
  `subtitles_available` JSON NULL DEFAULT NULL COMMENT 'Array of available subtitle languages',
  `difficulty_rating` INT NOT NULL DEFAULT 1 COMMENT '1-5 scale',
  `course_materials_url` VARCHAR(500) NULL DEFAULT NULL COMMENT 'Link to course materials',
  `enrollment_status` ENUM('open', 'closed', 'waitlist', 'full') NOT NULL DEFAULT 'open',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `training_details_cause_id_key` (`cause_id` ASC),
  INDEX `idx_training_type` (`training_type` ASC),
  INDEX `idx_skill_level` (`skill_level` ASC),
  INDEX `idx_start_date` (`start_date` ASC),
  INDEX `idx_delivery_method` (`delivery_method` ASC),
  INDEX `idx_is_free` (`is_free` ASC),
  INDEX `idx_enrollment_status` (`enrollment_status` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: training_enrollments
-- Track user enrollments in training sessions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `training_enrollments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `training_id` INT NOT NULL COMMENT 'References training_details.id (no FK constraint)',
  `user_id` INT NOT NULL COMMENT 'References users.id (no FK constraint)',
  `status` ENUM('pending', 'approved', 'rejected', 'completed', 'dropped') NOT NULL DEFAULT 'pending',
  `enrollment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approval_date` DATETIME NULL DEFAULT NULL,
  `completion_date` DATETIME NULL DEFAULT NULL,
  `attendance_percentage` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `final_grade` VARCHAR(10) NULL DEFAULT NULL,
  `certificate_issued` BOOLEAN NOT NULL DEFAULT FALSE,
  `certificate_url` VARCHAR(500) NULL DEFAULT NULL,
  `feedback_rating` INT NULL DEFAULT NULL COMMENT '1-5 scale',
  `feedback_comment` TEXT NULL DEFAULT NULL COMMENT 'With markdown support',
  `notes` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `enrollments_training_user_key` (`training_id` ASC, `user_id` ASC),
  INDEX `idx_training_id` (`training_id` ASC),
  INDEX `idx_user_id` (`user_id` ASC),
  INDEX `idx_status` (`status` ASC),
  INDEX `idx_enrollment_date` (`enrollment_date` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: comments
-- Comments and feedback for causes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cause_id` INT NOT NULL COMMENT 'References causes.id (no FK constraint)',
  `user_id` INT NOT NULL COMMENT 'References users.id (no FK constraint)',
  `parent_id` INT NULL DEFAULT NULL COMMENT 'References comments.id for replies (no FK constraint)',
  `content` LONGTEXT NOT NULL COMMENT 'Comment content with markdown support',
  `rating` INT NULL DEFAULT NULL COMMENT '1-5 scale rating',
  `is_anonymous` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_approved` BOOLEAN NOT NULL DEFAULT TRUE,
  `like_count` INT NOT NULL DEFAULT 0,
  `reply_count` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_cause_id` (`cause_id` ASC),
  INDEX `idx_user_id` (`user_id` ASC),
  INDEX `idx_parent_id` (`parent_id` ASC),
  INDEX `idx_created_at` (`created_at` ASC),
  INDEX `idx_approved` (`is_approved` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: user_interactions
-- Track user interactions with causes (like, view, share)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_interactions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT 'References users.id (no FK constraint)',
  `cause_id` INT NOT NULL COMMENT 'References causes.id (no FK constraint)',
  `interaction_type` ENUM('view', 'like', 'share', 'contact', 'bookmark') NOT NULL,
  `metadata` JSON NULL DEFAULT NULL COMMENT 'Additional interaction data',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_cause` (`user_id` ASC, `cause_id` ASC),
  INDEX `idx_interaction_type` (`interaction_type` ASC),
  INDEX `idx_created_at` (`created_at` ASC),
  UNIQUE INDEX `unique_user_cause_interaction` (`user_id` ASC, `cause_id` ASC, `interaction_type` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: contact_submissions
-- Contact form submissions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_submissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` LONGTEXT NOT NULL COMMENT 'Message content with markdown support',
  `category` ENUM('general', 'support', 'partnership', 'feedback', 'bug_report', 'feature_request') NOT NULL DEFAULT 'general',
  `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  `status` ENUM('pending', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'pending',
  `admin_notes` LONGTEXT NULL DEFAULT NULL COMMENT 'Admin notes with markdown support',
  `responded_at` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email` ASC),
  INDEX `idx_status` (`status` ASC),
  INDEX `idx_category` (`category` ASC),
  INDEX `idx_priority` (`priority` ASC),
  INDEX `idx_created_at` (`created_at` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table: analytics_events
-- Track user analytics and events
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `analytics_events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL COMMENT 'References users.id (no FK constraint)',
  `cause_id` INT NULL DEFAULT NULL COMMENT 'References causes.id (no FK constraint)',
  `session_id` VARCHAR(100) NULL DEFAULT NULL,
  `event_type` VARCHAR(100) NOT NULL,
  `event_data` JSON NULL DEFAULT NULL,
  `page_url` VARCHAR(500) NULL DEFAULT NULL,
  `user_agent` TEXT NULL DEFAULT NULL,
  `ip_address` VARCHAR(45) NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id` ASC),
  INDEX `idx_cause_id` (`cause_id` ASC),
  INDEX `idx_event_type` (`event_type` ASC),
  INDEX `idx_session_id` (`session_id` ASC),
  INDEX `idx_created_at` (`created_at` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- NextAuth.js Tables (with minimal foreign keys for auth)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` INT NOT NULL COMMENT 'References users.id (minimal FK for auth)',
  `type` VARCHAR(191) NOT NULL,
  `provider` VARCHAR(191) NOT NULL,
  `provider_account_id` VARCHAR(191) NOT NULL,
  `refresh_token` TEXT NULL DEFAULT NULL,
  `access_token` TEXT NULL DEFAULT NULL,
  `expires_at` INT NULL DEFAULT NULL,
  `token_type` VARCHAR(191) NULL DEFAULT NULL,
  `scope` VARCHAR(191) NULL DEFAULT NULL,
  `id_token` TEXT NULL DEFAULT NULL,
  `session_state` VARCHAR(191) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `accounts_provider_provider_account_id_key` (`provider` ASC, `provider_account_id` ASC),
  INDEX `accounts_user_id_idx` (`user_id` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(191) NOT NULL,
  `session_token` VARCHAR(191) NOT NULL,
  `user_id` INT NOT NULL COMMENT 'References users.id (minimal FK for auth)',
  `expires` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `sessions_session_token_key` (`session_token` ASC),
  INDEX `sessions_user_id_idx` (`user_id` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `verificationtokens` (
  `identifier` VARCHAR(191) NOT NULL,
  `token` VARCHAR(191) NOT NULL,
  `expires` DATETIME NOT NULL,
  UNIQUE INDEX `verificationtokens_token_key` (`token` ASC),
  UNIQUE INDEX `verificationtokens_identifier_token_key` (`identifier` ASC, `token` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Insert Default Data
-- -----------------------------------------------------

-- Default Categories (Food, Clothes, Training)
INSERT INTO `categories` (`name`, `display_name`, `description`, `icon`, `color`, `sort_order`) VALUES
('food', 'Food Assistance', 'Share meals and food supplies with those in need', 'utensils', '#FF6B35', 1),
('clothes', 'Clothing', 'Donate and request clothing items for all ages', 'shirt', '#4ECDC4', 2),
('training', 'Training & Education', 'Share knowledge through courses, workshops, and mentoring', 'graduation-cap', '#45B7D1', 3);

-- Default Admin User
-- Password: Admin123! (hashed with bcrypt)
INSERT INTO `users` (`name`, `email`, `password`, `is_admin`, `is_verified`) VALUES
('System Administrator', 'admin@hands2gether.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBksusq9XdQ8B6', TRUE, TRUE);

-- -----------------------------------------------------
-- Performance Indexes
-- -----------------------------------------------------
CREATE INDEX IF NOT EXISTS `idx_causes_category_status` ON `causes` (`category_id` ASC, `status` ASC, `created_at` DESC);
CREATE INDEX IF NOT EXISTS `idx_causes_featured` ON `causes` (`is_featured` ASC, `status` ASC, `created_at` DESC);
CREATE INDEX IF NOT EXISTS `idx_causes_location_status` ON `causes` (`location` ASC, `status` ASC);
CREATE INDEX IF NOT EXISTS `idx_causes_priority_created` ON `causes` (`priority` ASC, `created_at` DESC);
CREATE INDEX IF NOT EXISTS `idx_causes_type_category` ON `causes` (`cause_type` ASC, `category_id` ASC);

-- Training specific indexes
CREATE INDEX IF NOT EXISTS `idx_training_dates` ON `training_details` (`start_date` ASC, `end_date` ASC);
CREATE INDEX IF NOT EXISTS `idx_training_enrollment` ON `training_details` (`enrollment_status` ASC, `current_participants` ASC);
CREATE INDEX IF NOT EXISTS `idx_enrollments_user_status` ON `training_enrollments` (`user_id` ASC, `status` ASC);

-- Food and Clothes indexes
CREATE INDEX IF NOT EXISTS `idx_food_urgent_expiry` ON `food_details` (`is_urgent` ASC, `expiration_date` ASC);
CREATE INDEX IF NOT EXISTS `idx_clothes_urgent_type` ON `clothes_details` (`is_urgent` ASC, `clothes_type` ASC);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS `idx_analytics_type_date` ON `analytics_events` (`event_type` ASC, `created_at` DESC);
CREATE INDEX IF NOT EXISTS `idx_interactions_user_date` ON `user_interactions` (`user_id` ASC, `created_at` DESC);

-- Comments indexes
CREATE INDEX IF NOT EXISTS `idx_comments_cause_approved` ON `comments` (`cause_id` ASC, `is_approved` ASC, `created_at` DESC);

-- -----------------------------------------------------
-- Useful Views for Common Queries
-- -----------------------------------------------------

-- Active causes with category information
CREATE VIEW `active_causes_view` AS
SELECT 
  c.id,
  c.title,
  c.description,
  c.short_description,
  c.cause_type,
  c.location,
  c.image,
  c.status,
  c.priority,
  c.view_count,
  c.like_count,
  c.is_featured,
  c.created_at,
  c.expires_at,
  u.name as creator_name,
  u.avatar as creator_avatar,
  cat.name as category_name,
  cat.display_name as category_display_name,
  cat.color as category_color,
  cat.icon as category_icon
FROM `causes` c
JOIN `users` u ON c.user_id = u.id
JOIN `categories` cat ON c.category_id = cat.id
WHERE c.status = 'active'
ORDER BY c.is_featured DESC, c.created_at DESC;

-- User dashboard stats
CREATE VIEW `user_dashboard_view` AS
SELECT 
  u.id,
  u.name,
  u.email,
  u.avatar,
  COUNT(DISTINCT c.id) as total_causes,
  COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_causes,
  COUNT(DISTINCT CASE WHEN c.status = 'completed' THEN c.id END) as completed_causes,
  COUNT(DISTINCT te.id) as total_enrollments,
  COUNT(DISTINCT CASE WHEN te.status = 'completed' THEN te.id END) as completed_trainings
FROM `users` u
LEFT JOIN `causes` c ON u.id = c.user_id
LEFT JOIN `training_enrollments` te ON u.id = te.user_id
GROUP BY u.id, u.name, u.email, u.avatar;

-- Training sessions with enrollment info
CREATE VIEW `training_sessions_view` AS
SELECT 
  c.id as cause_id,
  c.title,
  c.description,
  c.location,
  c.status as cause_status,
  c.is_featured,
  c.created_at,
  td.training_type,
  td.skill_level,
  td.max_participants,
  td.current_participants,
  td.start_date,
  td.end_date,
  td.delivery_method,
  td.instructor_name,
  td.price,
  td.is_free,
  td.enrollment_status,
  u.name as creator_name,
  u.avatar as creator_avatar,
  cat.display_name as category_name,
  cat.color as category_color
FROM `causes` c
JOIN `training_details` td ON c.id = td.cause_id
JOIN `users` u ON c.user_id = u.id
JOIN `categories` cat ON c.category_id = cat.id
WHERE c.status = 'active';

-- -----------------------------------------------------
-- Utility Procedures
-- -----------------------------------------------------
DELIMITER //

-- Update cause view count
CREATE PROCEDURE `UpdateCauseViewCount`(IN cause_id INT)
BEGIN
  UPDATE `causes` SET `view_count` = `view_count` + 1 WHERE `id` = cause_id;
END //

-- Update cause like count
CREATE PROCEDURE `UpdateCauseLikeCount`(IN cause_id INT, IN increment INT)
BEGIN
  UPDATE `causes` SET `like_count` = `like_count` + increment WHERE `id` = cause_id;
END //

-- Update training enrollment count
CREATE PROCEDURE `UpdateTrainingParticipantCount`(IN training_id INT)
BEGIN
  UPDATE `training_details` 
  SET 
    `current_participants` = (
      SELECT COUNT(*) 
      FROM `training_enrollments` 
      WHERE `training_id` = training_id AND `status` IN ('approved', 'completed')
    ),
    `enrollment_status` = CASE
      WHEN `current_participants` >= `max_participants` THEN 'full'
      WHEN `current_participants` = `max_participants` - 1 THEN 'waitlist'
      ELSE 'open'
    END
  WHERE `id` = training_id;
END //

DELIMITER ;

-- -----------------------------------------------------
-- Reset SQL Settings
-- -----------------------------------------------------
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

SELECT 'Hands2gether Revamped Database Schema Created Successfully!' as status,
       'Schema Version: 4.0.0' as version,
       'Features: Food, Clothes, Training with Markdown Support' as features,
       'Constraints: NO FOREIGN KEYS (as per PRD)' as constraints;