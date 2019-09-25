const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
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
