-- Create cause_supporters table if it doesn't exist
CREATE TABLE IF NOT EXISTS cause_supporters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cause_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    message TEXT,
    anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cause_id) REFERENCES causes (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_cause_supporters_cause_id (cause_id),
    INDEX idx_cause_supporters_user_id (user_id),
    INDEX idx_cause_supporters_created_at (created_at)
);