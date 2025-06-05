-- Users table, to track refresh tokens, and library
-- id: Auto-incrementing primary key
-- spotify_id: Unique identifier for the user on Spotify
-- user_name: Name of the user
-- image_url: URL of the user's profile image
-- refresh_token: Token used to refresh the user's session with Spotify
CREATE TABLE
  users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spotify_id varchar(256) UNIQUE NOT NULL,
    user_name varchar(256) NOT NULL,
    image_url varchar(1000) NOT NULL,
    refresh_token varchar(1024)
  );

-- Podcast library table, to track user's podcast libraries
-- user_id: Foreign key referencing the users table
-- library_name: Name of the podcast library
-- podcast_id: Unique identifier for the podcast in the library
CREATE TABLE
  podcast_library (
    user_id INT NOT NULL,
    library_name varchar(128) NOT NULL,
    podcast_id varchar(256) NOT NULL,
    PRIMARY KEY (user_id, library_name, podcast_id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );