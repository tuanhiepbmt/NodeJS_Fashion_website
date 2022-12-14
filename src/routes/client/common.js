import { json } from 'body-parser';
import express, { response } from 'express';
import { now, SchemaType } from 'mongoose';
import { error } from 'winston';
var nodemailer = require('nodemailer');
const path = require('path');
var randomstring = require("randomstring");
const AccountModel = require('../../models/user')
const productsModel = require('../../models/products')
const commentModel = require('../../models/comment')
const OrdersModel = require('../../models/order')
const jwt = require('jsonwebtoken')
const commonRoutes = express.Router();
var cookieParser = require('cookie-parser')
commonRoutes.use(cookieParser())
const multer = require('multer');

//62
const imageStorage = multer.diskStorage({
  destination: './public/client/images/uploadAvatar',
  filename: (req, file, cb) => {
    cb(null, file.originalname + '_' + Date.now()
      + path.extname(file.originalname))
  }
});
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error('Please upload a Image'))
    }
    cb(undefined, true)
  }
})
//product
const imageStorageProduct = multer.diskStorage({
  destination: './public/client/images',
  filename: (req, file, cb) => {
    cb(null, file.originalname + '_' + Date.now()
      + path.extname(file.originalname))
  }
});
const imageUploadProduct = multer({
  storage: imageStorageProduct,
  limits: {
    fileSize: 10000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error('Please upload a Image'))
    }
    cb(undefined, true)
  }
})
const PAGE_SIZE = 4
// commonRoutes.get('/test', (req, res, next) => {
//   req.session.email=[{fsdaf:[{a:'fsad',b:'fasfsa'}],fdfsd:45},{fsad:45}]
//   res.json(req.session.email)
// })
// commonRoutes.get('/test1', (req, res, next) => {
//   req.session.email.push([{fsdaf:'fsd',fdfsd:14541},{fsad:9}])
//   res.json(req.session.email)
// })
// commonRoutes.get('/test1', (req, res, next) => {
//   req.session.email.push([{fsdaf:'fsd',fdfsd:14541},{fsad:9}])
//   res.json(req.session.email)
// })
function productRouter(category, link, type, req, res, user) {
  var page = req.query.page
  var sort = req.query.sort
  var popular = req.query.popular
  var priceBegin = req.query.priceBegin
  var priceEnd = req.query.priceEnd
  var material1 = req.query.material1
  var material2 = req.query.material2
  var material3 = req.query.material3
  if (material1) {
    var material = material1
  }
  if (material2) {
    var material = material2
  }
  if (material3) {
    var material = material3
  }
  var origin = req.query.origin
  if (!priceBegin) {
    priceBegin = 0
    priceEnd = 1000000
  }

  if (material && !origin) {
    if (!sort && !popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productCategory: category, productType: type })
        .then(data => {
          var string = ''
          if (material1 && material2 && material3) {
            string = '&material1=Cotton&material2=kaki&material3=Len'
          }
          else if (material1 && material2) {
            string = '&material1=Cotton&material2=kaki'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material2)
          }
          else if (material1 && material3) {
            string = '&material1=Cotton&material3=Len'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material3)
          }
          else if (material2 && material3) {
            string = '&material2=kaki&material3=Len'
            data = data.filter(element => element.productMaterial == material2 || element.productMaterial == material3)
          }
          else if (material1) {
            string = '&material1=Cotton'
            data = data.filter(element => element.productMaterial == material1)
          }
          else if (material2) {
            string = '&material2=kaki'
            data = data.filter(element => element.productMaterial == material2)
          }
          else if (material3) {
            string = '&material3=Len'
            data = data.filter(element => element.productMaterial == material3)
          }

          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/' + category, {
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '',
              isMaterial: string,
              isSort: 0,
              isPopular: 'no',
              link: link,
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3,
              user: user
            });
          }
          return res.render('client/common/' + category, {
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '',
            isMaterial: string,
            isSort: 0,
            isPopular: 'no',
            link: link,
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && sort) {
      console.log(1000)
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productCategory: category, productType: type })
        .then(data => {
          var string = ''
          if (material1 && material2 && material3) {
            string = '&material1=Cotton&material2=kaki&material3=Len'
          }
          else if (material1 && material2) {
            string = '&material1=Cotton&material2=kaki'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material2)
          }
          else if (material1 && material3) {
            string = '&material1=Cotton&material3=Len'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material3)
          }
          else if (material2 && material3) {
            string = '&material2=kaki&material3=Len'
            data = data.filter(element => element.productMaterial == material2 || element.productMaterial == material3)
          }
          else if (material1) {
            string = '&material1=Cotton'
            data = data.filter(element => element.productMaterial == material1)
          }
          else if (material2) {
            string = '&material2=kaki'
            data = data.filter(element => element.productMaterial == material2)
          }
          else if (material3) {
            string = '&material3=Len'
            data = data.filter(element => element.productMaterial == material3)
          }

          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.sort(function (a, b) {
            if (sort == -1) return b.productPrice - a.productPrice;
            else return a.productPrice - b.productPrice
          })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/' + category, {
              user: user,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '',
              isMaterial: string,
              isSort: req.query.sort,
              isPopular: 'no',
              link: link,
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/' + category, {
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '',
            isMaterial: string,
            isSort: req.query.sort,
            isPopular: 'no',
            link: link,
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && popular) {
      console.log(456)
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productCategory: category, productType: type })
        .then(data => {
          var string = ''
          if (material1 && material2 && material3) {
            string = '&material1=Cotton&material2=kaki&material3=Len'
          }
          else if (material1 && material2) {
            string = '&material1=Cotton&material2=kaki'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material2)
          }
          else if (material1 && material3) {
            string = '&material1=Cotton&material3=Len'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material3)
          }
          else if (material2 && material3) {
            string = '&material2=kaki&material3=Len'
            data = data.filter(element => element.productMaterial == material2 || element.productMaterial == material3)
          }
          else if (material1) {
            string = '&material1=Cotton'
            data = data.filter(element => element.productMaterial == material1)
          }
          else if (material2) {
            string = '&material2=kaki'
            data = data.filter(element => element.productMaterial == material2)
          }
          else if (material3) {
            string = '&material3=Len'
            data = data.filter(element => element.productMaterial == material3)
          }

          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.sort(function (a, b) {
            return b.productPurchases - a.productPurchases
          })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/' + category, {
              user: user,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '',
              isMaterial: string,
              isSort: 0,
              isPopular: 'yes',
              link: link,
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/' + category, {
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '',
            isMaterial: string,
            isSort: 0,
            isPopular: 'yes',
            link: link,
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else {
      res.redirect('/' + category + '-' + link + '?page=1')
    }
  }
  else if (!material && origin) {
    if (!sort && !popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productCategory: category, productType: type, productOrigin: origin })
        .then(data => {
          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/' + category, {
              user: user,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '&origin=' + req.query.origin,
              isMaterial: '',
              isSort: req.query.sort,
              isPopular: 'no',
              link: link,
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/' + category, {
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '&origin=' + req.query.origin,
            isMaterial: '',
            isSort: req.query.sort,
            isPopular: 'no',
            link: link,
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && sort) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productCategory: category, productType: type, productOrigin: origin })
        .then(data => {
          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd).sort(function (a, b) {
            if (sort == -1) return b.productPrice - a.productPrice;
            else return a.productPrice - b.productPrice
          })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/' + category, {
              user: user,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '&origin=' + req.query.origin,
              isMaterial: '',
              isSort: req.query.sort,
              isPopular: 'no',
              link: link,
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/' + category, {
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '&origin=' + req.query.origin,
            isMaterial: '',
            isSort: req.query.sort,
            isPopular: 'no',
            link: link,
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productCategory: category, productType: type, productOrigin: origin })
        .then(data => {
          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd).sort(function (a, b) {
            if (sort == -1) return b.productPrice - a.productPrice;
            else return a.productPrice - b.productPrice
          })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/' + category, {
              user: user,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '&origin=' + req.query.origin,
              isMaterial: '',
              isSort: 0,
              isPopular: 'yes',
              link: link,
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/' + category, {
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '&origin=' + req.query.origin,
            isMaterial: '',
            isSort: 0,
            isPopular: 'yes',
            link: link,
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else {
      res.redirect('/' + category + '-' + link + '?page=1')
    }
  }
  else if (material && origin) {
    if (!sort && !popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productCategory: category, productType: type, productOrigin: origin })
        .then(data => {
          var string = ''
          if (material1 && material2 && material3) {
            string = '&material1=Cotton&material2=kaki&material3=Len'
          }
          else if (material1 && material2) {
            string = '&material1=Cotton&material2=kaki'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material2)
          }
          else if (material1 && material3) {
            string = '&material1=Cotton&material3=Len'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material3)
          }
          else if (material2 && material3) {
            string = '&material2=kaki&material3=Len'
            data = data.filter(element => element.productMaterial == material2 || element.productMaterial == material3)
          }
          else if (material1) {
            string = '&material1=Cotton'
            data = data.filter(element => element.productMaterial == material1)
          }
          else if (material2) {
            string = '&material2=kaki'
            data = data.filter(element => element.productMaterial == material2)
          }
          else if (material3) {
            string = '&material3=Len'
            data = data.filter(element => element.productMaterial == material3)
          }

          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/' + category, {
              user: user,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '&origin=' + req.query.origin,
              isMaterial: string,
              isSort: 0,
              isPopular: 'no',
              link: link,
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            })
          }
          return res.render('client/common/' + category, {
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '&origin=' + req.query.origin,
            isMaterial: string,
            isSort: 0,
            isPopular: 'no',
            link: link,
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          })
        })
    }
    else if (page && sort) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productCategory: category, productType: type, productOrigin: origin })
        .then(data => {
          var string = ''
          if (material1 && material2 && material3) {
            string = '&material1=Cotton&material2=kaki&material3=Len'
          }
          else if (material1 && material2) {
            string = '&material1=Cotton&material2=kaki'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material2)
          }
          else if (material1 && material3) {
            string = '&material1=Cotton&material3=Len'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material3)
          }
          else if (material2 && material3) {
            string = '&material2=kaki&material3=Len'
            data = data.filter(element => element.productMaterial == material2 || element.productMaterial == material3)
          }
          else if (material1) {
            string = '&material1=Cotton'
            data = data.filter(element => element.productMaterial == material1)
          }
          else if (material2) {
            string = '&material2=kaki'
            data = data.filter(element => element.productMaterial == material2)
          }
          else if (material3) {
            string = '&material3=Len'
            data = data.filter(element => element.productMaterial == material3)
          }

          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd).sort(function (a, b) {
            if (sort == -1) return b.productPrice - a.productPrice;
            else return a.productPrice - b.productPrice
          })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/' + category, {
              user: user,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '&origin=' + req.query.origin,
              isMaterial: string,
              isSort: req.query.sort,
              isPopular: 'no',
              link: link,
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/' + category, {
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '&origin=' + req.query.origin,
            isMaterial: string,
            isSort: req.query.sort,
            isPopular: 'no',
            link: link,
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productCategory: category, productType: type, productOrigin: origin })
        .then(data => {
          var string = ''
          if (material1 && material2 && material3) {
            string = '&material1=Cotton&material2=kaki&material3=Len'
          }
          else if (material1 && material2) {
            string = '&material1=Cotton&material2=kaki'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material2)
          }
          else if (material1 && material3) {
            string = '&material1=Cotton&material3=Len'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material3)
          }
          else if (material2 && material3) {
            string = '&material2=kaki&material3=Len'
            data = data.filter(element => element.productMaterial == material2 || element.productMaterial == material3)
          }
          else if (material1) {
            string = '&material1=Cotton'
            data = data.filter(element => element.productMaterial == material1)
          }
          else if (material2) {
            string = '&material2=kaki'
            data = data.filter(element => element.productMaterial == material2)
          }
          else if (material3) {
            string = '&material3=Len'
            data = data.filter(element => element.productMaterial == material3)
          }

          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd).sort(function (a, b) { return b.productPurchases - a.productPurchases })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/' + category, {
              user: user,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '&origin=' + req.query.origin,
              isMaterial: string,
              isSort: 0,
              isPopular: 'yes',
              link: link,
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/' + category, {
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '&origin=' + req.query.origin,
            isMaterial: string,
            isSort: 0,
            isPopular: 'yes',
            link: link,
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else {
      res.redirect('/' + category + '-' + link + '?page=1')
    }
  }
  else {
    if (page && !sort && !popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productCategory: category, productType: type })
        .then(data => {
          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/' + category, {
              user: user,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '',
              isMaterial: '',
              isSort: 0,
              isPopular: 'no',
              link: link,
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/' + category, {
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '',
            isMaterial: '',
            isSort: 0,
            isPopular: 'no',
            link: link,
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && sort) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productCategory: category, productType: type })
        .then(data => {
          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd).sort(function (a, b) {
            if (sort == -1) return b.productPrice - a.productPrice;
            else return a.productPrice - b.productPrice
          })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/' + category, {
              user: user,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '',
              isMaterial: '',
              isSort: req.query.sort,
              isPopular: 'no',
              link: link,
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/' + category, {
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '',
            isMaterial: '',
            isSort: req.query.sort,
            isPopular: 'no',
            link: link,
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productCategory: category, productType: type })
        .then(data => {
          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd).sort(function (a, b) { return b.productPurchases - a.productPurchases })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/' + category, {
              user: user,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '',
              isMaterial: '',
              isSort: 0,
              isPopular: 'yes',
              link: link,
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/' + category, {
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '',
            isMaterial: '',
            isSort: 0,
            isPopular: 'yes',
            link: link,
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else {
      res.redirect('/' + category + '-' + link + '?page=1')
    }
  }
}
commonRoutes.put('/addCompare', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    return res.json('Vui l??ng ????ng nh???p')
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({
    _id: kq._id
  }).then(data => {
    var array = data[0].compare
    for (const key in array) {
      if (array[key].id_product == req.query.id) {
        return res.json('S???n ph???m t???n t???i')
      }
    }
    if (array.length >= 4) {
      return res.json('So s??nh ?????y')
    }
    productsModel.findOne({ _id: req.query.id })
      .then(product => {
        array.push({
          id_product: req.query.id,
          productGtin: product.productGtin,
          productName: product.productName,
          productMaterial: product.productMaterial,
          productPrice: product.productPrice,
          productTags: product.productTags,
          productOrigin: product.productOrigin,
          productImage: product.productImage,
          productPurchases: product.productPurchases,
          productCategory: product.productCategory
        })
        AccountModel.updateOne({
          _id: kq._id
        }, {
          compare: array
        })
          .then(dataUpdate => {
            if (dataUpdate) {
              res.json('???? th??m')
            }
            else
              res.json('Th???t b???i')
          })
      })

  })
})
commonRoutes.delete('/removeCompare', (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.findOne({
    _id: kq._id
  }).then(data => {
    var arr = data.compare.filter(element => element.id_product != req.query.id)
    AccountModel.updateOne({ _id: kq._id }, {
      compare: arr
    }).then(data => {
      if (data)
        res.json('Th??nh c??ng')
      else
        res.json('Th???t b???i')
    }).catch(err => {
      res.json(err)
    })
  })
})
commonRoutes.get('/compare', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    res.render('client/common/login')
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.findOne({
    _id: kq._id
  }).then(data => {
    res.render('client/common/compare', { compare: data.compare, user: data })
  })
})
commonRoutes.get('/wishlist', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    res.redirect('login')
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.findOne({
    _id: kq._id
  }).then(data => {
    res.render('client/common/wishlist', { user: data, wishlist: data.wishlist })
  })
})
commonRoutes.put('/addWishlist', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    return res.json('Vui l??ng ????ng nh???p')
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({
    _id: kq._id
  }).then(data => {
    var array = data[0].wishlist
    for (const key in array) {
      if (array[key].id_product == req.query.id) {
        return res.json('S???n ph???m t???n t???i')
      }
    }
    productsModel.findOne({ _id: req.query.id })
      .then(product => {
        array.push({
          id_product: req.query.id,
          productGtin: product.productGtin,
          productName: product.productName,
          productPrice: product.productPrice,
          productImage: product.productImage,
        })
        AccountModel.updateOne({
          _id: kq._id
        }, {
          wishlist: array
        })
          .then(dataUpdate => {
            if (dataUpdate) {
              res.json('???? th??m')
            }
            else
              res.json('Th???t b???i')
          })
      })

  })
})
commonRoutes.delete('/removeWishlist', (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.findOne({
    _id: kq._id
  }).then(data => {
    var arr = data.wishlist.filter(element => element.id_product != req.query.id)
    AccountModel.updateOne({ _id: kq._id }, {
      wishlist: arr
    }).then(data => {
      if (data)
        res.json('Th??nh c??ng')
      else
        res.json('Th???t b???i')
    }).catch(err => {
      res.json(err)
    })
  })
})
commonRoutes.get('/women-dress', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
    }
    productRouter('women', 'dress', '?????m v?? V??y', req, res ,req.session.user)
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({
    _id: kq._id
  }).then(data => {
    productRouter('women', 'dress', '?????m v?? V??y', req, res, data[0])
  })
});
commonRoutes.get('/women-shirt', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
    }
    productRouter('women', 'shirt', '??o', req, res,req.session.user)
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({
    _id: kq._id
  }).then(data => {
    productRouter('women', 'shirt', '??o', req, res, data[0])
  })
});
commonRoutes.get('/women-trouser', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
    }
    productRouter('women', 'trouser', 'Qu???n', req, res,req.session.user)
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({
    _id: kq._id
  }).then(data => {
    productRouter('women', 'trouser', 'Qu???n', req, res, data[0])
  })
});
commonRoutes.get('/men-shirt', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
    }
    productRouter('men', 'shirt', '??o', req, res,req.session.user)
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({
    _id: kq._id
  }).then(data => {
    productRouter('men', 'shirt', '??o', req, res, data[0])
  })

});
commonRoutes.get('/men-trouser', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
    }
    productRouter('men', 'trouser', 'Qu???n', req, res,req.session.user)
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({
    _id: kq._id
  }).then(data => {
    productRouter('men', 'trouser', 'Qu???n', req, res, data[0])
  })
});
commonRoutes.get('/men-cap', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
    }
    productRouter('men', 'cap', 'M??', req, res,req.session.user)
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({
    _id: kq._id
  }).then(data => {
    productRouter('men', 'cap', 'M??', req, res, data[0])
  })
});
function productSearch(req, res, user) {
  var page = req.query.page
  var sort = req.query.sort
  var popular = req.query.popular
  var priceBegin = req.query.priceBegin
  var priceEnd = req.query.priceEnd
  var material1 = req.query.material1
  var material2 = req.query.material2
  var material3 = req.query.material3
  var word = req.query.word
  word = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D');
  if (material1) {
    var material = material1
  }
  if (material2) {
    var material = material2
  }
  if (material3) {
    var material = material3
  }
  var origin = req.query.origin
  if (!priceBegin) {
    priceBegin = 0
    priceEnd = 1000000
  }
  if (material && !origin) {
    if (!sort && !popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({})
        .then(data => {
          var string = ''
          if (material1 && material2 && material3) {
            string = '&material1=Cotton&material2=kaki&material3=Len'
          }
          else if (material1 && material2) {
            string = '&material1=Cotton&material2=kaki'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material2)
          }
          else if (material1 && material3) {
            string = '&material1=Cotton&material3=Len'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material3)
          }
          else if (material2 && material3) {
            string = '&material2=kaki&material3=Len'
            data = data.filter(element => element.productMaterial == material2 || element.productMaterial == material3)
          }
          else if (material1) {
            string = '&material1=Cotton'
            data = data.filter(element => element.productMaterial == material1)
          }
          else if (material2) {
            string = '&material2=kaki'
            data = data.filter(element => element.productMaterial == material2)
          }
          else if (material3) {
            string = '&material3=Len'
            data = data.filter(element => element.productMaterial == material3)
          }

          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.filter(element => element.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D').indexOf(word) > -1)
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/search', {
              user: user,
              word: req.query.word,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '',
              isMaterial: string,
              isSort: 0,
              isPopular: 'no',
              link: 'search',
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/search', {
            word: req.query.word,
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '',
            isMaterial: string,
            isSort: 0,
            isPopular: 'no',
            link: 'search',
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && sort) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({})
        .then(data => {
          var string = ''
          if (material1 && material2 && material3) {
            string = '&material1=Cotton&material2=kaki&material3=Len'
          }
          else if (material1 && material2) {
            string = '&material1=Cotton&material2=kaki'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material2)
          }
          else if (material1 && material3) {
            string = '&material1=Cotton&material3=Len'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material3)
          }
          else if (material2 && material3) {
            string = '&material2=kaki&material3=Len'
            data = data.filter(element => element.productMaterial == material2 || element.productMaterial == material3)
          }
          else if (material1) {
            string = '&material1=Cotton'
            data = data.filter(element => element.productMaterial == material1)
          }
          else if (material2) {
            string = '&material2=kaki'
            data = data.filter(element => element.productMaterial == material2)
          }
          else if (material3) {
            string = '&material3=Len'
            data = data.filter(element => element.productMaterial == material3)
          }

          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.filter(element => element.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D').indexOf(word) > -1)
          temp2 = temp2.sort(function (a, b) {
            if (sort == -1) return b.productPrice - a.productPrice;
            else return a.productPrice - b.productPrice
          })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/search', {
              user: user,
              word: req.query.word,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '',
              isMaterial: string,
              isSort: req.query.sort,
              isPopular: 'no',
              link: 'search',
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/search', {
            word: req.query.word,
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '',
            isMaterial: string,
            isSort: req.query.sort,
            isPopular: 'no',
            link: 'search',
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({})
        .then(data => {
          var string = ''
          if (material1 && material2 && material3) {
            string = '&material1=Cotton&material2=kaki&material3=Len'
          }
          else if (material1 && material2) {
            string = '&material1=Cotton&material2=kaki'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material2)
          }
          else if (material1 && material3) {
            string = '&material1=Cotton&material3=Len'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material3)
          }
          else if (material2 && material3) {
            string = '&material2=kaki&material3=Len'
            data = data.filter(element => element.productMaterial == material2 || element.productMaterial == material3)
          }
          else if (material1) {
            string = '&material1=Cotton'
            data = data.filter(element => element.productMaterial == material1)
          }
          else if (material2) {
            string = '&material2=kaki'
            data = data.filter(element => element.productMaterial == material2)
          }
          else if (material3) {
            string = '&material3=Len'
            data = data.filter(element => element.productMaterial == material3)
          }

          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.filter(element => element.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D').indexOf(word) > -1)
          temp2 = temp2.sort(function (a, b) {
            return b.productPurchases - a.productPurchases
          })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/search', {
              user: user,
              word: req.query.word,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '',
              isMaterial: string,
              isSort: 0,
              isPopular: 'yes',
              link: 'search',
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/search', {
            word: req.query.word,
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '',
            isMaterial: string,
            isSort: 0,
            isPopular: 'yes',
            link: 'search',
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else {
      res.redirect('/search?page=1&word= ')
    }
  }
  else if (!material && origin) {
    if (!sort && !popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productOrigin: origin })
        .then(data => {
          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.filter(element => element.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D').indexOf(word) > -1)
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/search', {
              user: user,
              word: req.query.word,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '&origin=' + req.query.origin,
              isMaterial: '',
              isSort: req.query.sort,
              isPopular: 'no',
              link: 'search',
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/search', {
            word: req.query.word,
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '&origin=' + req.query.origin,
            isMaterial: '',
            isSort: req.query.sort,
            isPopular: 'no',
            link: 'search',
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && sort) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productOrigin: origin })
        .then(data => {
          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.filter(element => element.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D').indexOf(word) > -1)
          temp2 = temp2.sort(function (a, b) {
            if (sort == -1) return b.productPrice - a.productPrice;
            else return a.productPrice - b.productPrice
          })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/search', {
              user: user,
              word: req.query.word,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '&origin=' + req.query.origin,
              isMaterial: '',
              isSort: req.query.sort,
              isPopular: 'no',
              link: 'search',
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/search', {
            word: req.query.word,
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '&origin=' + req.query.origin,
            isMaterial: '',
            isSort: req.query.sort,
            isPopular: 'no',
            link: 'search',
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productOrigin: origin })
        .then(data => {
          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.filter(element => element.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D').indexOf(word) > -1)
          temp2 = temp2.sort(function (a, b) {
            if (sort == -1) return b.productPrice - a.productPrice;
            else return a.productPrice - b.productPrice
          })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/search', {
              user: user,
              word: req.query.word,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '&origin=' + req.query.origin,
              isMaterial: '',
              isSort: 0,
              isPopular: 'yes',
              link: 'search',
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/search', {
            word: req.query.word,
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '&origin=' + req.query.origin,
            isMaterial: '',
            isSort: 0,
            isPopular: 'yes',
            link: 'search',
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else {
      res.redirect('/search?page=1&word= ')
    }
  }
  else if (material && origin) {
    if (!sort && !popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productOrigin: origin })
        .then(data => {
          var string = ''
          if (material1 && material2 && material3) {
            string = '&material1=Cotton&material2=kaki&material3=Len'
          }
          else if (material1 && material2) {
            string = '&material1=Cotton&material2=kaki'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material2)
          }
          else if (material1 && material3) {
            string = '&material1=Cotton&material3=Len'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material3)
          }
          else if (material2 && material3) {
            string = '&material2=kaki&material3=Len'
            data = data.filter(element => element.productMaterial == material2 || element.productMaterial == material3)
          }
          else if (material1) {
            string = '&material1=Cotton'
            data = data.filter(element => element.productMaterial == material1)
          }
          else if (material2) {
            string = '&material2=kaki'
            data = data.filter(element => element.productMaterial == material2)
          }
          else if (material3) {
            string = '&material3=Len'
            data = data.filter(element => element.productMaterial == material3)
          }

          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.filter(element => element.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D').indexOf(word) > -1)
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/search', {
              user: user,
              word: req.query.word,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '&origin=' + req.query.origin,
              isMaterial: string,
              isSort: 0,
              isPopular: 'no',
              link: 'search',
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            })
          }
          return res.render('client/common/search', {
            word: req.query.word,
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '&origin=' + req.query.origin,
            isMaterial: string,
            isSort: 0,
            isPopular: 'no',
            link: 'search',
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          })
        })
    }
    else if (page && sort) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productOrigin: origin })
        .then(data => {
          var string = ''
          if (material1 && material2 && material3) {
            string = '&material1=Cotton&material2=kaki&material3=Len'
          }
          else if (material1 && material2) {
            string = '&material1=Cotton&material2=kaki'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material2)
          }
          else if (material1 && material3) {
            string = '&material1=Cotton&material3=Len'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material3)
          }
          else if (material2 && material3) {
            string = '&material2=kaki&material3=Len'
            data = data.filter(element => element.productMaterial == material2 || element.productMaterial == material3)
          }
          else if (material1) {
            string = '&material1=Cotton'
            data = data.filter(element => element.productMaterial == material1)
          }
          else if (material2) {
            string = '&material2=kaki'
            data = data.filter(element => element.productMaterial == material2)
          }
          else if (material3) {
            string = '&material3=Len'
            data = data.filter(element => element.productMaterial == material3)
          }

          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.filter(element => element.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D').indexOf(word) > -1)
          temp2 = temp2.sort(function (a, b) {
            if (sort == -1) return b.productPrice - a.productPrice;
            else return a.productPrice - b.productPrice
          })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/search', {
              user: user,
              word: req.query.word,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '&origin=' + req.query.origin,
              isMaterial: string,
              isSort: req.query.sort,
              isPopular: 'no',
              link: 'search',
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/search', {
            word: req.query.word,
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '&origin=' + req.query.origin,
            isMaterial: string,
            isSort: req.query.sort,
            isPopular: 'no',
            link: 'search',
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({ productOrigin: origin })
        .then(data => {
          var string = ''
          if (material1 && material2 && material3) {
            string = '&material1=Cotton&material2=kaki&material3=Len'
          }
          else if (material1 && material2) {
            string = '&material1=Cotton&material2=kaki'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material2)
          }
          else if (material1 && material3) {
            string = '&material1=Cotton&material3=Len'
            data = data.filter(element => element.productMaterial == material1 || element.productMaterial == material3)
          }
          else if (material2 && material3) {
            string = '&material2=kaki&material3=Len'
            data = data.filter(element => element.productMaterial == material2 || element.productMaterial == material3)
          }
          else if (material1) {
            string = '&material1=Cotton'
            data = data.filter(element => element.productMaterial == material1)
          }
          else if (material2) {
            string = '&material2=kaki'
            data = data.filter(element => element.productMaterial == material2)
          }
          else if (material3) {
            string = '&material3=Len'
            data = data.filter(element => element.productMaterial == material3)
          }

          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.filter(element => element.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D').indexOf(word) > -1)
          temp2 = temp2.sort(function (a, b) { return b.productPurchases - a.productPurchases })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/search', {
              user: user,
              isPriceBegin: priceBegin,
              word: req.query.word,
              isPriceEnd: priceEnd,
              isOrigin: '&origin=' + req.query.origin,
              isMaterial: string,
              isSort: 0,
              isPopular: 'yes',
              link: 'search',
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/search', {
            isPriceBegin: priceBegin,
            word: req.query.word,
            isPriceEnd: priceEnd,
            isOrigin: '&origin=' + req.query.origin,
            isMaterial: string,
            isSort: 0,
            isPopular: 'yes',
            link: 'search',
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else {
      res.redirect('/search?page=1&word= ')
    }
  }
  else {
    if (page && !sort && !popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({})
        .then(data => {
          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.filter(element => element.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D').indexOf(word) > -1)
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/search', {
              user: user,
              word: req.query.word,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '',
              isMaterial: '',
              isSort: 0,
              isPopular: 'no',
              link: "search",
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/search', {
            word: req.query.word,
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '',
            isMaterial: '',
            isSort: 0,
            isPopular: 'no',
            link: "search",
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && sort) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({})
        .then(data => {
          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.filter(element => element.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D').indexOf(word) > -1)
          temp2 = temp2.sort(function (a, b) {
            if (sort == -1) return b.productPrice - a.productPrice;
            else return a.productPrice - b.productPrice
          })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/search', {
              user: user,
              word: req.query.word,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '',
              isMaterial: '',
              isSort: req.query.sort,
              isPopular: 'no',
              link: 'search',
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/search', {
            word: req.query.word,
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '',
            isMaterial: '',
            isSort: req.query.sort,
            isPopular: 'no',
            link: 'search',
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else if (page && popular) {
      page = parseInt(page)
      var skip = (page - 1) * PAGE_SIZE
      productsModel.find({})
        .then(data => {
          var temp = data.filter(element => element.productPrice >= priceBegin)
          var temp2 = temp.filter(element => element.productPrice <= priceEnd)
          temp2 = temp2.filter(element => element.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/??/g, 'd').replace(/??/g, 'D').indexOf(word) > -1)
          temp2 = temp2.sort(function (a, b) { return b.productPurchases - a.productPurchases })
          var temp3 = temp2.slice(skip, skip + PAGE_SIZE)
          if (user) {
            return res.render('client/common/search', {
              user: user,
              word: req.query.word,
              isPriceBegin: priceBegin,
              isPriceEnd: priceEnd,
              isOrigin: '',
              isMaterial: '',
              isSort: 0,
              isPopular: 'yes',
              link: 'search',
              total: Math.ceil(temp2.length / PAGE_SIZE),
              page: page,
              products: temp3
            });
          }
          return res.render('client/common/search', {
            word: req.query.word,
            isPriceBegin: priceBegin,
            isPriceEnd: priceEnd,
            isOrigin: '',
            isMaterial: '',
            isSort: 0,
            isPopular: 'yes',
            link: 'search',
            total: Math.ceil(temp2.length / PAGE_SIZE),
            page: page,
            products: temp3
          });
        })
    }
    else {
      res.redirect('/search?page=1&word= ')
    }
  }
}
commonRoutes.get('/search', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
    }
    productSearch(req, res,req.session.user)
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({
    _id: kq._id
  }).then(data => {
    productSearch(req, res, data[0])
  })
});
commonRoutes.get('/product', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view:[]
      }
    }
    productsModel.findOne({ _id: req.query.id })
      .then(productk => {
        if (productk) {
          var view = req.session.user.view
          var arr = view.filter(element => element.id_product == req.query.id)
          if (arr == '') {
            view.push({
              id_product: req.query.id,
              productGtin: productk.productGtin,
              count: 1,
              productName: productk.productName,
              productImage: productk.productImage[0],
              productPrice: productk.productPrice,
            })
            req.session.user.view=view
            productsModel.find({})
              .then(all => {
                var arrall = all.filter(function (item) {
                  return item._id != req.query.id
                })
                arrall.length=7
                commentModel.find({productId:req.query.id})
                .sort( { date: -1 } )
                .then(comment=>
                {
                  res.render('client/common/product', { comment:comment,products: productk, allProducts: arrall, user: req.session.user })
                })
              })
          }
          else {
            var arrUpdate = view.filter(element => element.id_product != req.query.id)
            var count = arr[0].count + 1
            arrUpdate.push({
              id_product: arr[0].id_product,
              productGtin: productk.productGtin,
              count: count,
              productName: productk.productName,
              productImage: productk.productImage[0],
              productPrice: productk.productPrice,
            })
            req.session.user.view=arrUpdate
            productsModel.find({})
              .then(all => {
                var arrall = all.filter(function (item) {
                  return item._id != req.query.id
                })
                arrall.length=7
                commentModel.find({productId:req.query.id})
                .sort( { date: -1 } )
                .then(comment=>
                {
                res.render('client/common/product', {comment:comment, products: productk, allProducts: arrall, user: req.session.user })
                })
              })
          }
        }
      })
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({
    _id: kq._id
  }).then(data => {
    productsModel.findOne({ _id: req.query.id })
      .then(productk => {
        if (productk) {
          // res.json(data[0])
          var view = data[0].view
          var arr = view.filter(element => element.id_product == req.query.id)
          if (arr == '') {
            view.push({
              id_product: req.query.id,
              productGtin: productk.productGtin,
              count: 1,
              productName: productk.productName,
              productImage: productk.productImage[0],
              productPrice: productk.productPrice,
            })
            AccountModel.updateOne({ _id: kq._id }, {
              view: view
            })
              .then(data => {
                if (data) {
                  next()
                }
              })
          }
          else {
            var arrUpdate = view.filter(element => element.id_product != req.query.id)
            var count = arr[0].count + 1
            arrUpdate.push({
              id_product: arr[0].id_product,
              productGtin: productk.productGtin,
              count: count,
              productName: productk.productName,
              productImage: productk.productImage[0],
              productPrice: productk.productPrice,
            })
            AccountModel.updateOne({ _id: kq._id }, {
              view: arrUpdate
            })
              .then(data => {
                if (data) {
                  next()
                }
              })
          }
        }
      })
  })
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({ _id: kq._id })
    .then(data => {
      productsModel.find({ _id: req.query.id })
        .then(product => {
          productsModel.find({})
            .then(all => {
              var arr = all.filter(function (item) {
                return item._id != req.query.id
              })
              arr.length=7
              commentModel.find({productId:req.query.id})
              .sort( { date: -1 } )
                .then(comment=>
                {
                  res.render('client/common/product', {comment:comment, products: product[0], allProducts: arr, user: data[0] })
                }
                )
            })
        })
    })
})
commonRoutes.put('/addCart', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
      productsModel.findOne({ _id: req.query.id })
        .then(product => {
          req.session.user.cart.push({
            id_product: req.query.id,
            productGtin: product.productGtin,
            productName: product.productName,
            productPrice: product.productPrice,
            productImage: product.productImage,
            size: req.query.size,
            quantity: req.query.quantity
          })
          return res.json({ mess: '???? th??m', sess: req.session.user })
        })
    } else {
      var array = req.session.user.cart
      for (const key in array) {
        if (array[key].id_product == req.query.id) {
          var quantity = parseInt(array[key].quantity) + parseInt(req.query.quantity)
          array[key].quantity = quantity

          req.session.user.cart = array
          return res.json({ mess: 'S???n ph???m t???n t???i', sess: req.session.user })
        }
      }
      productsModel.findOne({ _id: req.query.id })
        .then(product => {
          req.session.user.cart.push({
            id_product: req.query.id,
            productGtin: product.productGtin,
            productName: product.productName,
            productPrice: product.productPrice,
            productImage: product.productImage,
            size: req.query.size,
            quantity: req.query.quantity
          })
          return res.json({ mess: '???? th??m', sess: req.session.user })
        })
    }
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({
    _id: kq._id
  }).then(data => {
    var array = data[0].cart
    for (const key in array) {
      if (array[key].id_product == req.query.id) {
        var quantity = parseInt(array[key].quantity) + parseInt(req.query.quantity)
        array[key].quantity = quantity

        AccountModel.updateOne({
          _id: kq._id
        }, {
          cart: array
        }).then(data => {
        })
        return res.json({mess:'S???n ph???m t???n t???i'})
        break
      }
    }
    productsModel.findOne({ _id: req.query.id })
      .then(product => {
        array.push({
          id_product: req.query.id,
          productGtin: product.productGtin,
          productName: product.productName,
          productPrice: product.productPrice,
          productImage: product.productImage,
          size: req.query.size,
          quantity: req.query.quantity
        })
        AccountModel.updateOne({
          _id: kq._id
        }, {
          cart: array
        })
          .then(dataUpdate => {
            if (dataUpdate) {
              res.json({mess:'???? th??m'})
            }
            else
              res.json({mess:'Th???t b???i'})
          })
      })

  })
})
commonRoutes.get('/cart', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user)
    {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
      return res.render('client/common/cart', { cart: req.session.user.cart,user: req.session.user})
    }
    else
      return res.render('client/common/cart', { cart: req.session.user.cart,user: req.session.user })
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.findOne({
    _id: kq._id
  }).then(data => {
    res.render('client/common/cart', { cart: data.cart, user: data })
  })
})
commonRoutes.delete('/removeCart', (req, res, next) => {
  var id = req.query.id
  if (id) {
    next()
  }
  else {
    if(req.cookies.token)
    {
      var token = req.cookies.token
      var kq = jwt.verify(token, 'mk')
      var array = []
      AccountModel.updateOne({ _id: kq._id }, {
        cart: array
      }).then(data => {
        if (data)
          return res.json('Th??nh c??ng')
        else
          return res.json('Th???t b???i')
      }).catch(err => {
        res.json(err)
      })
    }
    else
    {
      if (!req.session.user) {
        req.session.user = {
          nameGuest: '',
          phoneNumber: '',
          address: '',
          cart: [],
          view: []
        }
      }
      req.session.user.cart=[]
      return res.json('Th??nh c??ng')
    }
  }
}, (req, res, next) => {
  if(!req.cookies.token)
  {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
    }
    var arr = req.session.user.cart.filter(function (item) {
      return item.id_product != req.query.id
    })
    req.session.user.cart=arr
    return res.json('Th??nh c??ng')
  }
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.findOne({ _id: kq._id })
    .then(data => {
      var arr = data.cart.filter(function (item) {
        return item.id_product != req.query.id
      })
      AccountModel.updateOne({
        _id: kq._id
      }, {
        cart: arr
      })
        .then(data => {
          if (data) {
            res.json('Th??nh c??ng')
          }
          else
            res.json('Th???t b???i')
        })
    })
});
commonRoutes.get('/', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
    }
    productsModel.find().then(function (products) {
      return res.render('client/common/home', { products: products,user:req.session.user })
    });
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.findOne({
    _id: kq._id
  }).then(data => {
    if(data)
    {
      productsModel.find().then(function (products) {
        return res.render('client/common/home', { user: data, products: products })
      });
    }
    else{
      if (!req.session.user) {
        req.session.user = {
          nameGuest: '',
          phoneNumber: '',
          address: '',
          cart: [],
          view: []
        }
      }
      productsModel.find().then(function (products) {
        return res.render('client/common/home', { products: products,user:req.session.user })
      });
    }
  })
});
/* indexDn */
commonRoutes.get('/home', function (req, res, next) {
  res.redirect('/')
});
//????ng nh???p
commonRoutes.get('/login', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
    }
    return res.render('client/common/login',{user:req.session.user})
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.findOne({
    _id: kq._id
  }).then(data => {
    if(data)
    {
      res.redirect('/');
    }
    else
    {
      if (!req.session.user) {
        req.session.user = {
          nameGuest: '',
          phoneNumber: '',
          address: '',
          cart: [],
          view: []
        }
      }
      return res.render('client/common/login',{user:req.session.user})
    }
  })
});
commonRoutes.get('/logout', (request, response, next) => {
  var token = jwt.sign(" ", 'mk')
  response.render('client/common/login');
});
commonRoutes.post('/sendEMail', (req, res, next) => {
  AccountModel.findOne({
    email: req.body.email
  })
    .then(data => {
      if (data) {
        if (!data.isAuth) {
          AccountModel.findOneAndDelete({ email: req.body.email })
            .then(data => {
              if (data) {
                next()
              }
            })
        }
        else if (data.isAuth) {
          return res.json({ message: 'Email n??y ???? c?? ng?????i s??? d???ng' })
        }
      } else {
        next()
      }

    })
}, (req, res, next) => {
  var otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'stuneed.shop@gmail.com',			//email ID
      pass: 'jlfjihyihyfbzjnz'				//Password 
    }
  });

  AccountModel.create({
    email: req.body.email,
    password: "",
    date: "",
    address: "",
    phoneNumber: "",
    sex: "",
    otp: otp,
    avatar: "default.png",
    cart: [],
    compare: [],
    wishlist: [],
    isAuth: false
  })
    .then(data => {
      if (data) {
        function sendMail(email, otp) {
          var details = {
            from: 'stuneed.shop@gmail.com', // sender address same as above
            to: email, 					// Receiver's email id
            subject: 'X??c th???c Email Stuneed ', // Subject of the mail.
            html: "<h3>M?? OTP c???a b???n l?? </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"					// Sending OTP 
          }
          transporter.sendMail(details, function (error, data) {
            if (error) {
              console.log(error);
              return res.json({
                message: 'Th???t B???i'
              })
            }
            else
              return res.json({
                data: data,
                message: 'Th??nh c??ng',
                otp: otp
              })
          });
        }
        var email = req.body.email;
        sendMail(email, otp);
      }
      else
        res.json("ngu")
    })
});
commonRoutes.post('/change-email', function (req, res, next) {
  AccountModel.findOne({
    email: req.body.email
  })
    .then(data => {
      if (data) {
        var otp = data.otp
        if (req.body.emailNew == undefined) {
          if (otp == req.body.otp)
            return res.json('otp ch??nh x??c!')
          else
            return res.json('otp kh??ng ????ng!')
        }
        else if (otp == req.body.otp) {
          AccountModel.updateOne({ email: req.body.email }, {
            email: req.body.emailNew
          }).then(data => {
            if (data)
              res.json('Th??nh c??ng')
            else
              res.json('Th???t b???i')
          }).catch(err => {
            res.json(err)
          })
        } else res.json('otp kh??ng ????ng!')
      }
    })
})
commonRoutes.post('/send-verify-email', function (req, res, next) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'stuneed.shop@gmail.com',			//email ID
      pass: 'vnt.lg123'				//Password 
    }
  });
  function sendMail(email, otp) {
    var details = {
      from: 'stuneed.shop@gmail.com', // sender address same as above
      to: email, 					// Receiver's email id
      subject: 'X??c th???c Email Stuneed ', // Subject of the mail.
      html: "<h3>M?? OTP c???a b???n l?? </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"					// Sending OTP 
    }
    transporter.sendMail(details, function (error, data) {
      if (error) {
        console.log(error);
        return res.json({
          message: 'Th???t B???i'
        })
      }
      else
        return res.json({
          data: data,
          message: 'Th??nh c??ng',
          otp: otp
        })
    });
  }
  var otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  if (req.body.emailOld) {
    var otp1 = otp.toString()
    AccountModel.updateOne({
      email: req.body.emailOld
    }, {
      otp: otp1
    }).then(data => {
      if (!req.body.email) {
        var emailOld = req.body.emailOld;
        sendMail(emailOld, otp);
        return res.json('???? g???i v??? email c??')
      }
      else {
        if (req.body.email == req.body.emailOld) {
          return res.json('B???n ??ang s??? d???ng email n??y!')
        } else {
          AccountModel.find({})
            .then(data => {
              if (data) {
                var temp = true
                data.forEach(element => {
                  if (element.email == req.body.email) {
                    temp = false
                    return res.json('Email ???? c?? ng?????i s??? d???ng!')
                  }
                })
                if (temp == true) {
                  var email = req.body.email;
                  sendMail(email, otp);
                  return res.json('???? g???i v??? email m???i')
                }
              }
              else
                return res.json('Th???t b???i')
            })
            .catch(err => {
              return res.json(err)
            })
        }
      }
    })
  }
})
commonRoutes.post('/verify-email', function (req, res, next) {
  var otp = req.body.otp
  var email = req.body.email
  if (otp == 'false') {
    AccountModel.findOne({ email: email })
      .then(user => {
        if (user) {
          if (user.isAuth == false) {
            var otp = Math.random();
            otp = otp * 1000000;
            otp = parseInt(otp);
            AccountModel.updateOne({ email: email }, {
              otp: otp
            })
              .then(data => {
                if (data)
                  return res.json('th??nh c??ng')
                else
                  return res.json('th???t b???i')
              })
          }
          else
            return res.json('x??a th??nh c??ng')
        }
        else
          return res.json('x??a th??nh c??ng')
      })
  }
  else if (otp == 'falseCreate') {
    AccountModel.findOne({ email: email })
      .then(user => {
        if (user) {
          AccountModel.findOneAndDelete({ email: email })
            .then(data => {
              if (data)
                return res.json('x??a th??nh c??ng')
              else
                return res.json('x??a th???t b???i')
            })
        }
        else
          return
      })
  }
  else {
    next()
  }
}, (req, res, next) => {
  var otp = req.body.otp
  var email = req.body.email

  AccountModel.findOne({
    email: email,
    otp: otp
  }).then(data => {
    if (data) {
      return res.json({
        message: 'M?? x??c nh???n ????ng'
      })
    }
    else
      res.json({ message: 'M?? x??c nh???n kh??ng ????ng' })
  })
})
commonRoutes.post('/login', function (req, res, next) {
  AccountModel.findOne({
    email: req.body.email
  })
    .then(data => {
      if (data) {
        if (!data.isAuth) {
          AccountModel.findOneAndDelete({ email: req.body.email })
            .then(data => {
              if (data) {
                next()
              }
            })
        }
        else {
          next()
        }
      } else {
        return res.json({
          message: 'Sai t??n ????ng nh???p ho???c m???t kh???u'
        });
      }
    })
}, (req, res, next) => {
  var email = req.body.email
  var password = req.body.password

  AccountModel.findOne({
    email: email,
    password: password
  })
    .then(data => {
      if (data) {
        var token = jwt.sign({
          _id: data._id
        }, 'mk')
        return res.json({
          data: data,
          message: "thanh cong",
          token: token
        })
      } else {
        return res.json({
          message: 'Sai t??n ????ng nh???p ho???c m???t kh???u'
        });
      }
    })
    .catch(err => {

      res.status(400).json('loi server');
    })
});
commonRoutes.get('/account', (req, res, next) => {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    return res.redirect('login')
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.find({
    _id: kq._id
  }).then(account => {
    OrdersModel.find({ userId: kq._id })
      .then(order => {
        return res.render('client/common/account', { user: account[0], order: order })
      })
  })
});
commonRoutes.put('/passingGuests', (req, res, next) => {
  if(!req.session.user)
  {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
    }
  }
  req.session.user.nameGuest=req.body.nameGuest
  req.session.user.phoneNumber=req.body.phoneNumber
  req.session.user.address=req.body.address
  return res.json('Th??nh C??ng')
})
commonRoutes.get('/test10', (req, res, next) => {
  return res.json(req.session)
})
commonRoutes.get('/passingGuests', (req, res, next) => {
  if (!req.session.user) {
    req.session.user = {
      nameGuest: '',
      phoneNumber: '',
      address: '',
      cart: [],
      view: []
    }
  }
  OrdersModel.find({ guestId: req.session.id })
    .then(order => {
      return res.render('client/common/passingGuests', { order: order ,user:req.session.user}) 
    })
});
commonRoutes.get('/paymentConfirm', (req, res, next) => {
  if (!req.session.user) {
    req.session.user = {
      nameGuest: '',
      phoneNumber: '',
      address: '',
      cart: [],
      view: []
    }
  }
  return res.render('client/common/paymentConfirm', { order: [] ,user:req.session.user})
});
commonRoutes.put('/account/editProfile', (req, res, next) => {
  try {
    var name = req.body.name
    if (req.body.name == '')
      name = 'user'
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    AccountModel.updateOne({ email: req.body.email }, {
      date: req.body.date,
      sex: req.body.sex,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      name: name,
    }).then((data) => {
      return res.json({
        message: "Th??nh C??ng"
      })
    })
      .catch((err) => res.json({
        message: "Th???t B???i"
      })
      )
    // return res.redirect('login')
  }

}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')

  AccountModel.find({
    _id: kq._id
  }).then(data => {
    if (data[0].password == req.body.password) {
      AccountModel.updateOne({ _id: kq._id }, {
        date: req.body.date,
        sex: req.body.sex,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        name: req.body.name,
      }).then((data) => {
        return res.json({
          message: "Th??nh C??ng"
        })
      })
        .catch((err) => res.json({
          message: "Th???t B???i"
        })
        )
    }
    else
      return res.json({ message: 'M???t kh???u sai!' })
  })
})
commonRoutes.post('/uploadAvatar', imageUpload.single('image'), (req, res) => {
  AccountModel.updateOne({ email: req.body.email }, {
    avatar: req.file.filename
  })
    .then(data => {
      if (data)
        return
      else res.json("th???t b???i")
    })
    .catch(err => {
      res.json("l???i")
    })
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})
commonRoutes.put('/account/newPassword', (req, res, next) => {
  AccountModel.find({
    email: req.body.email
  }).then(data => {
    if (data) {
      AccountModel.updateOne({ _id: data[0]._id }, {
        password: req.body.password,
        isAuth: true
      }).then((data) => {
        return res.json({
          message: "Th??nh C??ng"
        })
      })
        .catch((err) => res.json({
          message: "Th???t B???i"
        })
        )
    }
  })
})
commonRoutes.put('/account/changePassword', (req, res, next) => {
  AccountModel.find({
    email: req.body.email
  }).then(data => {
    if (req.body.nowPassword == data[0].password) {
      AccountModel.updateOne({ email: req.body.email }, {
        password: req.body.password
      })
        .then(data => {
          if (data)
            res.json({ message: 'Th??nh c??ng' })
          else
            res.json({ message: 'Th???t b???i' })
        })
        .catch(err => {
          res.json(err)
        })
    }
    else
      res.json({ message: 'M???t kh???u sai!' })
  })
})
commonRoutes.post('/send-otp-forgot', function (req, res, next) {
  AccountModel.findOne({ email: req.body.email })
    .then(data => {
      if (data) {
        if (data.isAuth)
          next()
        else if (!data.isAuth) {
          AccountModel.findOneAndDelete({ email: req.body.email })
            .then(data => {
              if (data)
                return res.json('Email ch??a ???????c ????ng k??')
              else
                return res.json('Th???t b???i')
            })
        }
      }
      else
        return res.json('Email ch??a ???????c ????ng k??')
    })
}, (req, res, next) => {
  var otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  var otp1 = otp.toString()
  AccountModel.updateOne({
    email: req.body.email
  }, {
    otp: otp1
  }).then(data => {
    if (data) {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'stuneed.shop@gmail.com',			//email ID
          pass: 'vnt.lg123'				//Password 
        }
      });
      function sendMail(email, otp) {
        var details = {
          from: 'stuneed.shop@gmail.com', // sender address same as above
          to: email, 					// Receiver's email id
          subject: 'X??c th???c Email Stuneed ', // Subject of the mail.
          html: "<h3>M?? OTP c???a b???n l?? </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"					// Sending OTP 
        }
        transporter.sendMail(details, function (error, data) {
          if (error) {
            return res.json({
              message: 'Th???t B???i'
            })
          }
          else
            return res.json({
              data: data,
              message: 'Th??nh c??ng',
              otp: otp
            })
        });
      }
      var email = req.body.email;
      sendMail(email, otp);
    }
    else res.json('Kh??ng th??nh c??ng')
  })
})
commonRoutes.post('/send-again', function (req, res, next) {
  var otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  var otp1 = otp.toString()
  AccountModel.updateOne({
    email: req.body.email
  }, {
    otp: otp1
  }).then(data => {
    if (data) {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'stuneed.shop@gmail.com',			//email ID
          pass: 'vnt.lg123'				//Password 
        }
      });
      function sendMail(email, otp) {
        var details = {
          from: 'stuneed.shop@gmail.com', // sender address same as above
          to: email, 					// Receiver's email id
          subject: 'X??c th???c Email Stuneed ', // Subject of the mail.
          html: "<h3>M?? OTP c???a b???n l?? </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"					// Sending OTP 
        }
        transporter.sendMail(details, function (error, data) {
          if (error) {
            return res.json({
              message: 'Th???t B???i'
            })
          }
          else
            return res.json({
              data: data,
              message: 'Th??nh c??ng',
              otp: otp
            })
        });
      }
      var email = req.body.email;
      sendMail(email, otp);
    }
    else res.json('Kh??ng th??nh c??ng')
  })
})
commonRoutes.post('/verify-otp-forgot', function (req, res, next) {
  AccountModel.findOne({ email: req.body.email })
    .then(data => {
      if (data) {
        if (data.otp == req.body.otp)
          return res.json('otp ????ng')
        else
          return res.json('otp sai')
      }
    })
})
commonRoutes.put('/order', function (req, res, next) {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    if (req.body.products == '') {
      return res.json('Gi??? h??ng tr???ng!')
    }
    else if (req.session.user.phoneNumber == "" || req.session.user.address == "" || req.session.user.nameGuest == '') {
      return res.json('Guest B???n c???p nh???p ????? th??ng tin bao g???m T??n, S??? ??i???n tho???i, ?????a ch???')
    }
    else {
      var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        var a = []
        var b = []
        productsModel.find({})
          .then(data => {
            req.body.products.forEach(element => {
              a = data.filter(array => array._id == element.id)
              b = b.concat(a)
            })
            var c = []
            var d = {}
            for (let index = 0; index < b.length; index++) {
              d = {
                productGtin: b[index].productGtin,
                productName: b[index].productName,
                productPrice: b[index].productPrice,
                productImage: b[index].productImage[0],
                size: req.body.products[index].size,
                quantity: req.body.products[index].quantity,
              }
              c = c.concat([d])
            }
            OrdersModel.create({
              guestId: req.session.id,
              name: req.session.user.nameGuest,
              address: req.session.user.address,
              phoneNumber: req.session.user.phoneNumber,
              status: '??ang ch??? x??c nh???n',
              date: dateTime,
              products: c
            }).then(data => {
              if (data) {
                res.json('Th??nh c??ng')
              }
              else {
                res.json('Th???t b???i')
              }
            })
          })
    }
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  AccountModel.findOne({ _id: kq._id })
    .then(account => {
      if (account) {
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        var a = []
        var b = []
        productsModel.find({})
          .then(data => {
            req.body.products.forEach(element => {
              a = data.filter(array => array._id == element.id)
              b = b.concat(a)
            })
            var c = []
            var d = {}
            for (let index = 0; index < b.length; index++) {
              d = {
                productGtin: b[index].productGtin,
                productName: b[index].productName,
                productPrice: b[index].productPrice,
                productImage: b[index].productImage[0],
                size: req.body.products[index].size,
                quantity: req.body.products[index].quantity,
              }
              c = c.concat([d])
            }
            OrdersModel.create({
              userId: kq._id,
              name: account.name,
              address: account.address,
              phoneNumber: account.phoneNumber,
              status: '??ang ch??? x??c nh???n',
              date: dateTime,
              products: c
            }).then(data => {
              if (data) {
                res.json('Th??nh c??ng')
              }
              else {
                res.json('Th???t b???i')
              }
            })
          })
      }
    })
})
commonRoutes.delete('/order', function (req, res, next) {
  OrdersModel.findOneAndDelete({ _id: req.body._id })
    .then(data => {
      if (data) {
        res.json('X??a th??nh c??ng')
      }
      else {
        res.json('Th???t b???i')
      }
    })
})
commonRoutes.put('/comment', function (req, res, next) {
  try {
    var token = req.cookies.token
    var kq = jwt.verify(token, 'mk')
    if (kq) {
      next()
    }
  } catch (error) {
    return res.json('Vui l??ng ????ng nh???p')
  }
}, (req, res, next) => {
  var token = req.cookies.token
  var kq = jwt.verify(token, 'mk')
  var today = new Date();
  var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;
  AccountModel.findOne({_id:kq._id,})
  .then(account=>{
    commentModel.create({
      userId:kq._id,
      productId:req.body.id,
      name:account.name,
      avatar:account.avatar,
      date: dateTime,
      star:req.body.star,
      comment: req.body.comment
    })
    .then(data=>{
      if(data)
      {
        res.json({message: 'Th??nh c??ng',id:data._id})
      }
      else
        res.json({message: 'Th???t b???i',id:data._id})
    })
  })
})
commonRoutes.delete('/removeReview', function (req, res, next) {
  commentModel.findOneAndDelete({_id:req.query.id})
  .then(data=>
  {
    if(data)
      res.json('Th??nh c??ng')
    else
      rea.json('Th???t b???i')
  })
})
const users = { id: 1, username: 'admin', password: '123456', email: 'nhom7@gmail.com' }
commonRoutes.get('/admin', (req, res, next) => {
  try {
    var token = req.cookies.tokenAdmin
    var kq = jwt.verify(token, 'admin')
    if (kq) {
      next()
    }
  } catch (error) {
    if (!req.session.user) {
      req.session.user = {
        nameGuest: '',
        phoneNumber: '',
        address: '',
        cart: [],
        view: []
      }
    }
    res.redirect('admin/login');
  }
}, (req, res, next) => {
  var token = req.cookies.tokenAdmin
  var kq = jwt.verify(token, 'admin')
  if(kq.id==users.id)
  {
    OrdersModel.find({status:"??ang ch??? x??c nh???n"})
    .then(orderWC=>{
      res.render('admin/index',{users:users,orderWC:orderWC});
    })
  }
})
commonRoutes.get('/admin/login', (req, res, next) => {
  if (!req.session.user) {
    req.session.user = {
      nameGuest: '',
      phoneNumber: '',
      address: '',
      cart: [],
      view: []
    }
  }
  try {
    var token = req.cookies.tokenAdmin
    var kq = jwt.verify(token, 'admin')
    if (kq) {
      next()
    }
  } catch (error) {
    res.render('admin/login');
  }
}, (req, res, next) => {
  var token = req.cookies.tokenAdmin
  var kq = jwt.verify(token, 'admin')
  if(kq.id==users.id)
  {
      res.redirect('/admin');
  }
})
commonRoutes.post('/admin/login', (req, res, next) => {
  var email = req.body.email
  var password = req.body.password
  if (users.email==email && users.password==password) {
    var token = jwt.sign({
      id: users.id
    }, 'admin')
    return res.json({
      message: "Th??nh c??ng",
      token: token
    })
  } else {
    return res.json({
      message: 'Sai t??n ????ng nh???p ho???c m???t kh???u'
    });
  }
});
commonRoutes.get('/admin/users', (req, res, next) => {
  AccountModel.find({isAmin:false})
  .then(users=>{
    OrdersModel.find({status:"??ang ch??? x??c nh???n"})
    .then(orderWC=>{
      res.render('admin/users',{users:users,orderWC:orderWC});
    })
  })
})
commonRoutes.put('/admin/changePassword', (req, res, next) => {
  AccountModel.findOneAndUpdate({_id:req.body.id},{password:req.body.password})
  .then(data=>{
      if(data){
          res.json('Th??nh c??ng')
      }
      else
          res.json('Th???t b???i')
  })
})
commonRoutes.delete('/admin/deleteUser', (req, res, next) => {
  AccountModel.findOneAndDelete({_id:req.body.id})
    .then(data=>{
        if(data){
            res.json('Th??nh c??ng')
        }
        else
            res.json('Th???t b???i')
    })
})
commonRoutes.get('/admin/orders', (req, res, next) => {
  OrdersModel.find({})
    .then(data=>{
        if(data){
          OrdersModel.find({status:"??ang ch??? x??c nh???n"})
            .then(orderWC=>{
              res.render('admin/order',{orders:data,users:users,orderWC:orderWC});
            })
        }
        else
        res.render('admin/order',{orderWC:[],orders:[]})
    })
})
commonRoutes.get('/admin/order1', (req, res, next) => {
  OrdersModel.find({status:"??ang ch??? x??c nh???n"})
    .then(data=>{
      if(data){
        OrdersModel.find({status:"??ang ch??? x??c nh???n"})
          .then(orderWC=>{
            res.render('admin/order',{orders:data,users:users,orderWC:orderWC});
          })
      }
      else
      res.render('admin/order',{orderWC:[],orders:[]})
    })
})
commonRoutes.get('/admin/order2', (req, res, next) => {
  OrdersModel.find({status:"??ang giao h??ng"})
    .then(data=>{
      if(data){
        OrdersModel.find({status:"??ang ch??? x??c nh???n"})
          .then(orderWC=>{
            res.render('admin/order',{orders:data,users:users,orderWC:orderWC});
          })
      }
      else
      res.render('admin/order',{orderWC:[],orders:[]})
    })
})
commonRoutes.get('/admin/order3', (req, res, next) => {
  OrdersModel.find({status:"???? giao h??ng"})
    .then(data=>{
      if(data){
        OrdersModel.find({status:"??ang ch??? x??c nh???n"})
          .then(orderWC=>{
            res.render('admin/order',{orders:data,users:users,orderWC:orderWC});
          })
      }
      else
      res.render('admin/order',{orderWC:[],orders:[]})
    })
})
commonRoutes.put('/admin/confirmOder', (req, res, next) => {
  OrdersModel.findOneAndUpdate({_id:req.body._id},{status:"??ang giao h??ng"})
    .then(data=>{
        if(data){
            res.json('X??c nh???n th??nh c??ng!')
        }
        else
          res.json('X??c nh???n th???t b???i!')
    })
})
commonRoutes.put('/admin/confirmBought', (req, res, next) => {
  var today = new Date();
  var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  OrdersModel.findOneAndUpdate({_id:req.body._id},{status:"???? giao h??ng",dateBuy:dateTime})
    .then(data=>{
        if(data){
            res.json('X??c nh???n th??nh c??ng!')
        }
        else
          res.json('X??c nh???n th???t b???i!')
    })
})
commonRoutes.get('/admin/products', (req, res, next) => {
  productsModel.find({})
  .then(data=>{
    OrdersModel.find({status:"??ang ch??? x??c nh???n"})
      .then(orderWC=>{
        res.render('admin/products',{users:users,orderWC:orderWC,products:data});
      })
  })
})
commonRoutes.get('/admin/update-product/:productGtin', (req, res, next) => {
  const productGtin = req.params.productGtin
  productsModel.findOne({ productGtin : productGtin })
  .then((product) => {
      if (product) {
        OrdersModel.find({status:"??ang ch??? x??c nh???n"})
        .then(orderWC=>{
          res.render('admin/update-product',{users:users,orderWC:orderWC,product:product});
        })
      }
      else {
          res.status(404).json({message: 'Khong tim thay san pham' })
      }
  });
})
commonRoutes.get('/admin/add-product', (req, res, next) => {
  OrdersModel.find({status:"??ang ch??? x??c nh???n"})
  .then(orderWC=>{
    res.render('admin/add-product',{users:users,orderWC:orderWC});
  })
})
commonRoutes.put('/admin/updateProduct/:productGtin', imageUploadProduct.array('images', 10), (req, res) => {
  var images=[]
  req.files.forEach(image => {
    images.push('client/images/'+image.filename)
  });
  productsModel.findOneAndUpdate({ productGtin: req.params.productGtin }, { 
    productName: req.body.productName, 
    productPrice: req.body.productPrice, 
    productStock:req.body.productStock,
    productCategory: req.body.productCategory, 
    productType: req.body.productType,
    productTags: req.body.productTags,
    productOrigin:req.body.productOrigin,
    productMaterial: req.body.productMaterial,
    productDesc: req.body.productDesc,
    productImage: images 
  })
    .then(data => {
      if (data)
        return res.send("th??nh c??ng")
      else res.send("th???t b???i")
    })
    .catch(err => {
      res.send("l???i")
    })
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})
commonRoutes.put('/admin/addProduct', imageUploadProduct.array('images', 10), (req, res) => {
  var today = new Date();
  var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  var images=[]
  req.files.forEach(image => {
    images.push('client/images/'+image.filename)
  });
  var productSize = req.body.productSize
  productSize=productSize.split(',');

  var productTags = req.body.productTags
  productTags=productTags.split(',');
  var productGtin = randomstring.generate({length: 6});
  productsModel.create({ 
    productName: req.body.productName, 
    productGtin: productGtin, 
    productPrice: req.body.productPrice, 
    productStock:req.body.productStock,
    productSize: productSize,
    productCategory: req.body.productCategory, 
    productType: req.body.productType,
    productTags: productTags,
    productAddedDate:dateTime,
    productPurchases: 0, 
    productOrigin:req.body.productOrigin,
    productMaterial: req.body.productMaterial,
    productDesc: [req.body.productDesc],
    productImage: images 
  })
    .then(data => {
      if (data)
        return res.send("th??nh c??ng")
      else res.send("th???t b???i")
    })
    .catch(err => {
      res.send("l???i")
    })
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})
commonRoutes.delete('/admin/delete-product/:productGtin', (req, res, next) => {
  productsModel.findOneAndDelete({productGtin:req.params.productGtin})
  .then(data=>{
    if(data)
      res.json('th??nh c??ng')
    else
      res.json('th???t b???i')
  })
})
commonRoutes.put('/addproduct', (req, res, next) => {
  var today = new Date();
  var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  var productSize = req.body.productSize
  productSize=productSize.split(',');

  var productTags = req.body.productTags
  productTags=productTags.split(',');
  var productGtin = randomstring.generate({length: 6});
  productsModel.create({ 
    productName: req.body.productName, 
    productGtin: productGtin, 
    productPrice: req.body.productPrice, 
    productStock:req.body.productStock,
    productSize: productSize,
    productCategory: req.body.productCategory, 
    productType: req.body.productType,
    productTags: productTags,
    productAddedDate:dateTime,
    productPurchases: 0, 
    productOrigin:req.body.productOrigin,
    productMaterial: req.body.productMaterial,
    productDesc: [req.body.productDesc],
    productImage: req.body.productImage
  })
    .then(data => {
      if (data)
        return res.send("th??nh c??ng")
      else res.send("th???t b???i")
    })
    .catch(err => {
      res.send("l???i")
    })
})

export default commonRoutes;