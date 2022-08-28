const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  guestId: {
    type: String,
    required: false
  },
});

module.exports = mongoose.model("Orders", orderSchema);