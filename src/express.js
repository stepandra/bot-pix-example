// src/express.js
const express = require('express');
const bodyParser = require('body-parser');
const webhookRoutes = require('./webhook');

const app = express();

app.use(bodyParser.json());

app.use('/webhook', webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
