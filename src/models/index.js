require('dotenv').config();
const { Pool } = require('pg');

const { NODE_ENV, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const isProduction = NODE_ENV === 'production';
const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
});

const ddlQuery = async (text) => {
  try {
    const res = await pool.query(text);
    return `${res.command} query ran successfully`;
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = {
  pool,
  ddlQuery
}