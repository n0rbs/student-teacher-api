const config = require('config');
const Sequelize = require('sequelize');
require("dotenv").config();

const StudentModel = require('./student/studentModel');
const TeacherModel = require('./teacher/teacherModel');
const StudentTeacherModel = require('./student/studentTeacherModel');

const { db: { password, ssl } } = require('../config/config');
const { user, database, host, port } = config.get('db.mysql');

let options = {
  host,
  port,
  dialect: 'mysql',
};
if (ssl.ca) {
  options.dialectOptions = {
    ssl,
  };
}

const sequelize = new Sequelize(
  database, user, password, options
);

const models = {
  StudentModel: StudentModel.init(sequelize, Sequelize),
  TeacherModel: TeacherModel.init(sequelize, Sequelize),
  StudentTeacherModel: StudentTeacherModel.init(sequelize, Sequelize),
};

const db = {
  ...models,
  sequelize,
};

module.exports = db;