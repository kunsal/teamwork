const { ddlQuery } = require('../models/index');

const up = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS 
    users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      password VARCHAR(100) NOT NULL,
      gender VARCHAR(10) NOT NULL,
      employee_id VARCHAR(20) NOT NULL UNIQUE,
      job_role VARCHAR(30) NOT NULL,
      department VARCHAR(50) NOT NULL,
      address VARCHAR(100),
      is_admin BOOLEAN DEFAULT FALSE,
      CONSTRAINT unique_email UNIQUE(email)
    )`;
  ddlQuery(queryText);
};

const down = async () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  ddlQuery(queryText);
};

module.exports = {
  up,
  down,
};

require('make-runnable');
