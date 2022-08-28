"use strict";

var util = require("util");

var multer = require("multer");

var _require = require("multer-gridfs-storage"),
    GridFsStorage = _require.GridFsStorage;

var dbConfig = require("../config/db");

var storage = new GridFsStorage({
  url: dbConfig.url + dbConfig.database,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  file: function file(req, _file) {
    var match = ["image/png", "image/jpeg", "image/jpg"];

    if (match.indexOf(_file.mimetype) === -1) {
      var filename = "".concat(Date.now(), "-bezkoder-").concat(_file.originalname);
      return filename;
    }

    return {
      bucketName: dbConfig.imgBucket,
      filename: "".concat(Date.now(), "-bezkoder-").concat(_file.originalname)
    };
  }
});
var uploadFiles = multer({
  storage: storage
}).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;