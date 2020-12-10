CREATE DATABASE IF NOT EXISTS school;
use school;

CREATE TABLE IF NOT EXISTS students (
  email varchar(255) NOT NULL, 
  suspended tinyint(1) DEFAULT 0, 
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL,
  PRIMARY KEY(email)
);

CREATE TABLE IF NOT EXISTS teachers (
  email varchar(255) NOT NULL, 
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL,
  PRIMARY KEY(email)
);

CREATE TABLE IF NOT EXISTS students_teachers (
  id int(11) NOT NULL AUTO_INCREMENT, 
  student varchar(255) NOT NULL, 
  teacher varchar(255) NOT NULL, 
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL,
  PRIMARY KEY(id)
);

INSERT INTO teachers (email, createdAt, updatedAt) VALUES 
  ('teacherken@gmail.com', '2020-12-02 00:00:00', '2020-12-02 00:00:00'),
  ('teacherjoe@gmail.com', '2020-12-02 00:00:00', '2020-12-02 00:00:00');
