const { ddlQuery } = require('../models/index');

const up = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS 
    articles (
      id SERIAL PRIMARY KEY,
      author INTEGER NOT NULL,
      title VARCHAR(100) NOT NULL,
      article TEXT NOT NULL,
      tags VARCHAR(255),
      inappropriate BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMPTZ NOT NULL,
      FOREIGN KEY (author) REFERENCES users (id) ON DELETE CASCADE
    )`;
  ddlQuery(queryText);
};

const down = async () => {
  const queryText = 'DROP TABLE IF EXISTS articles';
  ddlQuery(queryText);
};

module.exports = {
  up,
  down,
};

require('make-runnable');
