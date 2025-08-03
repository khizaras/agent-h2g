-- Hands2gether MySQL Database Schema
-- Version: 3.0.0
-- Created for Next.js 15 with Direct MySQL (No ORM)
-- Updated: August 2025
-- Includes all missing features: notifications, newsletter, contact, search, interactions, analytics, chat

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `hands2gether_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hands2gether_db`;

-- -----------------------------------------------------
-- Table `users`
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
  `is_admin` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `email_notifications` BOOLEAN NOT NULL DEFAULT TRUE,
  `push_notifications` BOOLEAN NOT NULL DEFAULT TRUE,
  `two_factor_enabled` BOOLEAN NOT NULL DEFAULT FALSE,
  `two_factor_secret` VARCHAR(255) NULL DEFAULT NULL,
  `email_verify_token` VARCHAR(255) NULL DEFAULT NULL,
  `password_reset_token` VARCHAR(255) NULL DEFAULT NULL,
  `password_reset_expires` DATETIME NULL DEFAULT NULL,
  `last_login` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_email_key` (`email` ASC),
  INDEX `idx_email` (`email` ASC),
  INDEX `idx_created_at` (`created_at` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `accounts` (NextAuth.js)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` INT NOT NULL,
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
  INDEX `accounts_user_id_fkey` (`user_id` ASC),
  CONSTRAINT `accounts_user_id_fkey`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `sessions` (NextAuth.js)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(191) NOT NULL,
  `session_token` VARCHAR(191) NOT NULL,
  `user_id` INT NOT NULL,
  `expires` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `sessions_session_token_key` (`session_token` ASC),
  INDEX `sessions_user_id_fkey` (`user_id` ASC),
  CONSTRAINT `sessions_user_id_fkey`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `verificationtokens` (NextAuth.js)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `verificationtokens` (
  `identifier` VARCHAR(191) NOT NULL,
  `token` VARCHAR(191) NOT NULL,
  `expires` DATETIME NOT NULL,
  UNIQUE INDEX `verificationtokens_token_key` (`token` ASC),
  UNIQUE INDEX `verificationtokens_identifier_token_key` (`identifier` ASC, `token` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `categories`
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
  UNIQUE INDEX `categories_name_key` (`name` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `causes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `causes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `short_description` VARCHAR(500) NULL DEFAULT NULL,
  `category_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10,8) NULL DEFAULT NULL,
  `longitude` DECIMAL(11,8) NULL DEFAULT NULL,
  `image` VARCHAR(255) NULL DEFAULT NULL,
  `gallery` JSON NULL DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `priority` VARCHAR(20) NOT NULL DEFAULT 'medium',
  `is_featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `view_count` INT NOT NULL DEFAULT 0,
  `like_count` INT NOT NULL DEFAULT 0,
  `share_count` INT NOT NULL DEFAULT 0,
  `tags` JSON NULL DEFAULT NULL,
  `contact_phone` VARCHAR(20) NULL DEFAULT NULL,
  `contact_email` VARCHAR(100) NULL DEFAULT NULL,
  `contact_person` VARCHAR(100) NULL DEFAULT NULL,
  `availability_hours` VARCHAR(255) NULL DEFAULT NULL,
  `special_instructions` TEXT NULL DEFAULT NULL,
  `goal_amount` DECIMAL(10,2) NULL DEFAULT NULL,
  `raised_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `supporter_count` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `expires_at` DATETIME NULL DEFAULT NULL,
  `completed_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_category_id` (`category_id` ASC),
  INDEX `idx_user_id` (`user_id` ASC),
  INDEX `idx_status` (`status` ASC),
  INDEX `idx_location` (`latitude` ASC, `longitude` ASC),
  INDEX `idx_created_at` (`created_at` ASC),
  FULLTEXT INDEX `idx_search` (`title`, `description`),
  CONSTRAINT `causes_category_id_fkey`
    FOREIGN KEY (`category_id`)
    REFERENCES `categories` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `causes_user_id_fkey`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `cause_supporters`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cause_supporters` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cause_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `message` TEXT NULL DEFAULT NULL,
  `anonymous` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_cause_id` (`cause_id` ASC),
  INDEX `idx_user_id` (`user_id` ASC),
  INDEX `idx_created_at` (`created_at` ASC),
  INDEX `idx_amount` (`amount` ASC),
  CONSTRAINT `cause_supporters_cause_id_fkey`
    FOREIGN KEY (`cause_id`)
    REFERENCES `causes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `cause_supporters_user_id_fkey`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `food_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `food_details` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cause_id` INT NOT NULL,
  `food_type` VARCHAR(50) NOT NULL,
  `cuisine_type` VARCHAR(100) NULL DEFAULT NULL,
  `quantity` INT NOT NULL,
  `unit` VARCHAR(20) NOT NULL DEFAULT 'servings',
  `serving_size` INT NULL DEFAULT NULL,
  `dietary_restrictions` JSON NULL DEFAULT NULL,
  `allergens` JSON NULL DEFAULT NULL,
  `expiration_date` DATE NULL DEFAULT NULL,
  `preparation_date` DATE NULL DEFAULT NULL,
  `storage_requirements` TEXT NULL DEFAULT NULL,
  `temperature_requirements` VARCHAR(20) NOT NULL DEFAULT 'room-temp',
  `pickup_instructions` TEXT NULL DEFAULT NULL,
  `delivery_available` BOOLEAN NOT NULL DEFAULT FALSE,
  `delivery_radius` INT NULL DEFAULT NULL,
  `is_urgent` BOOLEAN NOT NULL DEFAULT FALSE,
  `ingredients` TEXT NULL DEFAULT NULL COMMENT 'Markdown formatted main ingredients list',
  `nutritional_info` TEXT NULL DEFAULT NULL COMMENT 'Markdown formatted nutritional information',
  `packaging_details` TEXT NULL DEFAULT NULL,
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
  INDEX `idx_dietary_restrictions` (`halal`, `kosher`, `vegan`, `vegetarian`),
  CONSTRAINT `food_details_cause_id_fkey`
    FOREIGN KEY (`cause_id`)
    REFERENCES `causes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `clothes_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clothes_details` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cause_id` INT NOT NULL,
  `clothes_type` VARCHAR(50) NOT NULL,
  `gender` VARCHAR(20) NOT NULL DEFAULT 'unisex',
  `age_group` VARCHAR(20) NOT NULL DEFAULT 'adult',
  `size_range` JSON NOT NULL,
  `condition` VARCHAR(20) NOT NULL,
  `season` VARCHAR(20) NOT NULL DEFAULT 'all-season',
  `quantity` INT NOT NULL,
  `colors` JSON NULL DEFAULT NULL,
  `brands` JSON NULL DEFAULT NULL,
  `material_composition` TEXT NULL DEFAULT NULL,
  `care_instructions` TEXT NULL DEFAULT NULL COMMENT 'Markdown formatted care instructions',
  `special_requirements` TEXT NULL DEFAULT NULL COMMENT 'Markdown formatted special requirements',
  `pickup_instructions` TEXT NULL DEFAULT NULL COMMENT 'Markdown formatted pickup instructions',
  `delivery_available` BOOLEAN NOT NULL DEFAULT FALSE,
  `delivery_radius` INT NULL DEFAULT NULL,
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
  INDEX `idx_is_urgent` (`is_urgent` ASC),
  INDEX `idx_season` (`season` ASC),
  CONSTRAINT `clothes_details_cause_id_fkey`
    FOREIGN KEY (`cause_id`)
    REFERENCES `causes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `training_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `training_details` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cause_id` INT NOT NULL,
  `training_type` VARCHAR(50) NOT NULL DEFAULT 'course',
  `skill_level` VARCHAR(20) NOT NULL DEFAULT 'all-levels',
  `topics` JSON NOT NULL,
  `max_participants` INT NOT NULL DEFAULT 20,
  `current_participants` INT NOT NULL DEFAULT 0,
  `duration_hours` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  `number_of_sessions` INT NOT NULL DEFAULT 1,
  `prerequisites` TEXT NULL DEFAULT NULL COMMENT 'Markdown formatted prerequisites',
  `learning_objectives` TEXT NULL DEFAULT NULL COMMENT 'Markdown formatted learning objectives',
  `curriculum` TEXT NULL DEFAULT NULL COMMENT 'Markdown formatted curriculum/syllabus',
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `registration_deadline` DATE NULL DEFAULT NULL,
  `schedule` JSON NULL DEFAULT NULL COMMENT 'Schedule details and timing information',
  `delivery_method` VARCHAR(20) NOT NULL DEFAULT 'in-person',
  `location_details` TEXT NULL DEFAULT NULL,
  `meeting_platform` VARCHAR(100) NULL DEFAULT NULL,
  `meeting_link` VARCHAR(500) NULL DEFAULT NULL,
  `meeting_id` VARCHAR(100) NULL DEFAULT NULL,
  `meeting_password` VARCHAR(100) NULL DEFAULT NULL,
  `instructor_name` VARCHAR(100) NOT NULL,
  `instructor_email` VARCHAR(100) NULL DEFAULT NULL,
  `instructor_phone` VARCHAR(20) NULL DEFAULT NULL,
  `instructor_bio` TEXT NULL DEFAULT NULL,
  `instructor_qualifications` TEXT NULL DEFAULT NULL,
  `instructor_rating` DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  `certification_provided` BOOLEAN NOT NULL DEFAULT FALSE,
  `certification_body` VARCHAR(100) NULL DEFAULT NULL,
  `materials_provided` JSON NULL DEFAULT NULL,
  `materials_required` JSON NULL DEFAULT NULL,
  `software_required` JSON NULL DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `is_free` BOOLEAN NOT NULL DEFAULT TRUE,
  `course_language` VARCHAR(50) NOT NULL DEFAULT 'english',
  `subtitles_available` JSON NULL DEFAULT NULL,
  `difficulty_rating` INT NOT NULL DEFAULT 1,
  `course_materials_url` VARCHAR(500) NULL DEFAULT NULL,
  `enrollment_status` VARCHAR(20) NOT NULL DEFAULT 'open',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `training_details_cause_id_key` (`cause_id` ASC),
  INDEX `idx_training_type` (`training_type` ASC),
  INDEX `idx_skill_level` (`skill_level` ASC),
  INDEX `idx_start_date` (`start_date` ASC),
  INDEX `idx_delivery_method` (`delivery_method` ASC),
  INDEX `idx_is_free` (`is_free` ASC),
  INDEX `idx_enrollment_status` (`enrollment_status` ASC),
  CONSTRAINT `training_details_cause_id_fkey`
    FOREIGN KEY (`cause_id`)
    REFERENCES `causes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Enhanced training course details with markdown support for prerequisites, curriculum, and multiple instructors';

-- -----------------------------------------------------
-- Table `registrations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `registrations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `education_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `registration_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approval_date` DATETIME NULL DEFAULT NULL,
  `completion_date` DATETIME NULL DEFAULT NULL,
  `attendance_percentage` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `final_grade` VARCHAR(10) NULL DEFAULT NULL,
  `certificate_issued` BOOLEAN NOT NULL DEFAULT FALSE,
  `certificate_url` VARCHAR(500) NULL DEFAULT NULL,
  `feedback_rating` INT NULL DEFAULT NULL,
  `feedback_comment` TEXT NULL DEFAULT NULL,
  `notes` TEXT NULL DEFAULT NULL,
  `reminder_sent` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `registrations_education_id_user_id_key` (`education_id` ASC, `user_id` ASC),
  INDEX `idx_status` (`status` ASC),
  INDEX `idx_registration_date` (`registration_date` ASC),
  INDEX `registrations_user_id_fkey` (`user_id` ASC),
  CONSTRAINT `registrations_education_id_fkey`
    FOREIGN KEY (`education_id`)
    REFERENCES `education_details` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `registrations_user_id_fkey`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `activities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `activities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `cause_id` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `quantity` INT NULL DEFAULT NULL,
  `unit` VARCHAR(20) NULL DEFAULT NULL,
  `value` DECIMAL(10,2) NULL DEFAULT NULL,
  `metadata` JSON NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id` ASC),
  INDEX `idx_cause_id` (`cause_id` ASC),
  INDEX `idx_type` (`type` ASC),
  INDEX `idx_created_at` (`created_at` ASC),
  CONSTRAINT `activities_user_id_fkey`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `activities_cause_id_fkey`
    FOREIGN KEY (`cause_id`)
    REFERENCES `causes` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cause_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `parent_id` INT NULL DEFAULT NULL,
  `comment_type` VARCHAR(20) NOT NULL DEFAULT 'feedback',
  `content` TEXT NOT NULL,
  `rating` INT NULL DEFAULT NULL,
  `is_anonymous` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_approved` BOOLEAN NOT NULL DEFAULT TRUE,
  `is_pinned` BOOLEAN NOT NULL DEFAULT FALSE,
  `like_count` INT NOT NULL DEFAULT 0,
  `reply_count` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_cause_id` (`cause_id` ASC),
  INDEX `idx_user_id` (`user_id` ASC),
  INDEX `idx_parent_id` (`parent_id` ASC),
  INDEX `idx_created_at` (`created_at` ASC),
  CONSTRAINT `comments_cause_id_fkey`
    FOREIGN KEY (`cause_id`)
    REFERENCES `causes` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `comments_user_id_fkey`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `comments_parent_id_fkey`
    FOREIGN KEY (`parent_id`)
    REFERENCES `comments` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `related_cause_id` INT NULL DEFAULT NULL,
  `related_user_id` INT NULL DEFAULT NULL,
  `action_url` VARCHAR(500) NULL DEFAULT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_sent` BOOLEAN NOT NULL DEFAULT FALSE,
  `send_email` BOOLEAN NOT NULL DEFAULT TRUE,
  `send_push` BOOLEAN NOT NULL DEFAULT TRUE,
  `scheduled_at` DATETIME NULL DEFAULT NULL,
  `sent_at` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id` ASC),
  INDEX `idx_type` (`type` ASC),
  INDEX `idx_is_read` (`is_read` ASC),
  INDEX `idx_scheduled_at` (`scheduled_at` ASC),
  INDEX `notifications_related_cause_id_fkey` (`related_cause_id` ASC),
  CONSTRAINT `notifications_user_id_fkey`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `notifications_related_cause_id_fkey`
    FOREIGN KEY (`related_cause_id`)
    REFERENCES `causes` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `user_interactions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_interactions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `cause_id` INT NOT NULL,
  `interaction_type` VARCHAR(20) NOT NULL,
  `metadata` JSON NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_cause` (`user_id` ASC, `cause_id` ASC),
  INDEX `idx_interaction_type` (`interaction_type` ASC),
  INDEX `idx_created_at` (`created_at` ASC),
  INDEX `user_interactions_cause_id_fkey` (`cause_id` ASC),
  CONSTRAINT `user_interactions_user_id_fkey`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `user_interactions_cause_id_fkey`
    FOREIGN KEY (`cause_id`)
    REFERENCES `causes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `media`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `media` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `related_type` VARCHAR(20) NOT NULL,
  `related_id` INT NOT NULL,
  `file_type` VARCHAR(20) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_url` VARCHAR(500) NOT NULL,
  `file_size` INT NULL DEFAULT NULL,
  `mime_type` VARCHAR(100) NULL DEFAULT NULL,
  `alt_text` VARCHAR(255) NULL DEFAULT NULL,
  `caption` TEXT NULL DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_primary` BOOLEAN NOT NULL DEFAULT FALSE,
  `uploaded_by` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_related` (`related_type` ASC, `related_id` ASC),
  INDEX `idx_file_type` (`file_type` ASC),
  INDEX `idx_uploaded_by` (`uploaded_by` ASC),
  CONSTRAINT `media_uploaded_by_fkey`
    FOREIGN KEY (`uploaded_by`)
    REFERENCES `users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `analytics_events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `analytics_events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `cause_id` INT NULL DEFAULT NULL,
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
  INDEX `idx_created_at` (`created_at` ASC),
  CONSTRAINT `analytics_events_user_id_fkey`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `analytics_events_cause_id_fkey`
    FOREIGN KEY (`cause_id`)
    REFERENCES `causes` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `chat_conversations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_conversations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `participant1_id` INT NOT NULL,
  `participant2_id` INT NOT NULL,
  `cause_id` INT NULL DEFAULT NULL,
  `last_message` TEXT NULL DEFAULT NULL,
  `last_message_at` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_participant1` (`participant1_id` ASC),
  INDEX `idx_participant2` (`participant2_id` ASC),
  INDEX `idx_cause_id` (`cause_id` ASC),
  INDEX `idx_last_message_at` (`last_message_at` ASC),
  UNIQUE INDEX `unique_conversation` (`participant1_id` ASC, `participant2_id` ASC, `cause_id` ASC),
  CONSTRAINT `chat_conversations_participant1_fkey`
    FOREIGN KEY (`participant1_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `chat_conversations_participant2_fkey`
    FOREIGN KEY (`participant2_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `chat_conversations_cause_fkey`
    FOREIGN KEY (`cause_id`)
    REFERENCES `causes` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Insert Default Categories
-- -----------------------------------------------------
INSERT INTO `categories` (`name`, `display_name`, `description`, `icon`, `color`, `sort_order`) VALUES
('food', 'Food Assistance', 'Share meals and food supplies with those in need', 'utensils', '#FF6B35', 1),
('clothes', 'Clothing Donation', 'Donate and request clothing items for all ages', 'tshirt', '#4ECDC4', 2),
('education', 'Education & Training', 'Share knowledge through courses, workshops, and mentoring', 'graduation-cap', '#45B7D1', 3);

-- -----------------------------------------------------
-- Create Admin User (Default)
-- -----------------------------------------------------
-- Password: Admin123! (hashed with bcrypt)
INSERT INTO `users` (`name`, `email`, `password`, `is_admin`, `is_verified`) VALUES
('System Administrator', 'admin@hands2gether.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBksusq9XdQ8B6', TRUE, TRUE);

-- -----------------------------------------------------
-- Create Indexes for Performance
-- -----------------------------------------------------
-- Additional performance indexes
CREATE INDEX `idx_causes_status_category` ON `causes` (`status`, `category_id`);
CREATE INDEX `idx_causes_featured` ON `causes` (`is_featured`, `status`);
CREATE INDEX `idx_causes_priority_created` ON `causes` (`priority`, `created_at`);
CREATE INDEX `idx_causes_raised_amount` ON `causes` (`raised_amount` DESC);
CREATE INDEX `idx_causes_goal_amount` ON `causes` (`goal_amount` DESC);
CREATE INDEX `idx_causes_supporter_count` ON `causes` (`supporter_count` DESC);
CREATE INDEX `idx_cause_supporters_amount` ON `cause_supporters` (`amount` DESC);
CREATE INDEX `idx_food_urgent_expiry` ON `food_details` (`is_urgent`, `expiration_date`);
CREATE INDEX `idx_education_dates` ON `education_details` (`start_date`, `end_date`);
CREATE INDEX `idx_notifications_user_read` ON `notifications` (`user_id`, `is_read`);

-- -----------------------------------------------------
-- Create Views for Common Queries
-- -----------------------------------------------------
-- Active causes with basic info
CREATE VIEW `active_causes_view` AS
SELECT 
  c.id,
  c.title,
  c.short_description,
  c.location,
  c.priority,
  c.view_count,
  c.like_count,
  c.created_at,
  u.name as user_name,
  u.avatar as user_avatar,
  cat.name as category_name,
  cat.display_name as category_display_name,
  cat.color as category_color
FROM `causes` c
JOIN `users` u ON c.user_id = u.id
JOIN `categories` cat ON c.category_id = cat.id
WHERE c.status = 'active'
ORDER BY c.created_at DESC;

-- User dashboard stats
CREATE VIEW `user_stats_view` AS
SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(DISTINCT c.id) as total_causes,
  COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_causes,
  COUNT(DISTINCT CASE WHEN c.status = 'completed' THEN c.id END) as completed_causes,
  COUNT(DISTINCT a.id) as total_activities,
  COUNT(DISTINCT r.id) as total_registrations
FROM `users` u
LEFT JOIN `causes` c ON u.id = c.user_id
LEFT JOIN `activities` a ON u.id = a.user_id
LEFT JOIN `registrations` r ON u.id = r.user_id
GROUP BY u.id, u.name, u.email;

-- -----------------------------------------------------
-- Create Stored Procedures
-- -----------------------------------------------------
DELIMITER //

-- Update cause view count
CREATE PROCEDURE `UpdateCauseViewCount`(IN cause_id INT)
BEGIN
  UPDATE `causes` SET `view_count` = `view_count` + 1 WHERE `id` = cause_id;
END //

-- Get cause statistics
CREATE PROCEDURE `GetCauseStatistics`(IN cause_id INT)
BEGIN
  SELECT 
    c.*,
    COUNT(DISTINCT co.id) as comment_count,
    COUNT(DISTINCT ui.id) as interaction_count,
    COUNT(DISTINCT a.id) as activity_count,
    AVG(co.rating) as average_rating
  FROM `causes` c
  LEFT JOIN `comments` co ON c.id = co.cause_id
  LEFT JOIN `user_interactions` ui ON c.id = ui.cause_id
  LEFT JOIN `activities` a ON c.id = a.cause_id
  WHERE c.id = cause_id
  GROUP BY c.id;
END //

-- Update cause raised amount and supporter count
CREATE PROCEDURE `UpdateCauseAmounts`(IN cause_id INT)
BEGIN
  UPDATE `causes` 
  SET 
    `raised_amount` = (
      SELECT COALESCE(SUM(amount), 0) 
      FROM `cause_supporters` 
      WHERE `cause_id` = cause_id
    ),
    `supporter_count` = (
      SELECT COUNT(*) 
      FROM `cause_supporters` 
      WHERE `cause_id` = cause_id
    )
  WHERE `id` = cause_id;
END //

-- Get user dashboard data
CREATE PROCEDURE `GetUserDashboard`(IN user_id INT)
BEGIN
  -- User basic info with stats
  SELECT 
    u.*,
    us.total_causes,
    us.active_causes,
    us.completed_causes,
    us.total_activities,
    us.total_registrations
  FROM `users` u
  LEFT JOIN `user_stats_view` us ON u.id = us.id
  WHERE u.id = user_id;
  
  -- Recent causes
  SELECT c.*, cat.display_name as category_name
  FROM `causes` c
  JOIN `categories` cat ON c.category_id = cat.id
  WHERE c.user_id = user_id
  ORDER BY c.created_at DESC
  LIMIT 5;
  
  -- Unread notifications count
  SELECT COUNT(*) as unread_notifications
  FROM `notifications`
  WHERE user_id = user_id AND is_read = FALSE;
END //

DELIMITER ;

-- -----------------------------------------------------
-- Set Foreign Key Checks Back
-- -----------------------------------------------------
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Database Setup Complete
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Additional Tables for New Features
-- -----------------------------------------------------

-- Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS `newsletter_subscriptions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  `preferences` JSON NULL DEFAULT NULL,
  `subscription_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `unsubscribe_token` VARCHAR(255) NULL DEFAULT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `newsletter_email_key` (`email` ASC),
  INDEX `idx_active` (`is_active` ASC),
  INDEX `idx_subscription_date` (`subscription_date` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Contact form submissions table
CREATE TABLE IF NOT EXISTS `contact_submissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `category` ENUM('general', 'support', 'partnership', 'feedback', 'bug_report') NOT NULL DEFAULT 'general',
  `priority` ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  `status` ENUM('pending', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'pending',
  `admin_notes` TEXT NULL DEFAULT NULL,
  `responded_at` DATETIME NULL DEFAULT NULL,
  `submitted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email` ASC),
  INDEX `idx_status` (`status` ASC),
  INDEX `idx_category` (`category` ASC),
  INDEX `idx_priority` (`priority` ASC),
  INDEX `idx_submitted_at` (`submitted_at` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Chat messages table
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `conversation_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `message_type` ENUM('text', 'image', 'file') NOT NULL DEFAULT 'text',
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_conversation` (`conversation_id` ASC),
  INDEX `idx_sender` (`sender_id` ASC),
  INDEX `idx_created_at` (`created_at` ASC),
  CONSTRAINT `fk_chat_messages_conversation`
    FOREIGN KEY (`conversation_id`)
    REFERENCES `chat_conversations` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_chat_messages_sender`
    FOREIGN KEY (`sender_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- User sessions tracking table
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `session_token` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45) NULL DEFAULT NULL,
  `user_agent` TEXT NULL DEFAULT NULL,
  `last_activity` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `session_token_key` (`session_token` ASC),
  INDEX `idx_user_id` (`user_id` ASC),
  INDEX `idx_last_activity` (`last_activity` ASC),
  INDEX `idx_expires_at` (`expires_at` ASC),
  CONSTRAINT `fk_user_sessions_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Add missing columns to existing tables
ALTER TABLE `causes` 
ADD COLUMN IF NOT EXISTS `view_count` INT NOT NULL DEFAULT 0 AFTER `is_featured`,
ADD COLUMN IF NOT EXISTS `like_count` INT NOT NULL DEFAULT 0 AFTER `view_count`,
ADD COLUMN IF NOT EXISTS `share_count` INT NOT NULL DEFAULT 0 AFTER `like_count`;

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS `idx_causes_featured` ON `causes` (`is_featured` ASC, `created_at` DESC);
CREATE INDEX IF NOT EXISTS `idx_causes_likes` ON `causes` (`like_count` DESC);
CREATE INDEX IF NOT EXISTS `idx_causes_views` ON `causes` (`view_count` DESC);
CREATE INDEX IF NOT EXISTS `idx_causes_category_status` ON `causes` (`category_id` ASC, `status` ASC);
CREATE INDEX IF NOT EXISTS `idx_user_interactions_type` ON `user_interactions` (`interaction_type` ASC, `created_at` DESC);
CREATE INDEX IF NOT EXISTS `idx_notifications_user_read` ON `notifications` (`user_id` ASC, `is_read` ASC, `created_at` DESC);
CREATE INDEX IF NOT EXISTS `idx_newsletter_active` ON `newsletter_subscriptions` (`is_active` ASC, `subscription_date` DESC);
CREATE INDEX IF NOT EXISTS `idx_contact_status_priority` ON `contact_submissions` (`status` ASC, `priority` ASC, `submitted_at` DESC);
CREATE INDEX IF NOT EXISTS `idx_chat_messages_conversation` ON `chat_messages` (`conversation_id` ASC, `created_at` ASC);
CREATE INDEX IF NOT EXISTS `idx_analytics_events_type_date` ON `analytics_events` (`event_type` ASC, `created_at` DESC);

SELECT 'Hands2gether database schema installed successfully!' as status;