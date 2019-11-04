// Dependencies import
require('dotenv').config();
const express = require('express');
const winston = require('winston');
const logger = require('./helpers/logger');

// Initialize app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
winston.error('Please this should fail and create files');
logger();
const por = process.env.PORT || 3000; 
const server = app.listen(port, winston.info(`Listening on port ${port}`));

module.exports = server;
