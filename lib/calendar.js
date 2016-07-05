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

var Calendar = (function () {
    function Calendar(options) {
        _classCallCheck(this, Calendar);

        this.opts = _jquery2['default'].extend({}, _optionsJs2['default'], options);
        this.nowTime = new Date();
        this.getTime();
        this.renderDays();
    }

    /**
     * 获取相应的时间
     * */

    Calendar.prototype.getTime = function getTime() {
        var nowTime = this.nowTime;
        this.dates = {
            selectYear: nowTime.getFullYear() + 1900,
            selectMonth: nowTime.getMonth(),
            selectDay: nowTime.getDate(),
            selectWeek: nowTime.getDay()
        };
        /**
         * 当前月的最后一天
         * */
        var years = this.dates.selectYear,
            months = this.dates.selectMonth + 1;
        this.dates.lastDay = new Date(years, months, 0).getDate();
    };

    /**
     * 渲染每月的日期
     * */

    Calendar.prototype.renderDays = function renderDays() {
        var selectDay = this.dates.selectDay,
            selectWeek = this.dates.selectWeek,
            lastDay = this.dates.lastDay;
        for (var i = selectWeek; i < lastDay; i++) {
            console.log(i);
        }
    };

    /**
     * 渲染月列表
     * */

    Calendar.prototype.renderMonth = function renderMonth() {};

    /**
     * 渲染年列表
     * */

    Calendar.prototype.renderYear = function renderYear() {};

    /**
     *
     * */

    Calendar.prototype.bindeEvents = function bindeEvents() {};

    return Calendar;
})();

exports['default'] = function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return new Calendar(options);
};

module.exports = exports['default'];