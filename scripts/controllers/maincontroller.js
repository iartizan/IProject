/**
 * Created by artizan.he on 2016/2/22.
 */
iProject.controller('mainController',['$scope','$timeout','$filter',
    function($scope,$timeout,$filter){

        /*根据时间 获取 星期*/
        function getWeekDay(time){
            var dayIndex=time.getDay();
            var weekDays=['周日','周一','周二','周三','周四','周五','周六'];
            return weekDays[dayIndex];
        }

        /*根据时间 获取 星期*/
        function getWeekDayIndex(time){
            var dayIndex=time.getDay();
            // var weekDays=['周日','周一','周二','周三','周四','周五','周六'];
            return dayIndex;
        }

        // $scope.today=new Date();
        // $scope.todayWeekday=getWeekDay(today);
        // console.log(getWeekDayIndex(today));

        function getToday(id) {
            var today=new Date();
            var dayIndex=today.getDay();
            if(id==dayIndex){
                return today;
            }else if(id > dayIndex){
                return today.valueOf() + (id-dayIndex) * 24 * 60 * 60 * 1000;
            }else if(id < dayIndex){
                return today.valueOf() - (dayIndex-id) * 24 * 60 * 60 * 1000;
            }
        }

        function isToday(id) {
            var today=new Date();
            var dayIndex=today.getDay();
            if(id==dayIndex){
                return true;
            }else{
                return false;
            }
        }

        function getContents(id) {
            var weekDayContents=[[],[],[],[],[],[],[]];
            angular.forEach($scope.contents,function (item) {
                if(item.weekDay == id){
                    weekDayContents[id].push(item);
                }
            });
            return weekDayContents[id];
        }

        $scope.contents=[
            {weekDay:6,name:'Tyrant1',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:6,name:'Tyrant',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:6,name:'Tyrant',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            // {weekDay:6,name:'Tyrant',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            // {weekDay:6,name:'Tyrant',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            // {weekDay:6,name:'Tyrant6',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:1,name:'Re0',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:1,name:'Re01',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:1,name:'Re02',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            // {weekDay:1,name:'Re03',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            // {weekDay:1,name:'Re04',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:2,name:'The Night Of',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:2,name:'The Night Of',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:2,name:'The Night Of',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:2,name:'The Night Of',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:3,name:'Mr.Robot',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:3,name:'Mr.Robot',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:3,name:'Mr.Robot',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:0,name:'暴君 S04',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:0,name:'Tyrant',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:0,name:'Tyrant',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:5,name:'Tyrant',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:5,name:'Tyrant',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:5,name:'Tyrant',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:4,name:'Tyrant',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:4,name:'Tyrant',url:'https://www.baidu.com',imageUrl:'images/part.png'},
            {weekDay:4,name:'Tyrant',url:'https://www.baidu.com',imageUrl:'images/part.png'}
        ];

        $scope.week=[
            {id:6,name:'周六',date:getToday(6),notLast:true,isToday:isToday(6),contents:getContents(6)},
            {id:0,name:'周日',date:getToday(0),notLast:true,isToday:isToday(0),contents:getContents(0)},
            {id:1,name:'周一',date:getToday(1),notLast:true,isToday:isToday(1),contents:getContents(1)},
            {id:2,name:'周二',date:getToday(2),notLast:true,isToday:isToday(2),contents:getContents(2)},
            {id:3,name:'周三',date:getToday(3),notLast:true,isToday:isToday(3),contents:getContents(3)},
            {id:4,name:'周四',date:getToday(4),notLast:true,isToday:isToday(4),contents:getContents(4)},
            {id:5,name:'周五',date:getToday(5),notLast:false,isToday:isToday(5),contents:getContents(5)}
        ];



        $scope.picShow=true;
        $scope.showPic=function(item){
            item.picShow=true;
        };
        $scope.hidePic=function(item){
            item.picShow=false;
        };


        var tictoc=function(){
            $scope.clock=$filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
            $timeout(function(){
                tictoc();
            },1000);

        };

        tictoc();

        $scope.count=123.456789;
        $scope.digits=2;
        $scope.strCap="i don't know.";
        $scope.email="123@123.com";

        $scope.myObj={
            myUrl:"http://www.baidu.com"
        };
        $scope.myUrl=$scope.myObj.myUrl;
        $scope.inputText="初始值";

        $scope.changeValue=function(){
            $scope.inputText="Another";
            $scope.myObj.myUrl="http://www.google.com";
        };

        $scope.continue=true;
        $scope.hour=0;
        $scope.minute=58;
        $scope.second=58;
        $scope.count=0;
        var count=function(){
            $timeout(function () {
                $scope.count += 1;
                if($scope.count == 99){
                    //0 58 58 99
                    $scope.second += 1;
                    //0 58 59 99
                    if($scope.second == 59){
                        $scope.count=0;
                        //0 58 59 0
                        continueCount();
                    }

                    if($scope.second == 59){
                        $scope.minute += 1;
                        $scope.second=0;
                        if($scope.minute == 59 ){
                            $scope.hour += 1;
                            $scope.minute=0;
                            $scope.second=0;
                        }
                    }
                }
                continueCount();
            },10);
        };

        var continueCount=function(){
            if($scope.continue){
                count();
            }
        };
        //continueCount();

        //count();

        $scope.stop=function(){
            $scope.continue=!$scope.continue;
            if($scope.continue){
                count();
            }
        };

        function NewDate(str) {
            str = str.split('-');
            var date = new Date();
            date.setUTCFullYear(str[0], str[1] - 1, str[2]);
            date.setUTCHours(0, 0, 0, 0);
            return date;
        }

        $scope.items=[
            {name:"噬神者",url:"http://www.iqiyi.com/a_19rrhb5by1.html?vfm=2008_aldbd",imageUrl:"images/stars.jpg"}
        ];



    }]);
