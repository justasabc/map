/*
	baidu util
	
	************************
	@author: kezunlin
	@create date: 2015-11-24
	@update date: 2016-03-4
	@version: v1.2
	************************
	
	global variable:  map
*/

function addBaiduPoint(pt){
	var marker = new BMap.Marker(pt);
	map.addOverlay(marker);
	
	//setMarkerLabel(marker,"1");
}

function setMarkerLabel(marker,label_text){
	var label = new BMap.Label(label_text,{offset:new BMap.Size(5,-5)});
	marker.setLabel(label);
}

// add baidu marker (2016-03-02)
function addBaiduMarker(pt,address){
	var marker = new BMap.Marker(pt);
	map.addOverlay(marker);
	setMarkerLabel(marker,address); // set label
	
	// return marker so that marker will be used outside
	return marker;
}

function addBaiduCircle(point,radius){
	var options = {fillColor:"red", strokeWeight: 5 ,fillOpacity: 0.3, strokeOpacity: 0.3};
	var circle = new BMap.Circle(point,radius,options);
	map.addOverlay(circle);
}

function addBaiduGridLabel(grid_index,grid_center_bd){
	var label_style_bd = {"z-index":"1000000","width":"20px","border":"4px solid #ccff00"};
	var label_text = grid_index.x+"-"+grid_index.y;
	var gridLabel = new BMap.Label(label_text);
	gridLabel.setStyle(label_style_bd);
	gridLabel.setPosition(grid_center_bd);
	map.addOverlay(gridLabel);
}

function addBaiduGridLine(grid_points){
	var line_points_bd = [];
	grid_points.forEach(function(p){
		line_points_bd.push(new BMap.Point(p[2],p[3]));
	});
	line_points_bd.push(line_points_bd[0]);
	
	var line_style_bd = {strokeColor:"red",strokeWeight:4,strokeOpacity:1.0};
	var line_bd = new BMap.Polyline(line_points_bd,line_style_bd);
	map.addOverlay(line_bd);
}
