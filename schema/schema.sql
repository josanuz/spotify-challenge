-- Users table, to track refresh tokens, and library
-- id: Auto-incrementing primary key
-- spotify_id: Unique identifier for the user on Spotify
-- user_name: Name of the user
-- image_url: URL of the user's profile image
-- refresh_token: Token used to refresh the user's session with Spotify
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  spotify_id TEXT UNIQUE NOT null,
  user_name TEXT not null,
  image_url TEXT not null,
  refresh_token TEXT
);

-- Podcast library table, to track user's podcast libraries
-- user_id: Foreign key referencing the users table
-- library_name: Name of the podcast library
-- podcast_id: Unique identifier for the podcast in the library
CREATE TABLE podcast_library (
  user_id INTEGER REFERENCES users(id),
  library_name text not null,
  podcast_id text not null,
  PRIMARY KEY (user_id, library_name, podcast_id)
);
