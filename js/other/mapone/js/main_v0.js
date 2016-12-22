// by kezunlin 
// date 2015-9-16
//

dojo.require("esri.map");
var map;

function init() {
	var url = "http://19.134.126.50/cczfgis/scripts/esri/lib.layer.js";
	$.ajax({
		type: "GET", url: url, dataType: "script",
		success: initMap, error: function (a, b, c) {
			if (a.status == '404') {
				alert('服务器缺少lib.layer文件');
			}
			success();
		}
	});
}

//初始化
function initMap() {

	//初始化地图控件
	map = new esri.Map("map", {
		//basemap: "streets",
		//center: [500817, 2550455],
		//zoom: 13,
		logo: false
	});
	//添加矢量图层
	var wmts = new CCSLLayer();
	wmts.id = 'wmts';
	map.addLayer(wmts);
	var wmts_anno = new CCSLLayer_Anno();
	wmts_anno.id = 'wmts_anno';
	map.addLayer(wmts_anno);


	//添加卫片
	var wp = new CCYXLayer();
	wp.id='wp';
	map.addLayer(wp);
	wp.setVisibility(false);  //关闭卫片

	//添加2.5
	var l25 = new CCGTFZH();
	l25.id = 'l25';
	map.addLayer(l25);
	l25.setVisibility(false);  //关闭2.5

	//定位到佛山地区,并设置为第5层
	var xy = { x: 510913.569, y: 2547824.903 };//佛山市府附近的点坐标
	var cPoint = new esri.geometry.Point(xy);
	cPoint.spatialReference = null;
	map.centerAndZoom(cPoint, 5);
	
	var url = 'http://19.134.126.50/ArcGIS/rest/services/CCZF_CAMERA/MapServer';
	var camera_layer = new esri.layers.ArcGISTiledMapServiceLayer(url);
	map.addLayer(camera_layer);
}

function openLayer(layer) {
	map.getLayer('wmts').setVisibility(false);
	map.getLayer('wmts_anno').setVisibility(false);
	map.getLayer('wp').setVisibility(false);
	map.getLayer('l25').setVisibility(false);
	var ls = layer.split(',');
	for (var i = 0; i < ls.length;i++){
		map.getLayer(ls[i]).setVisibility(true);
	}
}

function main(){
	//页面加载完成后执行初始化
	dojo.ready(init);
}

