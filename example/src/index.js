//import { Calendar } from '../../src/index.js';
//import { Calendar } from '../../dist/jq-calendar.js';
let Calendar =  require('../../dist/jq-calendar.js').Calendar;
import $ from 'jquery';

(()=>{
   /*new Calendar({
      /!*beginDate:'2016-07-06',
      endDate:'2016-07-10'*!/
   });*/
   //$.Calendar();
   let aCal =Calendar({
      root:'.test',
      beginDate:'2016-07-06',
      selectHandler: function(date){
         console.log(date);
      }
   });
   $('.abc').on('click',function(e){
      let val = $('.calendar').val();
      console.log(val);
      aCal.setBeginDate(val);
   })
})();