'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('../css/index.less');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _calendar = require('./calendar');

var _calendar2 = _interopRequireDefault(_calendar);

exports.Calendar = _calendar2['default'];

if (typeof Calendar == 'undefined') {
    window.Calendar = exports['Calendar'];
}

//jquery插件导出
_jquery2['default'].fn.extend({
    Calendar: (function (_Calendar2) {
        function Calendar(_x) {
            return _Calendar2.apply(this, arguments);
        }

        Calendar.toString = function () {
            return _Calendar2.toString();
        };

        return Calendar;
    })(function (opt) {
        Calendar(this, opt);
        return this;
    })
});