CREATE TABLE logins (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  account INTEGER NOT NULL
);