-- Hands2gether Complete Database Schema (without foreign keys)
-- Created on: May 18, 2025
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),
    avatar VARCHAR(255),
    bio TEXT,
    is_admin BOOLEAN DEFAULT false,
    google_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create causes table
CREATE TABLE IF NOT EXISTS causes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    category ENUM ('local', 'emergency', 'recurring') NOT NULL,
    category_id INT,
    funding_goal DECIMAL(10, 2),
    current_funding DECIMAL(10, 2) DEFAULT 0.00,
    food_goal INT,
    current_food INT DEFAULT 0,
    status ENUM ('active', 'completed', 'suspended') DEFAULT 'active',
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create contributions table
CREATE TABLE IF NOT EXISTS contributions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2),
    food_quantity INT,
    cause_id INT NOT NULL,
    user_id INT,
    message TEXT,
    anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT NOT NULL,
    comment TEXT,
    cause_id INT NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM (
        'cause_update',
        'contribution',
        'feedback',
        'system'
    ) NOT NULL,
    cause_id INT,
    user_id INT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create followed_causes table
CREATE TABLE IF NOT EXISTS followed_causes (
    user_id INT NOT NULL,
    cause_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, cause_id)
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type VARCHAR(50) NOT NULL,
    details TEXT,
    cause_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create category_fields table
CREATE TABLE IF NOT EXISTS category_fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM (
        'text',
        'textarea',
        'number',
        'date',
        'select',
        'checkbox',
        'radio',
        'file'
    ) NOT NULL,
    required BOOLEAN DEFAULT false,
    options JSON,
    placeholder VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create cause_category_values table
CREATE TABLE IF NOT EXISTS cause_category_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cause_id INT NOT NULL,
    category_id INT NOT NULL,
    field_id INT NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cause_field (cause_id, field_id)
);

-- Initial seed data for categories
INSERT INTO
    categories (name, description, created_at, updated_at)
VALUES
    ('Local', 'Local causes', NOW (), NOW ()),
    ('Emergency', 'Emergency causes', NOW (), NOW ()),
    ('Recurring', 'Recurring causes', NOW (), NOW ()) ON DUPLICATE KEY
UPDATE name =
VALUES
    (name);

-- Initial seed data for category fields (example)
INSERT INTO
    category_fields (
        category_id,
        name,
        type,
        required,
        placeholder,
        display_order,
        created_at,
        updated_at
    )
VALUES
    (
        1,
        'Area',
        'text',
        true,
        'Enter the local area',
        1,
        NOW (),
        NOW ()
    ),
    (
        1,
        'Contact Person',
        'text',
        false,
        'Local contact person',
        2,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Urgency Level',
        'select',
        true,
        'Select urgency level',
        1,
        NOW (),
        NOW ()
    ),
    (
        2,
        'Expected Duration',
        'text',
        false,
        'Expected duration of emergency',
        2,
        NOW (),
        NOW ()
    ),
    (
        3,
        'Frequency',
        'select',
        true,
        'How often this cause recurs',
        1,
        NOW (),
        NOW ()
    ),
    (
        3,
        'Next Occurrence',
        'date',
        true,
        'Date of next occurrence',
        2,
        NOW (),
        NOW ()
    ) ON DUPLICATE KEY
UPDATE name =
VALUES
    (name);

-- Set options for select fields
UPDATE category_fields
SET
    options = '["Low", "Medium", "High", "Critical"]'
WHERE
    name = 'Urgency Level'
    AND type = 'select';

UPDATE category_fields
SET
    options = '["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]'
WHERE
    name = 'Frequency'
    AND type = 'select';