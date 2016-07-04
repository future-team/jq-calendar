'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('../css/index.less');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _calendar = require('./calendar');

var _calendar2 = _interopRequireDefault(_calendar);

exports.Paging = _calendar2['default'];

if (typeof Paging == 'undefined') {
    window.Paging = exports['Paging'];
}

//jquery插件导出
_jquery2['default'].fn.extend({
    Paging: (function (_Paging2) {
        function Paging(_x) {
            return _Paging2.apply(this, arguments);
        }

        Paging.toString = function () {
            return _Paging2.toString();
        };

        return Paging;
    })(function (opt) {
        Paging(this, opt);
        return this;
    })
});