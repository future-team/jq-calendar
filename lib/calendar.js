'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _optionsJs = require('./options.js');

var _optionsJs2 = _interopRequireDefault(_optionsJs);

var _templatePagesHtml = require('../template/pages.html');

var _templatePagesHtml2 = _interopRequireDefault(_templatePagesHtml);

var Pagination = function Pagination(options) {
    _classCallCheck(this, Pagination);

    this.opts = _jquery2['default'].extend({}, _optionsJs2['default'], options);
};

exports['default'] = function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return new Pagination(options);
};

module.exports = exports['default'];