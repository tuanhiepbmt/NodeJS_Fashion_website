const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const accountUserS = new Schema({
  isAdmin: {
    type: Boolean,
    required: false,
    default:"false"
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false
  },
  sex: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false,
    default:"user"
  },
  otp: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: false
  },
  cart: [
    {
      id_product: {
        type: String
      },
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
        type: Array
      },
      size: {
        type: String
      },
      quantity: {
        type: Number
      }
    }
  ],
  compare: [
    {
      id_product: {
        type: String
      },
      productGtin: {
        type: String
      },
      productName: {
        type: String
      },
      productMaterial: {
        type: String
      },
      productPrice: {
        type: String
      },
      productTags: {
        type: Array
      },
      productOrigin: {
        type: String
      },
      productImage: {
        type: Array
      },
      productPurchases: {
        type: Number
      },
      productCategory: {
        type: String
      }
    }
  ],
  wishlist: [
    {
      id_product: {
        type: String
      },
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
        type: Array
      }
    }
  ],
  view: [
    {
      id_product: {
        type: String
      },
      productGtin: {
        type: String
      },
      count: {
        type: Number
      },
      productName: {
        type: String
      },
      productImage: {
        type: Array
      },
      productPrice: {
        type: String
      }
    }
  ],
  isAuth: {
    type: Boolean,
    required: true
  }
},{
  collection: 'users',
  versionKey: false
});

const userModel = mongoose.model('accountUsers', accountUserS);
module.exports = userModel;