/*
	main_matching.js entry
	
	************************
	@author: kezunlin
	@create date: 2016-04-19
	@update date: 2016-04-19
	@version: v1.0
	************************	
*/

//=========================================================================
function baidu2fs(point_bd){
	var bd = {lon:point_bd.lng,lat:point_bd.lat}; // lng,lat
	var result = baidu_to_fs_allInOne(bd);
	var fs = new Geo.LonLat(result.lon,result.lat);
	return fs;
};

function fs2baidu(point_fs){
	var fs = {lon:point_fs.lon,lat:point_fs.lat}; // lon,lat
	var result = fs_to_baidu_allInOne(fs);
	var bd = new BMap.Point(result.lon,result.lat);
	return bd;
};
//=========================================================================

// global variables
var map;
var fsmap,vectorLayer;

var point_fs = new Geo.LonLat(508005.71000913,2546218.3446376);
var point_fs = new Geo.LonLat(511466.37936879694,2546847.857516554); // ERROR POINT
var point_bd = fs2baidu(point_fs);
var level_bd = 13;// level 1-19
var level_fs = 0;// level 0-7

// main entry for js
function main_entry(){
	init_map();
	init_fsmap();
	
	register_ui_events_dom(); // old style
	//register_ui_events_jquery(); // new style
}

function init_map(){
	//==============================================================================
	// baidu map
	//==============================================================================
	// close defaut POI click event
	map = new BMap.Map("left",{enableMapClick:false});
	map.centerAndZoom(point_bd,level_bd);
	map.setCurrentCity("佛山市");

	map.setMapType(BMAP_HYBRID_MAP);
	//map.setMapType(BMAP_SATELLITE_MAP);
	//map.setMapType(BMAP_NORMAL_MAP);

	map.addControl(new BMap.NavigationControl());           
	map.addControl(new BMap.MapTypeControl());  	
	map.enableScrollWheelZoom(true);                           
	map.disable3DBuilding();
	map.setDefaultCursor("crosshair"); 

	/*
	1) zoom：只能根据zoom百度地图，zoom佛山地图（单向，应为fs_map没有zoom事件）
	2) [删除]move：根据move百度地图，move佛山地图（单向，应为fs_map没有move事件）
	3) click: 双向，clickBaiduMap和clickFSMap
	*/
	map.addEventListener("zoomend",function(e){
		console.log("zoomend");
		var newlevel_bd = map.getZoom();// by ke
		zoomBaidu(newlevel_bd);
	});

	/*
	map.addEventListener("moveend",function(e){
		//console.log("moveend");
		//moveBaiduMap();
	});
	*/
	
	map.addEventListener("click",function(e){
		clickBaiduMap(e.point);
	});

}

//**********************************************************
function zoomBaidu(newlevel_bd){
	// update FS level
	level_fs = newlevel_bd - level_bd + level_fs;
	
	//console.log("new fs level:"+level_fs);
	
	// update Baidu level
	level_bd = newlevel_bd;

	// update map
	map.centerAndZoom(point_bd,level_bd);
	fsmap.setCenter(point_fs, level_fs);
}

/*
function moveBaiduMap(){
	point_bd = map.getCenter();
	
	// move fs map by baidu center
	point_fs = baidu_to_fs2(point_bd);
	fsmap.setCenter(point_fs, level_fs);
}
*/
//**********************************************************


