
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  spotify_id TEXT UNIQUE NOT null,
  user_name TEXT not null,
  image_url TEXT not null,
  refresh_token TEXT
);


CREATE TABLE podcast_library (
  user_id INTEGER REFERENCES users(id),
  library_name text not null,
  podcast_id text not null,
  PRIMARY KEY (user_id, library_name, podcast_id)
);

SELECT * FROM users WHERE spotify_id = '2';

commit;