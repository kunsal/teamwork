const { ddlQuery } = require('../models/index');

const up = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS 
    users (
      id SERIAL PRIMARY KEY,
      firstName VARCHAR(100) NOT NULL,
      lastName VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      password VARCHAR(100) NOT NULL,
      gender VARCHAR(10) NOT NULL,
      employeeId VARCHAR(20) NOT NULL UNIQUE,
      jobRole VARCHAR(30) NOT NULL,
      department VARCHAR(50) NOT NULL,
      address VARCHAR(100),
      isAdmin BOOLEAN DEFAULT FALSE,
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
