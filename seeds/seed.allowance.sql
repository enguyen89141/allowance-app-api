BEGIN;

TRUNCATE 
  logins,
  parents,
  children,
  tasks
  RESTART IDENTITY CASCADE;

INSERT INTO logins (username, password, account)
VALUES
  ('enguyen89141', '$2y$12$6WVz9TO/tw.ribgj4amS3OMZnWFo/W.m8KDhBVEDq9e0pphGBrvZ6', 0),
  ('chrisluong', '$2y$12$hppv4gsF4k99gypkHz8zL.2/lEQ30erhm5u9VLhF0S6tLWRSWegHW', 1),
  ('parenttwo', '$2y$12$6F267O9B5XQLIvS8TmP5ve5f0Qv5qUM08/I1K3D2dJurHlihc7u3K', 0),
  ('childtwo', '$2y$12$bBAGmTz/8k9XUvA/R/Hghu7nNe2HR94Az4a29EPDAacAQXpIaQw9y', 1),
  ('parentthree', '$2y$12$x5VdefsNj3XX.OI1qM.M.uRA4H27FhpQLH8xD.otTD6HqsXFtOLb6', 0);

INSERT INTO parents (first_name, last_name, email, login_id)
VALUES
  ('Eric', 'Nguyen', 'enguyen8941@gmail.com', 1),
  ('Parent', 'two', 'parenttwo@gmail.com', 3);

INSERT INTO children (first_name, last_name, email, parent_id, login_id)
VALUES
  ('Christopher', 'Luong', 'chrisluong@gmail.com', 1, 2),
  ('Child', 'two', 'childtwo@gmail.com', 2, 4);

INSERT INTO tasks (name, difficulty, reward, current_status, child_id)
VALUES
  ('Clean room', 2, 4, 'open', 1),
  ('Finish homework', 3, 6, 'pending', 1),
  ('Finish developer module 4', 5, 10, 'completed', 1),
  ('Task 1', 2, 4, 'open', 2),
  ('Task 2', 1, 2, 'pending', 2),
  ('Task 3', 4, 8, 'completed', 2);

COMMIT;