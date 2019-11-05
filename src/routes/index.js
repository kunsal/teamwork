const express = require('express');
const dotenv = require('dotenv');
const homePage = require('../controllers/home-page');
const apiRoutes = require('./apis/index.route');

const router = express.Router();
dotenv.config();

const apiVersion = process.env.API_VERSION;
const apiBaseUrl = `/api/${apiVersion}`;

router.use('/', homePage);
router.use(apiBaseUrl, apiRoutes);

module.exports = router;
