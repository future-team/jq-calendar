/**
 * 默认参数
 * */
'use strict';

exports.__esModule = true;
var options = {
  /**
   * 日期插入的标记位置
   * */
  root: '.calendar',
  /**
   * 周显示样式
   * */
  weeks: ['日', '一', '二', '三', '四', '五', '六'],
  /**
   * 默认选中时间
   * */
  defaultDate: '',
  /**
   * 可用时间的起始时间
   * */
  beginDate: '',
  /**
   * 可用时间的终止时间
   * */
  endDate: '',
  /**
   * 选择时间之后的回调，返回参数为选择日期值
   * */
  selectHandler: function selectHandler(date) {}
};

exports['default'] = options;
module.exports = exports['default'];