"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var commentS = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Products"
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  star: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
}, {
  collection: 'comment',
  versionKey: false
});
var commentModel = mongoose.model('comment', commentS);
module.exports = commentModel;