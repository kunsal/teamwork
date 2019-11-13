const express = require('express');
const { fetch } = require('../../../controllers/apis/feed.controller');

const router = express.Router();

router.get('/', fetch);

module.exports = router;
