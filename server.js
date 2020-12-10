require('dotenv').config();

const { DEBUG = false, PORT = 8001 } = process.env;

const clog = require('color-logs')(true, DEBUG === 'true', __filename);

const app = require('./app');
const { version, description } = require('./package.json');

try {
  clog.debug(`Starting server - ${description} v${version} - localhost:${PORT}`);
  app().listen(PORT);
} catch (err) {
  clog.error(err);
}

process.on('uncaughtException', () => { });