"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _handlebarsRuntime = require('handlebars/runtime');

var _handlebarsRuntime2 = _interopRequireDefault(_handlebarsRuntime);

/**
 * 自定义helper
 * */
_handlebarsRuntime2["default"].registerHelper("renderMonth", function (indexs, options) {
    var i = indexs.index;
    if (i % 7 != 6) {
        return options.fn(indexs);
    } else {
        return options.inverse(indexs);
    }
});
_handlebarsRuntime2["default"].registerHelper("isDisable", function (indexs, options) {
    if (indexs.disabled || !indexs.key) {
        return options.fn(indexs);
    } else {
        return options.inverse(indexs);
    }
});
_handlebarsRuntime2["default"].registerHelper("renderYear", function (indexs, options) {
    var i = indexs.index;
    if (i % 4 != 3) {
        return options.fn(indexs);
    } else {
        return options.inverse(indexs);
    }
});