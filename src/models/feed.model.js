const { query } = require('./index');

class Feed {
  async all() {
    let text = `SELECT * FROM (
                  SELECT id, title, article as content, author, 'article' as feedType, createdAt FROM articles
                  UNION
                  SELECT id, title, imageurl as content, author, 'gif' as feedType, createdAt FROM gifs 
                ) AS feeds ORDER BY createdAt DESC;`;
    const values = [];
    return query(text, values);
  }
}

module.exports = Feed;