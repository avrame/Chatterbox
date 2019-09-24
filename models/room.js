var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    unique: false,
    required: true
  }
});

var Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
