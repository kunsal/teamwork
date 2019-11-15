const { ddlQuery } = require('../models/index');

const up = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS 
    gifsTags (
      id SERIAL PRIMARY KEY,
      gifId INTEGER NOT NULL,
      tagId INTEGER NOT NULL,
      FOREIGN KEY (gifId) REFERENCES gifs (id) ON DELETE CASCADE,
      FOREIGN KEY (tagId) REFERENCES tags (id) ON DELETE CASCADE
    )`;
  ddlQuery(queryText);
};

const down = async () => {
  const queryText = 'DROP TABLE IF EXISTS gifsTags';
  ddlQuery(queryText);
};

module.exports = {
  up,
  down,
};

require('make-runnable');
