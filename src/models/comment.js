const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const commentS = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Products"
  },
  name:{
    type: String,
    required: true
  },
  avatar:{
    type: String,
    required: true
  },
  date:{
    type: String,
    required: true
  },
  star:{
    type: Number,
    required: true
  },
  comment:{
    type: String,
    required: true
  }
},{
  collection: 'comment',
  versionKey: false
});

const commentModel = mongoose.model('comment', commentS);
module.exports = commentModel;