import $ from 'jquery';
import opts from './options.js';
import panelTPL from '../template/panel.html';
import datesTemplate from '../template/dates.html';
import monthTemplate from '../template/months.html';
import weekTemplate from '../template/week.html';
import helper from './helper.js';
/**
 * 基本思路：通过opt配置想初始化panel插入对应位置。
 * 判断是否有限制时间及默认值来渲染table
 * 存在选中日期selectTime和临时日期nowTime，只有选中日期后才改变selectTime
 * 提供setBeginDate和setEndDate方法动态改变限制日期以实现联动
 * */
class Calendar {
    constructor(options) {
        this.opts = $.extend({}, opts, options);
        this.selectTime = this.getDefaultDates();
        this.nowTime = $.extend({}, this.selectTime);
        this.root = $(this.opts.root);
        //设置默认值
        this.opts.defaultDate && this.root.val(this.opts.defaultDate);
        this.hasLimit();
        this.getTimeDate(true);
        this.initPanel();
        this.bindEvents();
    }
    /**
     * 获取唯一的id
     * */
    getUniqueId(){
        return 'jq'+Math.floor(Math.random()*100);
    }
    initPanel() {
        this.dates.id = this.getUniqueId();
        let root = this.root,
            panel = panelTPL(this.dates);
        root.after(panel);
        //this.panels = root.next('.calendar-panel');
        //唯一标示
        this.panels = $('#'+this.dates.id);
        this.title = this.panels.find('.calendar-top .dates');
        this.renderDays();
    }

    /**
     * 是否有默认时间
     * */
    getDefaultDates() {
        let defaultDate = this.opts.defaultDate;
        if (defaultDate) {
            return new Date(defaultDate);
        } else {
            return new Date();
        }
    }

    /**
     * 是否有限制时间
     * */
    hasLimit() {
        this.hasBegin = this.opts.beginDate;
        this.hasEnd = this.opts.endDate;
        this.beginDates = this.hasBegin ? new Date(this.hasBegin) : new Date(0, 0, 0);
        this.endDates = this.hasEnd ? new Date(this.hasEnd) : new Date(9999, 0, 0);
    }

    /**
     * 获取相应的时间,
     * isShow为true时，取selectTime,否则nowTime
     * new date的月份比真正的少1
     * @isShow 是否以初始化日期为依据 false
     * */
    getTimeDate(isShow) {
        let nowTime = isShow ? this.selectTime : this.nowTime;
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
        let years = this.dates.selectYear,
            months = this.dates.selectMonth;
        this.dates.lastDay = new Date(years, months, 0).getDate();
        this.dates.firstWeek = new Date(years, months - 1, 1).getDay();
    }

    /**
     * 获得初始日期相关参数
     * */
    getInitDate(data) {
        this.initYear = data.selectYear;
        this.initMonth = data.selectMonth;
        this.initDay = data.selectDay;
    }

    /**
     * 渲染周几
     * */
    renderWeeks() {
        let weeks = this.opts.weeks;
        let weekTpl = weekTemplate({days: weeks});
        return weekTpl;
    }

    /**
     * 渲染每月的日期
     * 需要判断两种情况：
     * 1、是否当前选中时间，2、是否不可用时间
     * */
    renderDays() {
        let panels = this.panels,
            tHead = panels.find('#calendar-thead'),
            tBody = panels.find('#calendar-tbody');
        let selectDay = this.dates.selectDay,
            firstWeek = this.dates.firstWeek,
            lastDay = this.dates.lastDay;
        let days = [],
            tplDay = '',
            title = this.title;
        let isInit = this.isCurrentDate(1);
        title.html(this.dates.selectYear + '年' + this.dates.selectMonth + '月');
        //增加星期tr
        tHead.html(this.renderWeeks());
        let len = lastDay + firstWeek,
            activeIndex = selectDay + firstWeek - 1;//当前日期的下标
        /**
         * 循环待改进,比较特殊所以不拆出来
         * */
        for (let i = 0; i < len; i++) {
            if (i < firstWeek) {
                days.push({key: '', index: i});
            } else if (i < len) {
                let num = i + 1 - firstWeek;
                if ((this.hasBegin || this.hasEnd) && this.isLimitDate(num)) {
                    days.push({key: num, index: i, disabled: true});
                } else if (i == activeIndex && isInit == true) {
                    days.push({key: num, index: i, on: true});
                } else {
                    days.push({key: num, index: i});
                }
            }
        }
        tplDay += datesTemplate({days: days});
        tBody.html(tplDay);
    }

