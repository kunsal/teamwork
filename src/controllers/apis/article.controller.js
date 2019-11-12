const ArticleModel = require('../../models/article.model');
const CommentModel = require('../../models/comment.model');
const response = require('../../helpers/response');

const Article = new ArticleModel();
const Comment = new CommentModel();

const prepareArticleData = (req) => {
  return {
    author: req.user.userId,
    title: req.body.title,
    article: req.body.article,
    createdAt: new Date(),
    tags: req.body.tags
  }
}

const articleExists = async (id) => {
  const article = await Article.findBy('id', id);
  if (article.rowCount < 1) return false;
  return article.rows[0];
}

const create = async (req, res) => {
  try {
    const { error } = Article.validate(req.body);
    if (error) return res.status(400).send(response.error(error.details[0].message));
    const article = await Article.create(prepareArticleData(req));
    return res.status(201).send(response.success({ message: 'Article successfully posted', ...article.rows[0]}));
  } catch (e) {
    return res.status(500).send(e);
  }
};

const single = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await articleExists(articleId);
    if (!article) return res.status(404).send(response.error('No article found'));
    // Get comments
    const comments = await Comment.findByType('postId', articleId, 'article');
    return res.send(response.success({...article, comments: comments.rows}));
  } catch (e) {
    return res.status(500).send('Whoops! An error occurred, please try again');
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await articleExists(id);
    if (!article) return res.status(404).send(response.error('No article found'));
    // Only Original Poster or admin can delete this article
    if (req.user.userId === article.author) {
      const deletedArticle = await Article.delete('id', req.params.id);
      if (deletedArticle.rowCount < 1) return res.status(400).send(response.error('Article could not be deleted'));
      // Delete article comments
      await Comment.delete('postId', id);
      return res.send(response.success({ message: 'Article post successfully deleted', ...deleteArticle.rows[0]}));
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
    const article = await articleExists(articleId);
    if (!article) return res.status(404).send(response.error('Article does not exist')); 
    const { error } = Comment.validate(req.body);
    if (error) return res.status(400).send(response.error(error.details[0].message));
    const data = {
      commenter: req.user.userId,
      comment: req.body.comment,
      postType: 'article',
      postId: articleId,
    };
    const comment = await Comment.create(data);
    return res.send(response.success({ message: 'Comment added successfully', ...comment.rows[0]}));
  } catch (e) {
    return res.status(500).send('Whoops! An error occurred, please try again');
  }
};

const editArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findBy('id', articleId);
    if (article.rowCount === 0) return res.status(404).send(response.error('Article does not exist'));
    const { error } = Article.validate(req.body);
    if (error) return res.status(400).send(response.error(error.details[0].message));
    const data = {
      title: req.body.title,
      article: req.body.article,
      tags: req.body.tags
    };
    const updatedArticle = await Article.update(data, articleId);
    res.send(response.success({ message: 'Article updated successfully', ...updatedArticle.rows[0]}));
  } catch (e) {
    res.status(500).send('An error occurred. Please try again');
  }
}

const flagArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findBy('id', articleId);
    if (article.rowCount === 0) return res.status(404).send(response.error('Article does not exist'));
    const { error } = Article.validateFlag(req.body);
    if (error) return res.status(400).send(response.error(error.details[0].message));
    const data = {
      inappropriate: req.body.inappropriate
    }
    const updatedArticle = await Article.update(data, articleId);
    res.send(response.success({ message: 'Article flag updated successfully', ...updatedArticle.rows[0]}));
  } catch(e) {
    res.status(500).send('An error occurred. Please try again');
  }
}

module.exports = {
  create,
  single,
  deleteArticle,
  commentOnArticle,
  editArticle,
  flagArticle
};
