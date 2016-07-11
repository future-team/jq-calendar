import '../css/index.less';
import $ from 'jquery';
export Calendar from './calendar';
if(typeof(Calendar) == 'undefined'){
    window.Calendar = exports['Calendar'];
}

//jquery插件导出
$.extend({
    Calendar:function(opt){
        Calendar(opt,this);
    }
});
