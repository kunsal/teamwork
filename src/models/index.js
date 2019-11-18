require('dotenv').config();
const { Pool } = require('pg');
const logger = require('../helpers/logger');

const { NODE_ENV, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
//console.log(NODE_ENV);
const isProduction = NODE_ENV === 'production';
const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
let dbConnection;

switch (NODE_ENV) {
  case 'production':
    dbConnection = process.env.DATABASE_URL;
    break;
  case 'test':
    dbConnection = process.env.TEST_DATABASE_URL;
    break;
  default:
    dbConnection = connectionString;
}

const pool = new Pool({
  connectionString: dbConnection,
  ssl: isProduction,
});

const ddlQuery = async (text) => {
  try {
    const res = await pool.query(text);
    logger.info(`${res.command} query ran successfully`);
  } catch (e) {
    throw new Error(e);
  }
}

const query = (queryText, params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await pool.query(queryText, params);
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  pool,
  ddlQuery,
  query
}