import Handlebars from 'handlebars/runtime';
/**
 *
 * */
Handlebars.registerHelper("renderMonth", function(indexs,options) {
     let i = indexs.index;
     if(i % 7 != 6){
         return options.fn(indexs);
     }else{
        return options.inverse(indexs);
     }
});
Handlebars.registerHelper("renderYear", function(indexs,options) {
    let i = indexs.index;
    if(i % 4 != 3){
        return options.fn(indexs);
    }else{
        return options.inverse(indexs);
    }
});