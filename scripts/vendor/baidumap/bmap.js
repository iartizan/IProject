/**
 * Created by artizan.he on 2016/2/26.
 */
//???????????
var tempMap;
function initMap(mapCon,lag,lat,zoom){
    var map = createMap(mapCon,lag,lat,zoom);//????
    setMapEvent(map);//??????
    addMapControl(map);//???????
    return map;
}
function createMap(mapCon,lag,lat,zoom){
    var map = new BMap.Map(mapCon);
    lag = lag>0?lag:114.130101,
        lat=lat>0?lat:22.487756,
        zoom=zoom>0?zoom:15;
    map.centerAndZoom(new BMap.Point(lag,lat),zoom);
    map.clearOverlays();
    var new_point = new BMap.Point(lag,lat);
    var marker = new BMap.Marker(new_point);  // ????
    map.addOverlay(marker);              // ?????????
    map.panTo(new_point);
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
    return map;
}
function setMapEvent(map){
    map.enableScrollWheelZoom();
    map.enableKeyboard();
    map.enableDragging();
}
function addClickHandler(target,window){
    target.addEventListener("click",function(){
        target.openInfoWindow(window);
    });
}
//???????
function addMapControl(map){
    var scaleControl = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
    scaleControl.setUnit(BMAP_UNIT_METRIC);
    map.addControl(scaleControl);
    var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
    map.addControl(navControl);
}
function mapSearch(all){
    var local = new BMap.LocalSearch(tempMap, {
        renderOptions: {map: tempMap, panel: "mapSearch"}
    });
    var searchBox=document.getElementById('mapSearchBox');
    var searchName = searchBox.value;

    tempMap.clearOverlays();
    if(all){ //????
        local.search(searchName);
    }else{//??????
        local.searchInBounds(searchName, tempMap.getBounds());
    }
};
/*map start*/
function loadBMap(){
    if($('#mapCon')[0]){
        var buildLat= document.getElementById('buildLat');
        var buildLong= document.getElementById('buildLong');
        var zoom= document.getElementById('zoom');
        var lag = buildLong.value,
            lat = buildLat.value,
            zVal = zoom.value;
        lag = lag>0?lag:114.130101;
        lat = lat>0?lat:22.487756,
            zVal= zVal>0?zVal:15;
        zoom.value = zVal;
        buildLong.value= lag;
        buildLat.value = lat;
        var map = initMap('mapCon',lag,lat,zVal);
        tempMap = map;
        map.addEventListener("click",function(e){
            zoom.value = map.getZoom();
            buildLong.value= e.point.lng;
            buildLat.value = e.point.lat;
        });
    }
}
function loadDivisionBMap(){
    if($('#mapCon1')[0]){
        var disLat = document.getElementById('lat1');
        var disLong = document.getElementById('long1');
        var zoom = document.getElementById('zoom1');

        var lag = disLong.value,
            lat = disLat.value,
            zVal = zoom.value;
        lag = lag>0?lag:114.130101;
        lat = lat>0?lat:22.487756,
            zVal= zVal>0?zVal:15;
        zoom.value = zVal;
        disLong.value= lag;
        disLat.value = lat;
        var map = initMap('mapCon1',lag,lat,zVal);
        tempMap = map;
        map.addEventListener("click",function(e){
            zoom.value = map.getZoom();
            disLong.value= e.point.lng;
            disLat.value = e.point.lat;
        });
    }
}

