const express = require('express');
const articleController = require('../../../controllers/apis/article.controller');
const authMiddleware = require('../../../middlewares/auth');

const router = express.Router();
const { create, commentOnArticle, single, deleteArticle } = articleController;

router.post('/', [authMiddleware], create);
router.get('/:id', single);
router.delete('/:id', authMiddleware, deleteArticle);
router.post('/:id/comment', authMiddleware, commentOnArticle);

module.exports = router;