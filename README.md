# jq-calendar
 calendar for jQuery 
 日历组件   
 目前老的cortex项目不支持引其他项目包所以如果在老项目中使用的话只能通过script引入dist下的生成文件。
## UI展示
 - 具体图如下：    
    选择日期：  
       
   <img src="./img/day.png" />      
   选择月份：     
   
   <img src="./img/year.png" />       
   选择年：  
   
   <img src="./img/month.png" />
        
## 使用
 - 使用时，应指定在何处插入日历，即传入root对应的选择器，配置项如下：
 
 ```
       /**
          * 日期插入的标记位置
          * */
         root: '.calendar',
         /**
          * 周显示样式
          * */
         weeks:['日','一','二','三','四','五','六'],
         /**
          * 默认选中时间
          * */
         defaultDate:'',
         /**
          * 可用时间的起始时间
          * */
         beginDate:'',
         /**
          * 可用时间的终止时间
          * */
         endDate:'',
         /**
          * 选择时间之后的回调，返回参数为选择日期值
          * */
         selectHandler: function(date){
             console.log(date);
         }
       
 ```
 提供动态设置开始，结束时间的方法（即不在初始化时设置）
 建议selectHandler时调用，实现多日历联动
 
 ```
 
       let a = new Calendar();
       a.setBeginDate(date);
       a.setEndDate(date) 
       
 ```
 使用实例：
 js:
 
 ```
   import { Calendar } from 'jq-calendar';
   import $ from 'jquery';
    (()=>{
       new Calendar({
             root:'.calendar',   
             beginDate:'2016-07-06',
             endDate:'2016-07-10'
          });
    })();
    //或作为jquery插件引入
    $.Calendar({
    });
    //或者require的方式引入
    let Calendar =  require('jq-calendar').Calendar
    //使用同上
 ```
 html:
 
 ```
 
    <div id="root" style="padding: 10px">
        <input type="text" class="calendar" />
    </div>
    
 ```
- 注：若要兼容ie8及以下版本请引入es5-shim。    
  在html中判断版本，ie9一下引入    
 
 ```
    <!--[if lt IE 9] >
    <script src="http://cdn.bootcss.com/es5-shim/4.5.9/es5-shim.js"></script>
    <!--[endif]-->
 
 ```
   
## update
   
   - 1.0.4 修复不支持require方式
   - 1.0.2 增加图片说明
   - 之前版本 init及修复 

## Command

```
	#测试	
	npm run test	
	#打包	
	npm run build	
	#例子演示	
	npm run demo	
```
