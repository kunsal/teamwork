const { ddlQuery } = require('../models/index');

const up = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS 
    tags (
      id SERIAL PRIMARY KEY,
      tag VARCHAR NOT NULL UNIQUE
    )`;
  ddlQuery(queryText);
};

const down = async () => {
  const queryText = 'DROP TABLE IF EXISTS tags';
  ddlQuery(queryText);
};

module.exports = {
  up,
  down,
};

require('make-runnable');
