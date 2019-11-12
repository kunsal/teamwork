const ArticleModel = require('../../models/article.model');
const CommentModel = require('../../models/comment.model');
const response = require('../../helpers/response');

const Article = new ArticleModel();
const Comment = new CommentModel();

const create = async (req, res) => {
  try {
    const { error } = Article.validate(req.body);
    if (error) return res.status(400).send(response.error(error.details[0].message));
    const data = {
      author: req.user.userId,
      title: req.body.title,
      article: req.body.article,
      createdAt: new Date(),
      tags: req.body.tags,
    };
    const article = await Article.create(data);
    if (article.rowCount > 0) {
      const articleData = article.rows[0];
      articleData.message = 'Article successfully posted';
      return res.status(201).send(response.success(articleData));
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
};

const single = async (req, res) => {
  try {
    const article = await Article.findBy('id', req.params.id);
    if (article.rowCount < 1) return res.status(404).send(response.error('No article found'));
    return res.send(response.success(article.rows[0]));
  } catch (e) {
    return res.status(500).send('Whoops! An error occurred, please try again');
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await article.findBy('id', id);
    if (article.rowCount < 1) return res.status(404).send(response.error('No article found'));
    const articleData = article.rows[0];
    // Only Original Poster or admin can delete this article
    if (req.user.userId === articleData.author) {
      const deletedArticle = await Article.delete('id', req.params.id);
      if (deletedArticle.rowCount < 1) return res.status(400).send(response.error('Article could not be deleted'));
      // Delete article comments
      await Comment.delete('postId', id);
      const deletedArticleData = deleteArticle.rows[0];
      deletedArticleData.message = 'article post successfully deleted';
      return res.send(response.success(deletedArticleData));
    }
    return res.status(401).send(response.error('Unauthorized'));
  } catch (e) {
    return res.status(500).send('Whoops! An error occurred, please try again');
  }
};

const commentOnArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    // Does Article exist?
    const article = await Article.findBy('id', articleId);
    if (article.rowCount < 1) return res.status(404).send(response.error('Article does not exist')); 
    const { error } = Comment.validate(req.body);
    if (error) return res.status(400).send(response.error(error.details[0].message));
    const data = {
      commenter: req.user.userId,
      comment: req.body.comment,
      postType: 'article',
      postId: articleId,
    };
    const comment = await Comment.create(data);
    const commentData = comment.rows[0];
    commentData.message = 'Comment added successfully';
    return res.send(response.success(commentData));
  } catch (e) {
    return res.status(500).send('Whoops! An error occurred, please try again');
  }
};

module.exports = {
  create,
  single,
  deleteArticle,
  commentOnArticle,
};
