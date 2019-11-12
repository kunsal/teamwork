const express = require('express');
const articleController = require('../../../controllers/apis/article.controller');
const authMiddleware = require('../../../middlewares/auth');

const router = express.Router();
const { create, commentOnArticle, single, deleteArticle, editArticle, flagArticle } = articleController;

router.post('/', [authMiddleware], create);
router.get('/:id', single);
router.delete('/:id', authMiddleware, deleteArticle);
router.post('/:id/comment', authMiddleware, commentOnArticle);
router.patch('/:id', authMiddleware, editArticle);
router.patch('/:id/flag', authMiddleware, flagArticle);

module.exports = router;