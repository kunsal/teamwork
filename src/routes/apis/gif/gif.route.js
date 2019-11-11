const express = require('express');
const gifController = require('../../../controllers/apis/gif.controller');
const authMiddleware = require('../../../middlewares/auth');

const router = express.Router();
const { create } = gifController;

router.post('/', authMiddleware, create);

module.exports = router; 