const express = require('express');
const YAML = require('yamljs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

const { connector } = require('swagger-routes-express');
const api = require('./api');
const { version } = require('./package.json');

const { swagger: { swaggerFile } } = require('./config/config');

const options = {}; // TODO: Add security option and others

const makeApp = () => {
  const apiDefinition = YAML.load(swaggerFile);
  const connect = connector(api, apiDefinition, options);
  const app = express();

  // do any other app stuff, such as wire in passport, use cors etc
  app.use(morgan('combined'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: '30mb' }));
  app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'StudentTeacher');
    res.setHeader('X-Version', version);
    next();
  });
  app.use(cors());

  connect(app); // attach the routes

  return app;
};

module.exports = makeApp;