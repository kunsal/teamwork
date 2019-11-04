// Dependencies import
require('dotenv').config();
const express = require('express');
const logger = require('./helpers/logger');

// Initialize app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
logger.error('Please this should fail and create files');

const port = process.env.PORT || 3000;
const server = app.listen(port, logger.info(`Listening on port ${port}`));

module.exports = server;
