// Dependencies import
const express = require('express');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
require('./helpers/logger');
require('dotenv').config();

// Initialize app
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

module.exports = app;
