-- Migration: Create activities table
-- This table stores user activities like cause creation, updates, and other engagement metrics
-- Date: August 15, 2025

USE `hands2gether_revamped`;

-- Create activities table
CREATE TABLE IF NOT EXISTS `activities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `cause_id` INT NULL DEFAULT NULL,
  `type` ENUM('cause_created', 'cause_updated', 'cause_viewed', 'activity_logged', 'registration', 'donation', 'comment_added', 'support_given') NOT NULL,
  `description` TEXT NOT NULL,
  `metadata` JSON NULL DEFAULT NULL,
  `ip_address` VARCHAR(45) NULL DEFAULT NULL,
  `user_agent` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id` ASC),
  INDEX `idx_cause_id` (`cause_id` ASC),
  INDEX `idx_type` (`type` ASC),
  INDEX `idx_created_at` (`created_at` ASC),
  INDEX `idx_user_cause` (`user_id` ASC, `cause_id` ASC),
  INDEX `idx_user_type` (`user_id` ASC, `type` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Add some sample activities for testing (if there are existing users and causes)
-- These will help populate the activity_count in the causes query

-- Insert registration activities for existing users
INSERT IGNORE INTO `activities` (`user_id`, `type`, `description`, `created_at`)
SELECT 
  `id` as user_id,
  'registration' as type,
  CONCAT('User ', `name`, ' registered on the platform') as description,
  `created_at`
FROM `users`
WHERE NOT EXISTS (
  SELECT 1 FROM `activities` a WHERE a.user_id = `users`.id AND a.type = 'registration'
);

-- Insert cause creation activities for existing causes
INSERT IGNORE INTO `activities` (`user_id`, `cause_id`, `type`, `description`, `created_at`)
SELECT 
  `user_id`,
  `id` as cause_id,
  'cause_created' as type,
  CONCAT('Created cause: ', `title`) as description,
  `created_at`
FROM `causes`
WHERE NOT EXISTS (
  SELECT 1 FROM `activities` a WHERE a.cause_id = `causes`.id AND a.type = 'cause_created'
);

-- Add some view activities for popular causes to simulate engagement
INSERT IGNORE INTO `activities` (`user_id`, `cause_id`, `type`, `description`, `created_at`)
SELECT 
  FLOOR(1 + (RAND() * (SELECT COUNT(*) FROM `users`))) as user_id,
  c.id as cause_id,
  'cause_viewed' as type,
  CONCAT('Viewed cause: ', c.title) as description,
  DATE_ADD(c.created_at, INTERVAL FLOOR(RAND() * 30) DAY) as created_at
FROM `causes` c
CROSS JOIN (SELECT 1 UNION SELECT 2 UNION SELECT 3) AS multiple
WHERE EXISTS (SELECT 1 FROM `users`)
LIMIT 100;
