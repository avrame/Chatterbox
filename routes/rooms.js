const express = require('express');
const router = express.Router();
const User = require('../models/room');

router.get('/', (req, res, next) => {
  User.find((err, rooms) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        err: err
      });
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ rooms });
    }
  });
});

module.exports = router;
