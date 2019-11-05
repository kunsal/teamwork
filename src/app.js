// Dependencies import
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
require('./helpers/logger');
require('dotenv').config();

// Initialize app
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

module.exports = app;
