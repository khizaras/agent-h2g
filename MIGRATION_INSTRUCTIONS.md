# Database Migration Required

## Issue Fixed
The cause creation API was failing because the `cause_type` field was missing from the `causes` table.

## Required Migration
Please run the following SQL commands on your MySQL database to fix the issue:

```sql
-- 1. Add cause_type field to causes table
ALTER TABLE `causes` 
ADD COLUMN `cause_type` VARCHAR(20) NOT NULL DEFAULT 'wanted' AFTER `user_id`;

-- 2. Add index for better query performance
ALTER TABLE `causes` 
ADD INDEX `idx_cause_type` (`cause_type` ASC);

-- 3. Add check constraint for valid values
ALTER TABLE `causes` 
ADD CONSTRAINT `chk_cause_type` CHECK (`cause_type` IN ('wanted', 'offered'));

-- 4. Update existing causes with default value
UPDATE `causes` SET `cause_type` = 'wanted' WHERE `cause_type` IS NULL OR `cause_type` = '';
```

## How to Run
1. Connect to your MySQL database
2. Select the `hands2gether_revamped` database
3. Execute the SQL commands above
4. Verify the migration with: `DESCRIBE causes;`

## What This Fixes
- ✅ Allows cause creation to work properly
- ✅ Enables "wanted" vs "offered" cause type distinction
- ✅ Provides proper database constraints for data integrity
- ✅ Improves query performance with indexing

After running this migration, the cause creation functionality will work correctly.