    /**
     * 判断是否不可用日期
     * 根据不同type判断何种情况
     * */
    isLimitDate(days) {
        let year = this.dates.selectYear,
            month = this.dates.selectMonth - 1,
            day = days;
        let beginDate = this.beginDates.getTime(),
            endDate = this.endDates.getTime(),
            tempDate = new Date(year, month, day).getTime();
        if (tempDate < beginDate || tempDate > endDate) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否当前年月日
     * */
    isCurrentDate(type) {
        let selectYear = this.dates.selectYear,
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
    }

    /**
     * 渲染月列表
     * */
    renderMonth() {
        let panels = this.panels,
            tHead = panels.find('#calendar-thead'),
            tBody = panels.find('#calendar-tbody'),
            selectMonth = this.initMonth;
        let tplMonth = this.getTpl(1, true, selectMonth - 1),
            title = this.title;
        title.html(this.dates.selectYear + '年');
        tHead.html('');
        tBody.html(tplMonth);
    }

    /**
     * 渲染年列表
     * */
    renderYear(years) {
        let year = years,
            panels = this.panels,
            tHead = panels.find('#calendar-thead'),
            tBody = panels.find('#calendar-tbody');
        let minYear = parseInt(year / 10) * 10,
            maxYear = minYear + 10,
            title = this.title;
        title.html(minYear - 1 + '-' + maxYear);
        let tplYear = this.getTpl(minYear - 1, false, this.initYear);
        tHead.html('');
        tBody.html(tplYear);
    }

    /**
     * 获得年月模版数据
     * @param data 第一个td的内容
     * @param isMonth 是否渲染月份
     * @param len 标记位，标记当前选中月份或年
     * */
    getTpl(data, isMonth, indexs) {
        let dates = [],
            tpl = '',
            initTag = false;
        let templates = monthTemplate;
        isMonth && (initTag = this.isCurrentDate(2));
        for (let i = 0; i < 12; i++) {
            let index = i + data;
            if ((isMonth && initTag && i == indexs) || (!isMonth && indexs == index)) {
                dates.push({key: index, on: true, index: i});
            } else {
                dates.push({key: index, index: i});
            }

        }
        tpl = templates({days: dates, isMonth: isMonth});
        return tpl;
    }

    bindEvents() {
        let _this = this,
            body = $("body"),
            title = _this.title,
            root = _this.root,
            panels = _this.panels;
        let next = panels.find('.calendar-next'),
            prev = panels.find('.calendar-prv'),
            tBody = panels.find('table tbody'),
            toDay = panels.find('.calendar-tip');
        _this.titleType = title.attr('data-type');
        body.on('click', function (e) {
            let that = $(e.target);
            let panel = _this.getPanelClassName();
            if (that[0] == root[0]) {
                return false
            } else if (that.parents(panel).length < 1) {
                _this.close();
            }
        });
        root.on('click', function (e) {
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
            let val = parseInt($(e.target).text()),
                selectYear = _this.dates.selectYear,
                selectMonth = _this.dates.selectMonth,
                selectDay = _this.dates.selectDay;
            if (!val || $(this).hasClass('disabled')) {
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
        })

    }

    /**
     * 获取当前caneldar的class
     * */
    getPanelClassName() {
        return this.opts.root + '+' + '.calendar-panel';
    }

    /**
     * 改变后重新渲染日期或月份
     * */
    reRenderDates(isDay) {
        this.getTimeDate(false);
        isDay ? this.renderDays() : this.renderMonth();
    }

    switchTitle(titleType) {
        let _this = this;
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
    }

    /**
     * 关闭面板
     * */
    close() {
        let panels = this.panels;
        !panels.hasClass('jq-hide') && panels.addClass('jq-hide');
    }

    /**
     * 获取新的date变量
     * @param year
     * @param month
     * @param day
     * */
    getNewDate(year, month, day) {
        return new Date(year, month, day);
    }

    prev() {
        this.changeHandler(false);
    }

    next() {
        this.changeHandler(true);
    }
    /**
     * next，prev。calllback。
     * isNext true表示next
     * */
    changeHandler(isNext) {
        let selectYear = this.dates.selectYear,
            selectMonth = this.dates.selectMonth,
            selectDay = this.dates.selectDay;
        switch (this.titleType) {
            case 'days':
                let month = isNext ? selectMonth : selectMonth - 2;
                this.nowTime = this.getNewDate(selectYear, month, selectDay);
                this.reRenderDates(true);
                break;
            case 'months':
                let years = isNext ? selectYear + 1 : selectYear - 1;
                this.nowTime = this.getNewDate(years, selectMonth, selectDay);
                this.reRenderDates(false);
                break;
            case 'years':
                let year = isNext ? selectYear + 10 : selectYear - 10;
                this.nowTime = this.getNewDate(year, selectMonth, selectDay);
                this.getTimeDate(false);
                this.renderYear(year);
                break
        }
    }

    /**
     * 设置selectTime,再次打开保持对应
     * */
    setSelectTime(year, month, day) {
        this.selectTime = year ? new Date(year, month, day) : new Date();
    }

    /**
     * 再次展示时，重新展示当前时间
     * */
    showInit() {
        //重新显示日历，重置titleType
        this.titleType = 'days';
        this.getTimeDate(true);
        this.renderDays();
    }

    /**
     * 获得今天
     * */
    getToday() {
        this.setSelectTime();
        this.getTimeDate(true);
        this.getDateNum(this.dates.selectYear, this.dates.selectMonth, this.dates.selectDay, true);
    }

    /**
     * 选择日期
     * isToday为true，通过点击今天获取日期
     * 无需设置selectDate
     * */
    getDateNum(selectYear, selectMonth, val, isToday) {
        let root = this.root,
            vals = this.getFormatNum(selectYear, selectMonth, val),
            selectHandler = this.opts.selectHandler;
        root.val(vals);
        selectHandler(vals);
        !isToday && this.setSelectTime(selectYear, selectMonth - 1, val);
        this.close();
    }

    /**
     * 格式化日期
     * */
    getFormatNum(year, month, day) {
        let date = arguments,
            str = '';
        for (let i = 0; i < date.length; i++) {
            if (date[i] < 10) {
                date[i] = '0' + date[i];
            }
            i < 2 ? str += date[i] + '-' : str += date[i];
        }
        return str;
    }

    /**
     * 动态调用set方法，改变对应属性,
     * @param isBegin 默认为true
     * */
    setDate(date, isBegin) {
        if (isBegin) {
            this.beginDates = date ? new Date(date) : new Date(0, 0, 0);
        } else {
            this.endDates = date ? new Date(date) : new Date(9999, 0, 0);
        }
        this.getTimeDate(true);
        this.renderDays();
    }

    setBeginDate(date) {
        this.setDate(date, true);
    }

    setEndDate(date) {
        this.setDate(date, false);
    }

}

export default (options = {})=> {
    return new Calendar(options)
};