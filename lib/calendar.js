'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _optionsJs = require('./options.js');

var _optionsJs2 = _interopRequireDefault(_optionsJs);

var _templatePanelHtml = require('../template/panel.html');

var _templatePanelHtml2 = _interopRequireDefault(_templatePanelHtml);

var _templateDatesHtml = require('../template/dates.html');

var _templateDatesHtml2 = _interopRequireDefault(_templateDatesHtml);

var _templateMonthsHtml = require('../template/months.html');

var _templateMonthsHtml2 = _interopRequireDefault(_templateMonthsHtml);

var _templateWeekHtml = require('../template/week.html');

var _templateWeekHtml2 = _interopRequireDefault(_templateWeekHtml);

var _helperJs = require('./helper.js');

var _helperJs2 = _interopRequireDefault(_helperJs);

var Calendar = (function () {
    function Calendar(options) {
        _classCallCheck(this, Calendar);

        this.opts = _jquery2['default'].extend({}, _optionsJs2['default'], options);
        this.selectTime = this.getDefaultDates();
        this.nowTime = _jquery2['default'].extend({}, this.selectTime);
        this.root = _jquery2['default'](this.opts.root);
        //有默认值，设置默认值
        this.opts.defaultDate && this.root.val(this.opts.defaultDate);
        this.hasLimit();
        this.getTimeDate(true);
        this.initPanel();
        this.bindEvents();
    }

    Calendar.prototype.initPanel = function initPanel() {
        var root = this.root,
            panel = _templatePanelHtml2['default'](this.dates);
        root.after(panel);
        //root.css('position', 'relative');
        this.title = _jquery2['default']('.calendar-top .dates');
        this.renderDays();
    };

    /**
     * 是否有默认时间
     * */

    Calendar.prototype.getDefaultDates = function getDefaultDates() {
        var defaultDate = this.opts.defaultDate;
        if (defaultDate) {
            return new Date(defaultDate);
        } else {
            return new Date();
        }
    };

    /**
     * 是否有限制时间
     * */

    Calendar.prototype.hasLimit = function hasLimit() {
        this.hasBegin = this.opts.beginDate;
        this.hasEnd = this.opts.endDate;
        this.beginDates = this.hasBegin ? new Date(this.hasBegin) : new Date(0, 0, 0);
        this.endDates = this.hasEnd ? new Date(this.hasEnd) : new Date(999, 0, 0);
    };

    /**
     * 获取相应的时间,
     * isShow为true时，取selectTime,否则nowTime
     * new date的月份比真正的少1
     * */

    Calendar.prototype.getTimeDate = function getTimeDate(isShow) {
        var nowTime = isShow ? this.selectTime : this.nowTime;
        this.dates = {
            selectYear: nowTime.getFullYear(),
            selectMonth: nowTime.getMonth() + 1,
            selectDay: nowTime.getDate(),
            selectWeek: nowTime.getDay()
        };
        isShow && this.getInitDate(this.dates);
        /**
         * 当前月的最后一天，即后一个月的第0天
         * */
        var years = this.dates.selectYear,
            months = this.dates.selectMonth;
        this.dates.lastDay = new Date(years, months, 0).getDate();
        this.dates.firstWeek = new Date(years, months - 1, 1).getDay();
    };

    /**
     * 获得初始日期相关参数
     * */

    Calendar.prototype.getInitDate = function getInitDate(data) {
        this.initYear = data.selectYear;
        this.initMonth = data.selectMonth;
        this.initDay = data.selectDay;
    };

    /**
     * 渲染周几
     * */

    Calendar.prototype.renderWeeks = function renderWeeks() {
        var weeks = this.opts.weeks;
        var weekTpl = _templateWeekHtml2['default']({ days: weeks });
        return weekTpl;
    };

    /**
     * 渲染每月的日期
     * 需要判断两种情况：
     * 1、是否当前选中时间，2、是否不可用时间
     * */

    Calendar.prototype.renderDays = function renderDays() {
        var tHead = _jquery2['default']('#calendar-thead'),
            tBody = _jquery2['default']('#calendar-tbody');
        var selectDay = this.dates.selectDay,
            firstWeek = this.dates.firstWeek,
            lastDay = this.dates.lastDay;
        var days = [],
            tplDay = '',
            title = this.title;
        var isInit = this.isCurrentDate(1);
        title.html(this.dates.selectYear + '年' + this.dates.selectMonth + '月');
        //增加星期tr
        tHead.html(this.renderWeeks());
        var len = lastDay + firstWeek,
            activeIndex = selectDay + firstWeek - 1; //当前日期的下标
        /**
         * 循环待改进,比较特殊所以不拆出来
         * */
        for (var i = 0; i < len; i++) {
            if (i < firstWeek) {
                days.push({ key: '', index: i });
            } else if (i < len) {
                var num = i + 1 - firstWeek;
                if ((this.hasBegin || this.hasEnd) && this.isLimitDate(num)) {
                    days.push({ key: num, index: i, disabled: true });
                } else if (i == activeIndex && isInit == true) {
                    days.push({ key: num, index: i, on: true });
                } else {
                    days.push({ key: num, index: i });
                }
            }
        }
        tplDay += _templateDatesHtml2['default']({ days: days });
        tBody.html(tplDay);
    };

    /**
     * 判断是否不可用日期
     * 根据不同type判断何种情况
     * */

    Calendar.prototype.isLimitDate = function isLimitDate(days) {
        var year = this.dates.selectYear,
            month = this.dates.selectMonth - 1,
            day = days;
        var beginDate = this.beginDates.getTime(),
            endDate = this.endDates.getTime(),
            tempDate = new Date(year, month, day).getTime();
        if (tempDate < beginDate || tempDate > endDate) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 判断是否当前年月日
     * */

    Calendar.prototype.isCurrentDate = function isCurrentDate(type) {
        var selectYear = this.dates.selectYear,
            selectMonth = this.dates.selectMonth,
            selectDay = this.dates.selectDay,
            isTrue = false;
        switch (type) {
            //是否当前月
            case 1:
                if (selectYear == this.initYear && selectMonth == this.initMonth) {
                    isTrue = true;
                }
                break;
            //是否当前年
            case 2:
                if (selectYear == this.initYear) {
                    isTrue = true;
                }
                break;
            case 3:
                if (selectYear == this.initYear) {
                    isTrue = true;
                }
                break;
        }
        return isTrue;
    };

    /**
     * 渲染月列表
     * */

    Calendar.prototype.renderMonth = function renderMonth() {
        var tHead = _jquery2['default']('#calendar-thead'),
            tBody = _jquery2['default']('#calendar-tbody'),
            selctMonth = this.dates.selectMonth;
        var tplMonth = this.getTpl(1, true, selctMonth - 1),
            title = this.title;
        title.html(this.dates.selectYear + '年');
        tHead.html('');
        tBody.html(tplMonth);
    };

    /**
     * 渲染年列表
     * */

    Calendar.prototype.renderYear = function renderYear(years) {
        var year = years,
            tHead = _jquery2['default']('#calendar-thead'),
            tBody = _jquery2['default']('#calendar-tbody');
        var minYear = parseInt(year / 10) * 10,
            maxYear = minYear + 1,
            title = this.title;
        title.html(minYear + '-' + maxYear);
        var tplYear = this.getTpl(minYear - 1, false, this.initYear);
        tHead.html('');
        tBody.html(tplYear);
    };

    /**
     * 获得年月模版数据
     * @param data 第一个td的内容
     * @param isMonth 是否渲染月份
     * @param len 标记位，标记当前选中月份或年
     * */

    Calendar.prototype.getTpl = function getTpl(data, isMonth, indexs) {
        var dates = [],
            tpl = '',
            initTag = false;
        var templates = _templateMonthsHtml2['default'];
        isMonth && (initTag = this.isCurrentDate(2));
        for (var i = 0; i < 12; i++) {
            var index = i + data;
            if (isMonth && initTag && i == indexs || !isMonth && indexs == index) {
                dates.push({ key: index, on: true, index: i });
            } else {
                dates.push({ key: index, index: i });
            }
        }
        tpl = templates({ days: dates, isMonth: isMonth });
        return tpl;
    };

    Calendar.prototype.bindEvents = function bindEvents() {
        var _this = this,
            body = _jquery2['default']("body"),
            title = _this.title,
            next = _jquery2['default']('.calendar-next'),
            prev = _jquery2['default']('.calendar-prv'),
            root = this.root,
            panels = _jquery2['default']('.calendar-panel'),
            tBody = panels.find('table tbody'),
            toDay = _jquery2['default']('.calendar-tip');
        _this.titleType = title.attr('data-type');
        body.on('click', function (e) {
            var that = _jquery2['default'](e.target);
            if (that.parents('.calendar-panel').length < 1) {
                _this.close();
            }
        });
        root.on('click', function (e) {
            e.stopPropagation();
            panels.hasClass('jq-hide') && _this.showInit();
            panels.toggleClass('jq-hide');
        });
        title.on('click', function (e) {
            _this.switchTitle(_this.titleType);
        });
        next.on('click', function (e) {
            _this.next();
        });
        prev.on('click', function (e) {
            _this.prev();
        });
        tBody.on('click', 'span[class!="disabled"]', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var val = parseInt(_jquery2['default'](e.target).text()),
                selectYear = _this.dates.selectYear,
                selectMonth = _this.dates.selectMonth,
                selectDay = _this.dates.selectDay;
            if (!val || _jquery2['default'](this).hasClass('disabled')) {
                return;
            }
            switch (_this.titleType) {
                case 'days':
                    _this.getDateNum(selectYear, selectMonth, val, false);
                    break;
                case 'months':
                    _this.nowTime = _this.getNewDate(selectYear, val - 1, selectDay);
                    _this.reRenderDates(true);
                    _this.titleType = 'days';
                    break;
                case 'years':
                    _this.nowTime = _this.getNewDate(val, selectMonth, selectDay);
                    _this.reRenderDates(false);
                    _this.titleType = 'months';
            }
        });
        toDay.on('click', function () {
            _this.getToday();
        });
    };

    /**
     * 改变后重新渲染日期或月份
     * */

    Calendar.prototype.reRenderDates = function reRenderDates(isDay) {
        this.getTimeDate(false);
        isDay ? this.renderDays() : this.renderMonth();
    };

    Calendar.prototype.switchTitle = function switchTitle(titleType) {
        var _this = this;
        switch (titleType) {
            case 'days':
                _this.renderMonth();
                _this.titleType = 'months';
                break;
            case 'months':
                _this.renderYear(this.dates.selectYear);
                _this.titleType = 'years';
                break;
            case 'years':
                _this.renderDays();
                _this.titleType = 'days';
        }
    };

    /**
     * 关闭面板
     * */

    Calendar.prototype.close = function close() {
        var panels = _jquery2['default']('.calendar-panel');
        !panels.hasClass('jq-hide') && panels.addClass('jq-hide');
    };

    /**
     * 获取新的date变量
     * @param year
     * @param month
     * @param day
     * */

    Calendar.prototype.getNewDate = function getNewDate(year, month, day) {
        return new Date(year, month, day);
    };

    Calendar.prototype.prev = function prev() {
        this.changeHandler(false);
    };

    Calendar.prototype.next = function next() {
        this.changeHandler(true);
    };

    /**
     * next，prev。calllback。
     * isNext true表示next
     * */

    Calendar.prototype.changeHandler = function changeHandler(isNext) {
        var title = _jquery2['default']('.calendar-top .year');
        var selectYear = this.dates.selectYear,
            selectMonth = this.dates.selectMonth,
            selectDay = this.dates.selectDay;
        switch (this.titleType) {
            case 'days':
                var month = isNext ? selectMonth : selectMonth - 2;
                this.nowTime = this.getNewDate(selectYear, month, selectDay);
                this.reRenderDates(true);
                break;
            case 'months':
                var years = isNext ? selectYear + 1 : selectYear - 1;
                this.nowTime = this.getNewDate(years, selectMonth, selectDay);
                this.reRenderDates(false);
                break;
            case 'years':
                var year = isNext ? selectYear + 10 : selectYear - 10;
                this.nowTime = this.getNewDate(year, selectMonth, selectDay);
                this.getTimeDate(false);
                this.renderYear(year);
                break;
        }
    };

    /**
     * 设置selectTime,再次打开保持对应
     * */

    Calendar.prototype.setSelectTime = function setSelectTime(year, month, day) {
        this.selectTime = year ? new Date(year, month, day) : new Date();
    };

    /**
     * 再次展示时，重新展示当前时间
     * */

    Calendar.prototype.showInit = function showInit() {
        //重新显示日历，重置titleType
        this.titleType = 'days';
        this.getTimeDate(true);
        this.renderDays();
    };

    /**
     * 获得今天
     * */

    Calendar.prototype.getToday = function getToday() {
        this.setSelectTime();
        this.getTimeDate(true);
        this.getDateNum(this.dates.selectYear, this.dates.selectMonth, this.dates.selectDay, true);
    };

    /**
     * 选择日期
     * isToday为true，通过点击今天获取日期
     * 无需设置selectDate
     * */

    Calendar.prototype.getDateNum = function getDateNum(selectYear, selectMonth, val, isToday) {
        this.getFormatNum();
        var root = this.root,
            vals = this.getFormatNum(selectYear, selectMonth, val);
        root.val(vals);
        !isToday && this.setSelectTime(selectYear, selectMonth - 1, val);
        this.close();
    };

    /**
     * 格式化日期
     * */

    Calendar.prototype.getFormatNum = function getFormatNum(year, month, day) {
        var date = arguments,
            str = '';
        for (var i = 0; i < date.length; i++) {
            if (date[i] < 10) {
                date[i] = '0' + date[i];
            }
            i < 2 ? str += date[i] + '-' : str += date[i];
        }
        return str;
    };

    return Calendar;
})();

exports['default'] = function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return new Calendar(options);
};

module.exports = exports['default'];