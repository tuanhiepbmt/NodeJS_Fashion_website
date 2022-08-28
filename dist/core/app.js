"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// #region add database
// #endregion
// #region express
var app = (0, _express["default"])();
/* view engine */

app.set('views', _path["default"].join(__dirname, 'views'));
app.use(_express["default"]["static"](_path["default"].join(__dirname, 'public')));
app.set('view engine', 'ejs');
/* config express */

app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use((0, _cookieParser["default"])()); // #endregion

var _default = app;
exports["default"] = _default;