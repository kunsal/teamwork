const ArticleModel = require('../models/article.model');
const TagModel = require('../models/tag.model');
const ArticleTagModel = require('../models/article-tag.model');



exports.create = async () => {
  const Article = new ArticleModel();
  const Tag = new TagModel();
  const ArticleTag = new ArticleTagModel();

  
  try {
    Article.query('truncate table articles restart identity cascade');
    const article = await Article.create({
      title: 'First Article',
      article: 'This is our first article',
      author: 1, 
      createdAt: new Date()
    });
    // articleId = article.rows[0].id;
    // const tag = await Tag.create({tag: 'myTag'});
    // tagId = tag.rows[0].id;

    // await ArticleTag.create({
    //   articleId, tagId
    // });
    console.log('Article created');

  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

require('make-runnable');
