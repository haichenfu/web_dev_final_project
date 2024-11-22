CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(40) UNIQUE,
    password VARCHAR(40),
    api_key VARCHAR(40)
);

CREATE TABLE channels (
    id INTEGER PRIMARY KEY,
    name VARCHAR(40) UNIQUE
);

CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    channel_id INTEGER,
    replies_to INTEGER DEFAULT NULL,
    body TEXT,
    post_time DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(channel_id) REFERENCES channels(id),
    FOREIGN KEY(replies_to) REFERENCES messages(id) 
);

CREATE TABLE message_reads(
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    channel_id INTEGER,
    read_timestamp DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(channel_id) REFERENCES channels(id),
    UNIQUE(user_id, channel_id)
);

CREATE TABLE reactions (
    id INTEGER PRIMARY KEY,
    message_id INTEGER,
    user_id INTEGER,
    emoji TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(message_id) REFERENCES messages(id)
);
