const ArticleModel = require('../../models/article.model');
const TagModel = require('../../models/tag.model');
const ArticleTagModel = require('../../models/article-tag.model');
const CommentModel = require('../../models/comment.model');
const response = require('../../helpers/response');
const { serverError, errorResponse, renameKeys } = require('../../helpers/helper');

const Article = new ArticleModel();
const Comment = new CommentModel();
const Tag = new TagModel();
const ArticleTag = new ArticleTagModel();
const articleNotFound = 'No article found';

const prepareArticleData = (req) => ({
  author: req.user.userId,
  title: req.body.title,
  article: req.body.article,
  createdAt: new Date()
});

const articleExists = async (id) => {
  const article = await Article.findBy('id', id);
  if (article.rowCount < 1) return false;
  return article.rows[0];
};

const attachTagToArticle = async(tagId, articleId) => {
  await ArticleTag.create({
    articleId: articleId,
    tagId: tagId
  });
}

const articleReturnData = [
  { articleId: 'id' },
  { articleTitle: 'title' },
  { authorId: 'author' },
  { createdOn: 'createdat' }
];

const create = async (req, res) => {
  try {
    const { error } = Article.validate(req.body);
    if (error) return errorResponse(res, error.details[0].message);
    const article = await Article.create(prepareArticleData(req));
    const articleId = article.rows[0].id;
    console.log(articleId)
    const tags = req.body.tags;
    if (tags.length > 0 && Array.isArray(tags)) {
      tags.map(async (t) => {
        // Check if tag exists
        const tag = await Tag.findBy('tag', t);
        if (tag.rowCount > 0) {
          // Attach tag to article
          await attachTagToArticle(tag.rows[0].id, articleId);
        } else {
          // Create new tag
          const createdTag = await Tag.create({tag: t});
          // Attach tag to article
          await attachTagToArticle(createdTag.rows[0].id, articleId);
        }
      });
    }
    renameKeys(articleReturnData, article.rows[0]);
    return res.status(201).send(response.success({ message: 'Article successfully posted', ...article.rows[0] }));
  } catch (e) {
    serverError(res, e);
  }
};

const single = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await articleExists(articleId);
    if (!article) return errorResponse(res, articleNotFound, 404);
    // Get comments
    const comments = await Comment.findByType('postId', articleId, 'article');
    renameKeys(articleReturnData, article);
    return res.send(response.success({ ...article, comments: comments.rows }));
  } catch (e) {
    console.log(e);
    serverError(res, e);
  }
};

const findByTags = async (req, res) => {
  try {
    const { error } = Tag.validate(req.body);
    if (error) return errorResponse(res, error.details[0].message);
    const articles = await Article.findByTags(req.body.tags);
    return res.send(response.success(articles.rows));
  } catch (e) {
    serverError(res, e)
  }
}

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await articleExists(id);
    if (!article) return errorResponse(res, articleNotFound, 404);
    // Only Original Poster or admin can delete this article
    if (req.user.userId === article.author) {
      performDelete(id, res);
    } else if (req.user.isAdmin && article.inappropriate){
      performDelete(id, res);
    } else {
      return errorResponse(res, 'Forbidden', 403);
    }
  } catch (e) {
    serverError(res, e);
  }
};

const performDelete = async (id, res) => {
  const deletedArticle = await Article.delete('id', id);
  const articleData = deletedArticle.rows[0];
    if (deletedArticle.rowCount < 1) return errorResponse(res, 'Article could not be deleted');
    // Delete article comments
    await Comment.delete('postId', id)
    renameKeys(articleReturnData, articleData);
    return res.send(response.success({ message: 'Article post successfully deleted', ...articleData }));
}

const commentOnArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    // Does Article exist?
    const article = await articleExists(articleId);
    if (!article) return errorResponse(res, articleNotFound, 404);
    const { error } = Comment.validate(req.body);
    if (error) return errorResponse(res, error.details[0].message);
    const data = {
      commenter: req.user.userId,
      comment: req.body.comment,
      postType: 'article',
      postId: articleId,
    };
    const comment = await Comment.create(data);
    return res.send(response.success({ message: 'Comment added successfully', ...comment.rows[0] }));
  } catch (e) {
    serverError(res, e);
  }
};

const editArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findBy('id', articleId);
    if (article.rowCount === 0) return errorResponse(res, articleNotFound, 404);
    const { error } = Article.validate(req.body);
    if (error) return errorResponse(res, error.details[0].message);
    const data = {
      title: req.body.title,
      article: req.body.article,
      tags: req.body.tags,
    };
    const updatedArticle = await Article.update(data, articleId);
    renameKeys(articleReturnData, updatedArticle.rows[0]);
    res.send(response.success({ message: 'Article updated successfully', ...updatedArticle.rows[0] }));
  } catch (e) {
    serverError(res, e);
  }
};

const flagArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findBy('id', articleId);
    if (article.rowCount === 0) return errorResponse(res, articleNotFound, 404);
    const { error } = Article.validateFlag(req.body);
    if (error) return errorResponse(res, error.details[0].message);
    const data = {
      inappropriate: req.body.inappropriate,
    };
    const updatedArticle = await Article.update(data, articleId);
    renameKeys(articleReturnData, updatedArticle.rows[0]);
    res.send(response.success({ message: 'Article flag updated successfully', ...updatedArticle.rows[0] }));
  } catch (e) {
    serverError(res, e);
  }
};

module.exports = {
  create,
  single,
  deleteArticle,
  commentOnArticle,
  editArticle,
  flagArticle,
  findByTags
};
