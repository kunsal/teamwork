const express = require('express');
const dotenv = require('dotenv');
const homePage = require('../controllers/home-page');
const apiRoutes = require('./apis/index.route');

dotenv.config();

const router = express.Router();

router.get('/', homePage);
router.use('/api/v1', apiRoutes);

module.exports = router;
