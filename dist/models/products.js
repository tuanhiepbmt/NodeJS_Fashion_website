"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var productsS = new Schema({
  productCategory: {
    type: String,
    required: true
  },
  productGtin: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productSize: {
    type: Array,
    require: true
  },
  productType: {
    type: String,
    required: true
  },
  productMaterial: {
    type: String,
    required: true
  },
  productTags: {
    type: Array,
    required: true
  },
  productOrigin: {
    type: String,
    required: true
  },
  productImage: {
    type: Array,
    required: false
  },
  productPurchases: {
    type: Number,
    required: false
  },
  productStock: {
    type: Number,
    required: false
  },
  productAddedDate: {
    type: String,
    required: false
  },
  productDesc: {
    type: Array,
    required: false
  },
  productPrice: {
    type: Number,
    required: false
  }
}, {
  collection: 'products',
  versionKey: false
});
var productsModel = mongoose.model('products', productsS);
module.exports = productsModel;