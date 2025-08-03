-- Add cause_type field to causes table
-- This field is needed to distinguish between "wanted" and "offered" causes

ALTER TABLE `causes` 
ADD COLUMN `cause_type` VARCHAR(20) NOT NULL DEFAULT 'wanted' AFTER `user_id`;

-- Add index for cause_type for better query performance
ALTER TABLE `causes` 
ADD INDEX `idx_cause_type` (`cause_type` ASC);

-- Add a check constraint to ensure only valid values
ALTER TABLE `causes` 
ADD CONSTRAINT `chk_cause_type` CHECK (`cause_type` IN ('wanted', 'offered'));

-- Update existing causes to have a default cause_type
-- You may want to update this based on your existing data logic
UPDATE `causes` SET `cause_type` = 'wanted' WHERE `cause_type` IS NULL OR `cause_type` = '';