"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _morgan = _interopRequireDefault(require("morgan"));

var _logger = _interopRequireDefault(require("./logger"));

var _config = _interopRequireDefault(require("../utils/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_morgan["default"].token('message', function (req, res) {
  return res.locals.errorMessage || '';
});

var getIpFormat = function getIpFormat() {
  return "".concat(!_config["default"].isDev ? ':remote-addr - ' : '');
};

var successResponseFormat = "".concat(getIpFormat(), ":method :url :status - :response-time ms");
var errorResponseFormat = "".concat(getIpFormat(), ":method :url :status - :response-time ms - message: :message");
var successHandler = (0, _morgan["default"])(successResponseFormat, {
  skip: function skip(_, response) {
    return response.statusCode >= 400;
  },
  stream: {
    write: function write(message) {
      return _logger["default"].info(message.trim());
    }
  }
});
var errorHandler = (0, _morgan["default"])(errorResponseFormat, {
  skip: function skip(_, response) {
    return response.statusCode < 400;
  },
  stream: {
    write: function write(message) {
      return _logger["default"].error(message.trim());
    }
  }
});
var _default = {
  successHandler: successHandler,
  errorHandler: errorHandler
};
exports["default"] = _default;