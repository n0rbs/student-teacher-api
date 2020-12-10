require('dotenv').config();

const {
  DB_PASSWORD: password,
  CA_CERT: caCert = null,
} = process.env;

module.exports = {
  swagger: {
    swaggerFile: './api/swagger/swagger.yaml',
  },
  db: {
    ssl: {
      ca: caCert ? Buffer.from(caCert.toString(), "base64").toString("ascii") : null,
    },
    password,
  },
};