function init_fsmap(){
	//Proj4js.defs["CUSTOM:FOSHAN113"] = "+proj=tmerc +ellps=IAU76 +lat_0=-0.000389 +lon_0=113.000750 +k=1 +x_0=500000 +y_0=0 +units=m +no_defs";
	//Proj4js.defs["CUSTOM:FOSHAN113"] = "+proj=tmerc +a=6378140 +b=6356755.288157528 +lat_0=-0.000131 +lon_0=113.001025 +k=1 +x_0=500000 +y_0=0 +units=m +no_defs";
	Proj4js.defs["CUSTOM:FOSHAN113"] = "+proj=tmerc +ellps=IAU76 +lat_0=-0.000131 +lon_0=113.001025 +k=1 +x_0=500000 +y_0=0 +units=m +no_defs";

	// xian 3-degree 114
	Proj4js.defs["EPSG:2383"] = "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs";
	// wgs84
	Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

	var fs_proj = new OpenLayers.Projection("CUSTOM:FOSHAN113");
	var wgs_proj = new OpenLayers.Projection("EPSG:4326");
	var xian_proj = new OpenLayers.Projection("EPSG:2383");
	// vector layer
	vectorLayer = new OpenLayers.Layer.Vector("Point Layer"); // global variable

	var customPyramid = {
		name : "customPyramid",//金字塔名称
		topLevelIndex : 0,//层之间比例关系-顶层层数
		bottomLevelIndex : 20,//层之间比例关系-最底层层数
		scaleX : 2,//层之间比例关系-X方向倍数
		scaleY :2,//层之间比例关系-Y方向倍数	
		topTileFromX : -20037508.3427892,//顶层第一个瓦片的范围FromX
		topTileFromY : 20037508.3427892,//顶层第一个瓦片的范围FromY
		topTileToX : 20037508.3427892,//顶层第一个瓦片的范围ToX
		topTileToY : -20037508.3427892,//顶层第一个瓦片的范围ToY
		tileSize : new Geo.Size(256,256),//单个瓦片信息-宽度和高度
		originRowIndex : 0,//单个瓦片信息-行起始索引
		originColIndex : 0,//单个瓦片信息-列起始索引
		units:"m",//平面坐标值单位为m
		maxExtent : new Geo.Bounds(-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892)//数据范围描述
	};
	var options = {
		units: "m",//地图单位
		pyramid:new Geo.Pyramid(customPyramid),//地图金字塔
		//配置-Proj4js.defs["CUSTOM:FOSHAN113"]-后,开启下面2个才会显示经纬度.否则,仍旧是地图金字塔定义的.
		projection: fs_proj
		/*
		,//地图投影
		displayProjection: wgs_proj//地图显示投影
		*/
	}
	fsmap = new Geo.View2D.Map("right", options); // global variable
	fsmap.addControl(new OpenLayers.Control.MousePosition());

	function getRes(scales) {
		var res = [];
		var scaleStr = scales.split(",");
		for(var i = 0, j = scaleStr.length; i < j;i++) {
			res.push(fsmap.pyramid.getResolutionForScale(parseFloat(scaleStr[i])));
		}
		return res;
	}

	// 2016-4-14 
	// old url  http://19.133.29.238:7002
	// new url  http://19.134.126.50:9010

	//1-矢量
	var fsRes = getRes("72223.96373402483,36111.981867012415,18055.990933506208,9027.995466753104,4513.997733376552,2256.998866688276,1128.499433344138,564.249716672069");
	var fslayer = new Geo.View2D.Layer.WMTS({
		name : "CCGTMAP15_20",
		url :  "http://19.134.126.50:9010/CCGTMAP13_20/wmts",
		matrixSet: "Matrix_0",
		style : "CCGTMAP15_20",
		layer : "CCGTMAP15_20",
		resolutions: fsRes,
		format : "image/tile",
		zoomOffset: 13,//地图偏移量
		maxResolution :fsRes[0],//最大分辨率
		minResolution :fsRes[fsRes.length - 1],//最小分辨率
		tileFullExtent:Geo.Bounds.fromString("494043.57239999995,2535990.899700001,518379.2123999996,2552105.0396999996")
	});
	//2-影像
	var fsRes_yx = getRes("72223.96373402483,36111.981867012415,18055.990933506208,9027.995466753104,4513.997733376552,2256.998866688276,1128.499433344138,564.249716672069");
	var fslayer_yx = new Geo.View2D.Layer.WMTS({
		name : "CCGTWP2015",
		url :  "http://19.134.126.50:9010/CCGTWP2015/wmts",
		matrixSet: "Matrix_0",
		style : "CCGTWP2015",
		layer : "CCGTWP2015",
		resolutions: fsRes_yx,
		format : "image/tile",
		zoomOffset: 13,//地图偏移量
		maxResolution :fsRes_yx[0],//最大分辨率
		minResolution :fsRes_yx[fsRes_yx.length - 1],//最小分辨率
		tileFullExtent:Geo.Bounds.fromString("495626.68421803735,2534378.9967090613,518629.3342180374,2553836.8967090617")
	});
	//3-2.5d
	var fsRes_25d = getRes("72223.96373402483,36111.981867012415,18055.990933506208,9027.995466753104,4513.997733376552,2256.998866688276,1128.499433344138,564.249716672069");
	var fslayer_25d = new Geo.View2D.Layer.WMTS({
		name : "CCGTFZH2013",
		url :  "http://19.134.126.50:9010/CCGTFZH2013/wmts",
		matrixSet: "Matrix_0",
		style : "CCGTFZH2013",
		layer : "CCGTFZH2013",
		resolutions: fsRes_25d,
		format : "image/tile",
		zoomOffset: 13,//地图偏移量
		maxResolution :fsRes_25d[0],//最大分辨率
		minResolution :fsRes_25d[fsRes_25d.length - 1],//最小分辨率
		tileFullExtent:Geo.Bounds.fromString("496117.80467445566,2535231.9442850314,517781.26885500166,2552716.944999657")
	});

	// map click
	var ctrlDrawPoint = new Geo.View2D.Control.DrawPoint({
		curView:this,
		id:"openlayer_specialOverlayPointClickControl",
		persist:false,
		done:function(geometry){
			var pt = {lon:geometry.x,lat:geometry.y};//evt.object.getLonLatFromLayerPx(evt.xy);
			clickFSMap(pt);
		}
	});
	fsmap.addControl(ctrlDrawPoint);
	ctrlDrawPoint.activate();

	//fsmap.addLayers([fslayer,vectorLayer]); // vector
	fsmap.addLayers([fslayer_yx,vectorLayer]); // image
	//fsmap.addLayers([fslayer_25d,vectorLayer]); // image25d
	fsmap.setCenter(point_fs, level_fs);
	addFSPoint(point_fs);
}

