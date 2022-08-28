"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _httpStatus = _interopRequireDefault(require("http-status"));

var _ejsMate = _interopRequireDefault(require("ejs-mate"));

var _morgan = _interopRequireDefault(require("./morgan"));

var _logger = _interopRequireDefault(require("./logger"));

var _client = _interopRequireDefault(require("../routes/client"));

var _admin = _interopRequireDefault(require("../routes/admin"));

var _constants = _interopRequireDefault(require("../utils/constants"));

var _config = _interopRequireDefault(require("../utils/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();

var session = require('express-session');

app.use(session({
  secret: 'doraemon',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 99999999999999999999
  }
}));
/* view engine */

app.engine('ejs', _ejsMate["default"]);
app.set('views', _path["default"].join(__dirname, '../../src/views'));
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../../public')));
app.set('view engine', 'ejs');
/* config express */

app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use((0, _cookieParser["default"])());
/* logs */

app.use(_morgan["default"].successHandler);
app.use(_morgan["default"].errorHandler);
/* routes */

_client["default"].forEach(function (r) {
  if (_constants["default"].CLIENT_ROUTE.length === 1 && _constants["default"].CLIENT_ROUTE.includes('/')) app.use(r);else app.use(_constants["default"].CLIENT_ROUTE, r);
});

_admin["default"].forEach(function (r) {
  if (_constants["default"].ADMIN_ROUTE.length === 1 && _constants["default"].ADMIN_ROUTE.includes('/')) app.use(r);else app.use(_constants["default"].ADMIN_ROUTE, r);
});
/* handle exception */


app.use(function (error, request, response, next) {
  var statusCode = error.statusCode,
      message = error.message;
  message = "L\u1ED7i: ".concat(message);

  if (!_config["default"].isDev && !error.isOperational) {
    statusCode = _httpStatus["default"].INTERNAL_SERVER_ERROR;
    message = 'Lỗi hệ thống!';
  }

  _logger["default"].error(error);

  response.locals.errorMessage = error !== null && error !== void 0 && error.message ? "L\u1ED7i: ".concat(error.message) : 'Lỗi hệ thống!';
  response.render('common/error', {
    error: {
      statusCode: statusCode || _httpStatus["default"].INTERNAL_SERVER_ERROR,
      message: message
    }
  });
});
app.use(function (request, response, next) {
  response.render('common/error', {
    error: {
      statusCode: "404",
      message: 'Không tìm thấy trang!'
    }
  });
});
var _default = app;
exports["default"] = _default;