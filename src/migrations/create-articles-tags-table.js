const { ddlQuery } = require('../models/index');

const up = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS 
    articlesTags (
      id SERIAL PRIMARY KEY,
      articleId INTEGER NOT NULL,
      tagId INTEGER NOT NULL,
      FOREIGN KEY (articleId) REFERENCES articles (id) ON DELETE CASCADE,
      FOREIGN KEY (tagId) REFERENCES tags (id) ON DELETE CASCADE
    )`;
  ddlQuery(queryText);
};

const down = async () => {
  const queryText = 'DROP TABLE IF EXISTS articlesTags';
  ddlQuery(queryText);
};

module.exports = {
  up,
  down,
};

require('make-runnable');