function register_ui_events_dom(){
	document.getElementById("createGrid").onclick = function(){ 
		zoomBaidu(13);
		createGrid();
	};

	document.getElementById("showPoints").onclick = function(){ 
		showPoints(point_pairs);
	};

	document.getElementById("outputPoints").onclick = function(){ 
		outputPoints();
	};

	document.getElementById("saveFSPoint").onclick = function(){ 
		saveFSPoint();
	};
	document.getElementById("saveBaiduPoint").onclick = function(){ 
		saveBaiduPoint();
	};

	// save and load points
	document.getElementById("savePoints").onclick = function(){ 
		savePoints();
	};

	document.getElementById("saveField").onclick = function(){ 
		saveField();
	};

	document.getElementById("showByGrid").onclick = function(){ 
		showByGrid();
	};

	document.getElementById("test").onclick = function(){ 
		test();
	};

	showPointCount(point_pairs);// show count on startup
}

function test(){
};

// ===================================================================
// grid related
// ===================================================================
var xmin = 497000;
var xmax = 517000;
var ymin = 2536000;
var ymax = 2551000;
var x_delta = 5000;
var y_delta = 5000;

// 511466.37936879694 2546847.857516554
function createGrid(){
	for(var x = xmin; x<xmax; x+=x_delta) // 20
		for(var y = ymin; y<ymax; y+=y_delta){ // 15
			var pt_fs = new Geo.LonLat(x,y);
			addGridByFSPoint(pt_fs);
		}
};
			
