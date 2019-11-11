const express = require('express');
const gifController = require('../../../controllers/apis/gif.controller');
const authMiddleware = require('../../../middlewares/auth');
const multer = require('../../../config/multer-config');

const router = express.Router();
const { create } = gifController;

router.post('/', [authMiddleware, multer], create);

module.exports = router; 