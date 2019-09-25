const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', UserSchema);
module.exports = User;
