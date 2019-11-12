const express = require('express');
const authRoutes = require('./user/user.route');
const gifRoutes = require('./gif/gif.route');
const articleRoutes = require('./article/article.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/gifs', gifRoutes);
router.use('/articles', articleRoutes);

module.exports = router;
