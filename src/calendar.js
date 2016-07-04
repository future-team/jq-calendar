import $ from 'jquery';
import opts from './options.js';
import pagesTemplate from '../template/pages.html';
class Pagination {
    constructor(options) {
        this.opts = $.extend({}, opts, options);
    }
}

export default (options = {})=> {
    return new Pagination(options)
};