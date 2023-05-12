// src/webhook.js
const express = require('express');
const router = express.Router();
const { handleCreateOrder } = require('./helpers');

router.post('/create_order', (req, res) => {
  handleCreateOrder(req.body)
    .then(() => {
      res.status(200).send({ success: true });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ success: false, message: 'An error occurred' });
    });
});

module.exports = router;
