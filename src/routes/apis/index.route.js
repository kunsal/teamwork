const express = require('express');
const authRoutes = require('./user/user.route');
const gifRoutes = require('./gif/gif.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/gif', gifRoutes);

module.exports = router;
