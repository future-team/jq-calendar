import $ from 'jquery';
import opts from './options.js';
import panelTPL from '../template/panel.html';
import datesTemplate from '../template/dates.html';
import monthTemplate from '../template/months.html';
import weekTemplate from '../template/week.html';
class Calendar {
    constructor(options) {
        this.opts = $.extend({}, opts, options);
        this.selectTime = new Date();
        this.nowTime = $.extend({},this.selectTime);
        this.root = $(this.opts.root);
        this.getTimeDate(true);
        this.initPanel();
        this.bindEvents();
    }

    initPanel() {
        let root = this.root,
            panel = panelTPL(this.dates);
        root.after(panel);
        root.css('position', 'relative');
        this.renderDays();
    }

    /**
     * 获取相应的时间,
     * isShow为true时，取selectTime,否则nowTime
     * new date的月份比真正的少1
     * */
    getTimeDate(isShow) {
        let nowTime = isShow?this.selectTime:this.nowTime;
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
    getInitDate(data){
        this.initYear = data.selectYear;
        this.initMonth = data.selectMonth;
        this.initDay = data.selectDay;
    }
    /**
     * 渲染周几
     * */
    renderWeeks() {
        let weeks = this.opts.weeks;
        /**
         * 与日期公用模版
         * */
        let weekTpl = weekTemplate({days: weeks});
        return weekTpl;
    }

    /**
     * 渲染每月的日期
     * */
    renderDays() {
        let tHead = $('#calendar-thead'),
            tBody = $('#calendar-tbody');
        let selectDay = this.dates.selectDay,
            firstWeek = this.dates.firstWeek,
            lastDay = this.dates.lastDay;
        let title = $('.calendar-top .year');
        let days = [],
            tplDay = '';
        let isInit = this.isCurrentDate(1);
        title.html(this.dates.selectYear + '年' +this.dates.selectMonth + '月');
        //增加日期
        tHead.html(this.renderWeeks());
        let len = lastDay + firstWeek,
            iLen = Math.ceil(len / 7),
            jLen = 7,
            activeIndex = selectDay + firstWeek -1;//当前日期的下标
        /**
         * 循环待改进,比较特殊所以不拆出来
         * */
        for (let i = 0; i < iLen; i++) {
            let minJ = i * jLen,
                maxJ = (i + 1) * jLen;
            for (let j = minJ; j < maxJ; j++) {
                if (j < firstWeek) {
                    days.push({key:''});
                } else if (j < len) {
                    if(j == activeIndex && isInit == true){
                        days.push({key:j + 1 - firstWeek,on:true});
                    }else{
                        days.push({key:j + 1 - firstWeek});
                    }

                    if (j == len - 1 || j == maxJ - 1) {
                        tplDay += datesTemplate({days: days});
                        days = [];
                    }
                }
            }

        }
        tBody.html(tplDay);
    }
    /**
     * 判断是否当前年月日
     * */
    isCurrentDate(type){
        let selectYear = this.dates.selectYear,
            selectMonth = this.dates.selectMonth,
            selectDay = this.dates.selectDay,
            isTrue = false;
        switch(type){
            //是否当前月
            case 1:
                if(selectYear == this.initYear && selectMonth == this.initMonth){
                    isTrue = true;
                }
                break;
            //是否当前年
            case 2:
                if(selectYear == this.initYear){
                    isTrue = true;
                }
                break;
            case 3:
                if(selectYear == this.initYear){
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
        let tHead = $('#calendar-thead'),
            tBody = $('#calendar-tbody'),
            selctMonth = this.dates.selectMonth;
        let tplMonth = this.getTpl(3, 4, 1, true,selctMonth-1);
        let title = $('.calendar-top .year');
        title.html(this.dates.selectYear + '年');
        tHead.html('');
        tBody.html(tplMonth);
    }

    /**
     * 渲染年列表
     * */
    renderYear(years) {
        //let year = this.dates.selectYear,
        let year = years,
            tHead = $('#calendar-thead'),
            tBody = $('#calendar-tbody');
        let minYear = parseInt(year / 10) * 10,
            maxYear = minYear +10;
        let title = $('.calendar-top .year');
        title.html(minYear + '-'+ maxYear);
        let tplYear = this.getTpl(3, 4, minYear - 1, false,this.initYear);
        tHead.html('');
        tBody.html(tplYear);
    }

    /**
     * 获得年月模版数据
     * @param iLen table的行数
     * @param jLen table的列数
     * @param data 第一个td的内容
     * @param isMonth 是否渲染月份
     * @param len 标记位，标记当前选中月份或年
     * */
    getTpl(iLen, jLen, data, isMonth,indexs) {
        let dates = [],
            tpl = '',
            initTag = false;
        let templates = isMonth ? monthTemplate : datesTemplate;
            isMonth && (initTag = this.isCurrentDate(2));

        for (let i = 0; i < iLen; i++) {
            let minJ = i * jLen,
                maxJ = (i + 1) * jLen;
            for (let j = minJ; j < maxJ; j++) {
                //this.getJudge(isYear);
                let index = j + data;
                if((isMonth && initTag && j == indexs) ||(!isMonth && indexs == index)){
                    dates.push({key:index,on:true});
                }else{
                    dates.push({key:index});
                }

                if (j == maxJ - 1) {
                    tpl += templates({days: dates});
                    dates = [];
                }
            }

        }
        return tpl;
    }
    /**
     * 判断是否当前
     * */
    isCurrentMY(){

    }
    bindEvents() {
        let _this = this,
            body = $("body"),
            title = $('.calendar-title'),
            next = $('.calendar-next'),
            prev = $('.calendar-prv'),
            root = this.root,
            panels = $('.calendar-panel'),
            tBody = panels.find('table tbody'),
            toDay = $('.calendar-tip');
        _this.titleType = title.attr('data-type');
        body.on('click', function (e) {
            let that = $(e.target);
            if (that.parents('.calendar-panel').length < 1) {
                _this.close();
            }
        });
        root.on('click', function (e) {
            e.stopPropagation();
            panels.hasClass('jq-hide')&&_this.showInit();
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
            switch (_this.titleType) {
                case 'days':
                    _this.getDateNum(selectYear,selectMonth,val,false);
                    /*let vals = selectYear + '-' +selectMonth + '-' + val;
                    root.val(vals);
                    _this.setSelectTime(selectYear,selectMonth-1,val);
                    _this.close();*/
                    break;
                case 'months':
                    _this.nowTime = _this.getNewDate(selectYear, val-1, selectDay);
                    _this.reRenderDates(true);
                    _this.titleType = 'days';
                    break;
                case 'years':
                    _this.nowTime = _this.getNewDate(val, selectMonth,selectDay);
                    _this.reRenderDates(false);
                    _this.titleType = 'months';
            }
        });
        toDay.on('click',function(){
            _this.getToday();
        })

    }
    /**
     * 改变后重新渲染日期或月份
     * */
    reRenderDates(isDay){
        this.getTimeDate(false);
        isDay ? this.renderDays(): this.renderMonth();
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
        let panels = $('.calendar-panel');
        !panels.hasClass('jq-hide') && panels.addClass('jq-hide');
    }
    /**
     * 获取新的date变量
     * @param year
     * @param month
     * @param day
     * */
    getNewDate(year,month,day){
        return new Date(year,month,day);
    }
    prev(){
        this.changeHandler(false);
    }
    next(){
        this.changeHandler(true);
    }
    /**
     * next，prev。calllback。
     * isNext true表示next
     * */
    changeHandler(isNext){
        let title = $('.calendar-top .year');
        let selectYear = this.dates.selectYear,
            selectMonth = this.dates.selectMonth,
            selectDay = this.dates.selectDay;
        switch (this.titleType) {
            case 'days':
                let month = isNext ? selectMonth : selectMonth -2;
                this.nowTime = this.getNewDate(selectYear, month, selectDay);
                this.reRenderDates(true);
                break;
            case 'months':
                let years = isNext ? selectYear+1:selectYear-1;
                this.nowTime = this.getNewDate(years,selectMonth, selectDay);
                this.reRenderDates(false);
                break;
            case 'years':
                let year = isNext ? selectYear+10:selectYear-10;
                this.nowTime = this.getNewDate(year,selectMonth, selectDay);
                this.getTimeDate(false);
                this.renderYear(year);
                break
        }
    }
    /**
     * 设置selectTime,再次打开保持对应
     * */
    setSelectTime(year,month,day){
        this.selectTime = year?new Date(year,month,day):new Date();
    }
    /**
     * 再次展示时，重新展示当前时间
     * */
    showInit(){
        this.getTimeDate(true);
        this.renderDays();
    }
    /**
     * 获得今天
     * */
    getToday(){
        this.setSelectTime();
        this.getTimeDate(true);
        this.getDateNum(this.dates.selectYear,this.dates.selectMonth,this.dates.selectDay,true);
    }
    /**
     * 选择日期
     * isToday为true，通过点击今天获取日期
     * 无需设置selectDate
     * */
    getDateNum(selectYear,selectMonth,val,isToday){
        let root = this.root,
            vals = selectYear + '-' +selectMonth + '-' + val;
        root.val(vals);
        !isToday && this.setSelectTime(selectYear,selectMonth-1,val);
        this.close();
    }
}

export default (options = {})=> {
    return new Calendar(options)
};