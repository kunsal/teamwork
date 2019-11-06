const express = require('express');
const authRoutes = require('./user/user.route');

const router = express.Router();

router.use('/auth', authRoutes);

module.exports = router;
