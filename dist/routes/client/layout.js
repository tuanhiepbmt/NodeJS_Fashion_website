"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var layoutRoutes = _express["default"].Router();

layoutRoutes.get('/home', function (request, response, next) {
  response.send('Worked...');
});
var _default = layoutRoutes;
exports["default"] = _default;