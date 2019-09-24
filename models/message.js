var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  room: {
    type: String,
    unique: false,
    required: true
  },
  text: {
    type: String,
    unique: false,
    required: true
  }
});

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
