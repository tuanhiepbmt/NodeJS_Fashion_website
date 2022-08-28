"use strict";

var _express = _interopRequireDefault(require("./core/express"));

var _logger = _interopRequireDefault(require("./core/logger"));

var _config = _interopRequireDefault(require("./utils/config"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* Database */
// const connectionString =
//   `mongodb://${config.mongodb.username}:${encodeURIComponent(config.mongodb.password)}@${config.mongodb.host}/${config.mongodb.database}?authSource=admin&authMechanism=SCRAM-SHA-1&ssl=false`
// mongoose.Promise = Promise;
// mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connection.on('error', (error) => {
//   if (error) throw error;
// });
var dbConn = require("./lib/db");

_express["default"].listen(_config["default"].port, function () {
  _logger["default"].info("\uD83D\uDE80\uD83D\uDE80\uD83D\uDE80 Listening on port ".concat(_config["default"].port, "..."));
});