const { ddlQuery } = require('../models/index');

const up = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS 
    gifs (
      id SERIAL PRIMARY KEY,
      author INTEGER NOT NULL,
      title VARCHAR(100) NOT NULL,
      imageUrl VARCHAR(255) NOT NULL UNIQUE,
      imagePublicId VARCHAR(100) NOT NULL UNIQUE,
      height INTEGER NOT NULL,
      width INTEGER NOT NULL,
      tags VARCHAR(255),
      originalFilename VARCHAR(255) NOT NULL,
      createdAt TIMESTAMPTZ NOT NULL,
      FOREIGN KEY (author) REFERENCES users (id) ON DELETE CASCADE
    )`;
  ddlQuery(queryText);
};

const down = async () => {
  const queryText = 'DROP TABLE IF EXISTS gifs';
  ddlQuery(queryText);
};

module.exports = {
  up,
  down,
};

require('make-runnable');
