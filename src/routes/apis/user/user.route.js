const express = require('express');
const userController = require('../../../controllers/apis/user.controller');
const authController = require('../../../controllers/apis/auth.controller');

const router = express.Router();

router.post('/create-user', userController.create);
router.post('/login', authController.login);

module.exports = router;
