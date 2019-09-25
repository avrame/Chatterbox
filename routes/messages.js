const express = require('express');
const router = express.Router();
const Message = require('../models/message');

router.get('/:roomSlug', (req, res) => {
  Message.find({ room: req.params.roomSlug }).populate('user').exec((error, messages) => {
    res.setHeader('Content-Type', 'application/json');
    if (error) {
      res.statusCode = 500;
      res.json({ error });
    } else {
      res.statusCode = 200;
      res.json({ messages });
    }
  })
});

module.exports = router;