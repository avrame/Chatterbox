if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const Message = require('./models/message');
const users = require('./routes/users');
const rooms = require('./routes/rooms');
const messages = require('./routes/messages');

const app = express();
const wss = new WebSocket.Server({ port: 8080 });
const PORT = process.env.PORT || 3001;

mongoose.connect(`mongodb+srv://avrame:${process.env.MONGODB_PASSWORD}@chatterbox-abw5o.mongodb.net/chatterbox?retryWrites=true&w=majority`, { useNewUrlParser: true });

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(session({
  name: 'session-id',
  secret: '37fhjckeir83ufgidowei23ikd',
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use('/users', users);
app.use('/rooms', rooms);
app.use('/messages', messages);

// Web Sockets
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const json = JSON.parse(message);
    switch(json.action) {
      case 'postMessage': {
        Message.create({
          text: json.data.text,
          room: json.data.room
        }, (error, message) => {
          if (error) {
            // respond with error message
            ws.send(JSON.stringify({ error }));
          } else {
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  action: 'messageSent',
                  data: message,
                }));
              }
            })
          }
        })
        break;
      }
      default:
        ws.send('I don\'t understand this action');
    }
  });
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));