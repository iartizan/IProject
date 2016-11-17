/**
 * Created by artizan.he on 2016/2/23.
 */
iProject.filter('capitalize',function(){
    return function(value){
        if(value){
            return value[0].toUpperCase() + value.slice(1);
        }
    }
});