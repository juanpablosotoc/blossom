DROP DATABASE IF EXISTS blossom;
CREATE DATABASE blossom;
USE blossom;
CREATE TABLE users (
	id INT AUTO_INCREMENT,
	name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (id)
);
CREATE TABLE profile_images (
	user_id INT,
    thumbnail_s3_name VARCHAR(512) NOT NULL,
    normal_s3_name VARCHAR(512) NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) 
		REFERENCES users(id)
        ON DELETE RESTRICT # Cannot delete or will leave orphaned s3 objects
);
CREATE TABLE threads (
	id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
	name VARCHAR(100),
    ai_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    KEY idx_threads_user (user_id),
	KEY idx_threads_created (created_at),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE CASCADE
);
CREATE TABLE messages (
	id INT AUTO_INCREMENT,
    thread_id INT NOT NULL,
	content TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    sender ENUM('user','ai') NOT NULL,
    KEY idx_messages_thread_created (thread_id, created_at),
    PRIMARY KEY (id),
    FOREIGN KEY (thread_id) 
		REFERENCES threads(id)
        ON DELETE CASCADE
);
CREATE TABLE assets (
	id INT AUTO_INCREMENT,
    message_id INT NOT NULL,
    s3_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    size INT UNSIGNED NOT NULL,
    KEY idx_assets_message (message_id),
	KEY idx_assets_created (created_at),
    PRIMARY KEY (id),
    FOREIGN KEY (message_id) 
		REFERENCES messages(id)
        ON DELETE RESTRICT # Cannot delete or will leave orphaned s3 objects.
);