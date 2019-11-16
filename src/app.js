// Dependencies import
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
require('./helpers/logger');
require('dotenv').config();
const path = require('path');

// Initialize app
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname+'../../public/index.html'))
} )

app.use(routes);

module.exports = app;
