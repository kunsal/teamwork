const express = require('express');
const gifController = require('../../../controllers/apis/gif.controller');
const authMiddleware = require('../../../middlewares/auth');
const multer = require('../../../config/multer-config');

const router = express.Router();
const { create, single, deleteGif, commentOnGif } = gifController;

router.post('/', [authMiddleware, multer], create);
router.get('/:id', single);
router.delete('/:id',authMiddleware, deleteGif);
router.post('/:id/comment', authMiddleware, commentOnGif);

module.exports = router; 