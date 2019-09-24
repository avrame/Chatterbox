const express = require('express');
const router = express.Router();
const Room = require('../models/room');

router.get('/', (req, res, next) => {
  Room.find((err, rooms) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err });
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ rooms });
    }
  });
});

router.post('/', (req, res, next) => {
  Room.create({
    name: req.body.roomName,
    description: req.body.roomDescription,
  }, (createError, rooms) => {
    if (createError) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ error: createError });
    } else {
      Room.find((findError, rooms) => {
        if (findError) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ error: findError });
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ rooms });
        }
      });
    }
  })
})

module.exports = router;
