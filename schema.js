const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: String,
  username: String,
  password: String,
  totalNotes:{type:Number,default:0},
  joinedAt: {
    type: Date,
    default: Date.now
  },
  notes:[
    {
      title:String,
      content:String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const User = model('User', userSchema); 

module.exports = User;