function addGridByFSPoint(pt_fs){
	var grid_index = getPointGridIndex(pt_fs);
	var grid_points= get4GridPointsByIndex(grid_index);
	//var points_in_grid = getPointsInGrid(grid_index);
	var grid_center_bd = getBaiduGridCenter(grid_points);
	
	// baidu
	addBaiduGridLine(grid_points);
	addBaiduGridLabel(grid_index,grid_center_bd);
	
	// fs
	addFSGridLine(grid_points);
};

function getPointGridIndex(pt_fs){
	var x = parseInt((pt_fs.lon-xmin)/x_delta);
	var y = parseInt((pt_fs.lat-ymin)/y_delta);
	return {x:x,y:y};
};

function get4GridPointsByIndex(grid_index){
	var ix = grid_index.x;
	var iy = grid_index.y;
	
	// left origin 
	var x = ix*x_delta+xmin;
	var y = iy*y_delta+ymin
	
	var points = [
		[x,y],
		[x+x_delta,y],
		[x+x_delta,y+y_delta],
		[x,y+y_delta],
	];
	
	points.forEach(function(p){
		var pt_fs = new OpenLayers.LonLat(p[0],p[1]);
		var pt_bd = fs2baidu(pt_fs);
		
		// push bd point
		p.push(pt_bd.lng);
		p.push(pt_bd.lat);
	});
	
	return points;
};

function getBaiduGridCenter(grid_points){
	var p1 = grid_points[0];
	var p2 = grid_points[2];
	
	var cx = (p1[2]+p2[2])/2;
	var cy = (p1[3]+p2[3])/2;
	var grid_center_bd = new BMap.Point(cx,cy);
	return grid_center_bd;
};

function getPointsInGrid(grid_index){
	var points_in_grid = [];
	point_pairs.forEach(function(p){
		var pt_fs = new OpenLayers.LonLat(p[0],p[1]);
		var pt_bd = new BMap.Point(p[2],p[3]);
		
		var index = getPointGridIndex(pt_fs);
		if(index.x ==grid_index.x && index.y==grid_index.y){
			points_in_grid.push(p);
		}
	});
	
	return points_in_grid;
}

function showByGrid(){
	var x = 0;
	var y = 0;
	var grid_index = {x:x,y:y};
	var points_in_grid = getPointsInGrid(grid_index);
	
	clearPoints();
	showPoints(points_in_grid);
	
	var p = points_in_grid[0];
	var pt_fs = new OpenLayers.LonLat(p[0],p[1]);
	addGridByFSPoint(pt_fs);
}

function showPoints(points){
	// for each data to add points to map
	points.forEach(function(p){
		var pt_fs = new OpenLayers.LonLat(p[0],p[1]);
		addFSPoint(pt_fs);
		
		var pt_bd = new BMap.Point(p[2],p[3]);
		addBaiduPoint(pt_bd);
	});
};

function clearPoints(){
	map.clearOverlays();
	vectorLayer.removeAllFeatures();
	
	// add grid all the time 
	//createGrid();
};

function showPointsInGrid(point_fs){
	var grid_index = getPointGridIndex(point_fs);
	var points_in_grid = getPointsInGrid(grid_index);
	showPoints(points_in_grid);
};

function showPointsInRadius(point_fs,r){
	var points_in_radius = getPointsInRadius_3Level(point_fs,r);
	showPoints(points_in_radius);
	
	// output points count
	document.getElementById('info').innerHTML= points_in_radius.length;	
}

//==============================================================================
// output and save points
//==============================================================================
var current_fs_bd = []; // current fs and bd pairs from hand click

function saveFSPoint(){
	// reset point 
	current_fs_bd = [];
	current_fs_bd.push(point_fs.lon);
	current_fs_bd.push(point_fs.lat);
	
	outputSaveProgress();
}

