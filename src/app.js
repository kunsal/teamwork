// Dependencies import
const express = require('express');
const routes = require('./routes/index');
require('./helpers/logger');
require('dotenv').config();

// Initialize app
const app = express();

app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

app.use(routes);

module.exports = app;
