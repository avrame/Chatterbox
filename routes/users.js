const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.post('/signup', (req, res, next) => {
  User.register(new User({
      username: req.body.username,
      email: req.body.email,
    }),
    req.body.password, (err, user) => {
      res.setHeader('Content-Type', 'application/json');
      if (err) {
        res.statusCode = 500;
        res.json({
          err: err
        });
      } else {
        passport.authenticate('local')(req, res, () => {
          User.findOne({
            username: req.body.username
          }, (err, createdUser) => {
            console.log('createdUser', createdUser)
            res.statusCode = 200;
            res.json({
              success: true,
              user: createdUser,
              status: 'Registration Successful!',
            });
          });
        })
      }
    })
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) {
      res.sendStatus(401);
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        user,
        status: 'You are successfully logged in!'
      });
    }
  })
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.logout();
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.clearCookie('session-id');
        res.json({
          success: true,
          message: 'You are successfully logged out!'
        });
      }
    });
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
