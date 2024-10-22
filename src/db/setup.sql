CREATE DATABASE IF NOT EXISTS internal_laptop_auction;

USE internal_laptop_auction;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  avatar VARCHAR(255),
  coins INT DEFAULT 50,
  is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS auctions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  current_bid INT NOT NULL,
  end_time DATETIME NOT NULL,
  bidders INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  auction_id INT,
  amount INT NOT NULL,
  bid_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (auction_id) REFERENCES auctions(id)
);