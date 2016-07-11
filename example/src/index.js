import { Calendar } from '../../src/index.js';
import $ from 'jquery';

(()=>{
   /*new Calendar({
      /!*beginDate:'2016-07-06',
      endDate:'2016-07-10'*!/
   });*/
   $.Calendar();
   new Calendar({
      root:'.test',
      beginDate:'2016-07-06'
   });
})();