// Dependencies import
require('dotenv').config();
const express = require('express');
require('./helpers/logger');

// Initialize app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/v1/auth/create-user', (req, res) => {
  res.status(201).send({ status: 'true' });
});

module.exports = app;
