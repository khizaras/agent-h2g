-- Add enhanced education fields to education_details table
-- Migration to support course modules, multiple instructors, and enhanced prerequisites
USE `next_h2g`;

-- Add new JSON columns for enhanced education features
ALTER TABLE `education_details`
ADD COLUMN `course_modules` JSON NULL DEFAULT NULL COMMENT 'JSON array of course modules with title, description, duration, resources, assessment',
ADD COLUMN `instructors` JSON NULL DEFAULT NULL COMMENT 'JSON array of multiple instructors with name, email, phone, bio, qualifications, avatar',
ADD COLUMN `enhanced_prerequisites` JSON NULL DEFAULT NULL COMMENT 'JSON array of structured prerequisites with title, description, resources';

-- Update the table comment to reflect new capabilities
ALTER TABLE `education_details` COMMENT = 'Enhanced education course details with support for course modules, multiple instructors, and structured prerequisites';

-- Show the updated table structure
DESCRIBE `education_details`;