function saveBaiduPoint(){
	// save fs point first
	if(current_fs_bd.length!=2){
		alert("请先保存佛山坐标");
		return;
	}else if(current_fs_bd.length ==2){
		current_fs_bd.push(point_bd.lng);
		current_fs_bd.push(point_bd.lat);
	
		outputSaveProgress();
	
		// final save
		point_pairs.push(current_fs_bd);
		current_fs_bd = [];

		// show point count
		showPointCount(point_pairs);
		
		// show 
		//showPoints(point_pairs);
	}
};

function showPointCount(point_pairs){
	var content = point_pairs.length;
	document.getElementById('count').innerHTML= "#"+content;
}

function outputSaveProgress(){
	var content = "";
	if(current_fs_bd.length==2){
		content = "+"+current_fs_bd[0]+","+current_fs_bd[1];
	}else if(current_fs_bd.length==4){
		content = "+"+current_fs_bd[0]+","+current_fs_bd[1]+","+current_fs_bd[2]+","+current_fs_bd[3];
	}
	document.getElementById('info').innerHTML= content;	
};

function pointList2Str(point_pairs){
	/*
	[
	[a,b,c,d],
	[a,b,c,d],
	];
	
	[[499522.99136213,2548898.4179421,113.009035,23.042472],[499554.04390487,2548723.448807,113.0079,23.040504],]
	*/
	var str = "";
	str = "[";
	point_pairs.forEach(function(p){
		//console.log(p.length);
		str +="[";
		str += p[0]+","+p[1]+","+p[2]+","+p[3];
		str +="],";
	});
	str +="]";
	return str;
}

function outputPoints(){
	var str = pointList2Str(point_pairs);
	var title = point_pairs.length;
	console.log("====================================");
	console.log(str);
	window.prompt(title, str);
}

function savePoints(){
	var str = pointList2Str(point_pairs);
	var filename = "points.txt";
	download(filename,str);
}

function pointList2Str_ByField(i){
	// i = 0,1,2,3
	var str = "";
	point_pairs.forEach(function(p){
		str += p[i]+"\r\n";
	});
	return str;
}

function saveField(){
	//500609.09693615,2549401.6559681,113.01888,23.047282
	// 0-2,1-3
	for(var field = 0;field<4;field++){
		var str = pointList2Str_ByField(field);
		var filename = "points-"+field+".txt";
		download(filename,str);
	}
};

//==========================================================
// click baidu and fs
//==========================================================
function clickBaiduMap(pt){
	point_bd = pt;
	centerFS(point_bd);
}

function clickFSMap(pt){
	point_fs = pt;
	centerBaidu(point_fs);
	/*
	//showPointsInGrid(point_fs);
	showPointsInRadius(point_fs,DEFAUL_RADIUS);
	*/
}

function centerFS(point_bd){
	// clear points
	clearPoints();
	
	// baidu
	addBaiduPoint(point_bd);
	
	// fs
	//point_fs = baidu_to_fs2(point_bd);
	point_fs = baidu2fs(point_bd); // USE NEW VERSION
	fsmap.setCenter(point_fs, level_fs);
	addFSPoint(new OpenLayers.LonLat(point_fs.lon,point_fs.lat));

	// output points		
	output2Point(point_bd,point_fs);
}

function centerBaidu(point_fs){
	// clear points
	clearPoints();
	
	// fs
	addFSPoint(new OpenLayers.LonLat(point_fs.lon,point_fs.lat));
	
	// baidu
	//point_bd = fs2baidu(point_fs);
	point_bd = fs2baidu(point_fs); // USE NEW VERSION
	//map.centerAndZoom(point_bd,level_bd); // triger moveend
	map.setCenter(point_bd);
	addBaiduPoint(point_bd);
	
	// output points
	output2Point(point_bd,point_fs);
}

function output2Point(point_bd,point_fs){
	//return;
	var text_bd = point_bd.lng + "," + point_bd.lat; // lng, lat
	document.getElementById('bd').innerHTML= text_bd;	
	
	var text_fs = point_fs.lon + "," + point_fs.lat; // lon, lat
	document.getElementById('fs').innerHTML= text_fs;	
}