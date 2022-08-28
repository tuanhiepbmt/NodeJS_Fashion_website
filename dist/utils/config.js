"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config(_path["default"].join(__dirname, '../../.env'));

var config = {
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT || 3000,
  mongodb: {
    host: process.env.MONGODB_URL || 'localhost',
    port: process.env.MONGODB_PORT || 3306,
    username: process.env.MONGODB_USERNAME || 'admin',
    password: process.env.MONGODB_PASSWORD || 'admin'
  }
};
var _default = config;
exports["default"] = _default;