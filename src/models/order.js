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
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  status: {
      type: String,
      require: true,
  },
  date: {
    type: String,
    require: true,
  },
  dateBuy: {
    type: String,
    require: false,
    default:''
  },
  products: [
    {
      productGtin: {
        type: String
      },
      productName: {
        type: String
      },
      productPrice: {
        type: String
      },
      productImage: {
        type: String
      },
      size: {
        type: String
      },
      quantity: {
        type: Number
      }
    }
  ],

});

module.exports = mongoose.model("Orders", orderSchema);