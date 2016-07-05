import $ from 'jquery';
import opts from './options.js';
import panelTPL from '../template/panel.html';
import datesTemplate from '../template/dates.html';
import monthTemplate from '../template/months.html';
class Calendar {
    constructor(options) {
        this.opts = $.extend({}, opts, options);
        this.nowTime = new Date();
        this.getTime();
        this.initPanel();
        this.bindEvents();
    }

    initPanel() {
        let root = $(this.opts.root),
            panel = panelTPL(this.dates);
        root.after(panel);
        root.css('position', 'relative');
        this.renderDays();
    }

    /**
     * 获取相应的时间
     * new date的月份比真正的少1
     * */
    getTime() {
        let nowTime = this.nowTime;
        this.dates = {
            selectYear: nowTime.getFullYear(),
            selectMonth: nowTime.getMonth() + 1,
            selectDay: nowTime.getDate(),
            selectWeek: nowTime.getDay()
        };
        /**
         * 当前月的最后一天，即后一个月的第0天
         * */
        let years = this.dates.selectYear,
            months = this.dates.selectMonth;
        this.dates.lastDay = new Date(years, months, 0).getDate();
        this.dates.firstWeek = new Date(years, months - 1, 1).getDay();
    }

    /**
     * 渲染周几
     * */
    renderWeeks() {
        let weeks = this.opts.weeks;
        /**
         * 与日期公用模版
         * */
        let weekTpl = datesTemplate({days: weeks});
        return weekTpl;
    }

    /**
     * 渲染每月的日期
     * */
    renderDays() {
        let selectDay = this.dates.selectDay,
            firstWeek = this.dates.firstWeek,
            lastDay = this.dates.lastDay;
        let days = [],
            tplDay = this.renderWeeks();
        let len = lastDay + firstWeek,
            iLen = Math.ceil(len / 7),
            jLen = 7;
        /**
         * 循环待改进,比较特殊所以不拆出来
         * */
        for (let i = 0; i < iLen; i++) {
            let minJ = i * jLen,
                maxJ = (i + 1) * jLen;
            for (let j = minJ; j < maxJ; j++) {
                if (j < firstWeek) {
                    days.push('');
                } else if (j < len) {
                    days.push(j + 1 - firstWeek);
                    if (j == len - 1 || j == maxJ - 1) {
                        tplDay += datesTemplate({days: days});
                        days = [];
                    }
                }
            }

        }
        $('#calendar-table').html(tplDay);
    }

    /**
     * 渲染月列表
     * */
    renderMonth() {
        let tplMonth = this.getTpl(3, 4, 1, true);
        $('#calendar-table').html(tplMonth);
    }

    /**
     * 渲染年列表
     * */
    renderYear() {
        let year = this.dates.selectYear;
        let minYear = parseInt(year / 10) * 10,
            len = year % 10;
        let tplYear = this.getTpl(3, 4, minYear - 1, false);
        $('#calendar-table').html(tplYear);
    }

    /**
     * 获得年月模版数据
     * @param iLen table的行数
     * @param jLen table的列数
     * @param data 每td的内容
     * @param isMonth 是否渲染月份
     * */
    getTpl(iLen, jLen, data, isMonth) {
        let dates = [],
            tpl = '';
        let templates = isMonth ? monthTemplate : datesTemplate;
        for (let i = 0; i < iLen; i++) {
            let minJ = i * jLen,
                maxJ = (i + 1) * jLen;
            for (let j = minJ; j < maxJ; j++) {
                //this.getJudge(isYear);
                let index = j + data;
                dates.push(index);
                if (j == maxJ - 1) {
                    tpl += templates({days: dates});
                    dates = [];
                }
            }

        }
        return tpl;
    }

    /**
     * 根据是否日期tpl，来判断if条件
     * 暂时不拆，太麻烦
     * */
    getJudge(isDay) {
        if (isDay) {
            let selectDay = this.dates.selectDay,
                firstWeek = this.dates.selectWeek,
                lastDay = this.dates.lastDay;
            let len = lastDay + firstWeek;

        }
    }

    bindEvents() {
        let _this = this,
            body = $('body'),
            title = $('.calendar-title'),
            next = $('.calendar-next'),
            prev = $('.calendar-prv'),
            root = $(this.opts.root),
            panels = $('.calendar-panel');
        root.on('click', function (e) {
            panels.toggleClass('jq-hide');
        });
        title.on('click', function (e) {
            _this.renderMonth();
        });
        next.on('click',function (e) {
            //因为为了得到显示正确的也分的已经加过一了
            _this.nowTime = new Date(_this.dates.selectYear, _this.dates.selectMonth, _this.dates.selectDay);
            debugger
            _this.getTime();
            _this.renderDays();
        });
        prev.on('click',function (e) {
            _this.nowTime = new Date(_this.dates.selectYear, _this.dates.selectMonth - 2, _this.dates.selectDay);
            _this.getTime();
            _this.renderDays();
        });

    }
}

export default (options = {})=> {
    return new Calendar(options)
};