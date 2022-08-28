"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  guestId: {
    type: String,
    required: false
  }
});
module.exports = mongoose.model("Orders", orderSchema);