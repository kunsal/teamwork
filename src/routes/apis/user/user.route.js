const express = require('express');
const userController = require('../../../controllers/apis/user.controller');
const authController = require('../../../controllers/apis/auth.controller');
const authMiddleware = require('../../../middlewares/auth');

const router = express.Router();

router.post('/create-user', [authMiddleware], userController.create);
router.post('/signin', authController.login);

module.exports = router;
