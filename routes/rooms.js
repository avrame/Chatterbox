const express = require('express');
const router = express.Router();
const Room = require('../models/room');

router.get('/', (req, res) => {
  Room.find((err, rooms) => {
    res.setHeader('Content-Type', 'application/json');
    if (err) {
      res.statusCode = 500;
      res.json({ err });
    } else {
      res.statusCode = 200;
      res.json({ rooms });
    }
  });
});

router.get('/:roomName', (req, res) => {
  Room.find({ name: req.params.roomName }, (err, room) => {
    res.setHeader('Content-Type', 'application/json');
    if (err) {
      res.statusCode = 500;
      res.json({ err });
    } else {
      if (room.length) {
        res.statusCode = 200;
        res.json({ room: room[0] });
      } else {
        res.statusCode = 404;
        res.json({ err: 'No room found' });
      }
    }
  })
})

router.post('/', (req, res) => {
  Room.create({
    name: req.body.roomName,
    description: req.body.roomDescription,
  }, (createError) => {
    res.setHeader('Content-Type', 'application/json');
    if (createError) {
      res.statusCode = 500;
      res.json({ error: createError });
    } else {
      Room.find((findError, rooms) => {
        if (findError) {
          res.statusCode = 500;
          res.json({ error: findError });
        } else {
          res.statusCode = 200;
          res.json({ rooms });
        }
      });
    }
  })
})

module.exports = router;
