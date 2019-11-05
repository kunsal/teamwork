const express = require('express');
const userController = require('../../../controllers/apis/user.controller');

const router = express.Router();

router.post('/create-user', userController.create);

module.exports = router;
