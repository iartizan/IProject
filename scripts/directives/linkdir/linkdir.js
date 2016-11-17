/**
 * Created by artizan.he on 2016/2/23.
 */
iProject.directive('linkDir',function(){
    return{
        restrict:"E",
        replace:true,
        templateUrl:'scripts/directives/linkdir/linkdir.html',
        scope:{
            "linkUrl":'=',
            "linkText":'@',
            "linkFun":'&'
        }
    }
});
