const { ddlQuery } = require('../models/index');

const up = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS 
    comments (
      id SERIAL PRIMARY KEY,
      commenter INTEGER NOT NULL,
      postType VARCHAR NOT NULL,
      postId INTEGER NOT NULL,
      comment VARCHAR(100) NOT NULL,
      inappropriate BOOLEAN DEFAULT FALSE, 
      createdAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (commenter) REFERENCES users (id) ON DELETE CASCADE
    )`;
  ddlQuery(queryText);
};

const down = async () => {
  const queryText = 'DROP TABLE IF EXISTS comments';
  ddlQuery(queryText);
};

module.exports = {
  up,
  down,
};

require('make-runnable');
