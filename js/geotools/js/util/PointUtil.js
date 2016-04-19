/*
	baidu fs point 
	1) baidu --->fs
	2) fs--->baidu
	
	************************
	@author: kezunlin
	@create date: 2015-11-24
	@update date: 2016-03-4
	@update date: 2016-4-14
	@update data: 2016-4-19  [split point_pairs in PointPairs.js file]
	@version: v1.3
	************************
	
	@global 
	point_pairs  from PointPairs.js 
	
	NOTICE: 
	point used in this file are ***dict object  {lon:lon,lat:lat}*** 
	so that it's separated from Baidu and OpenLayers
*/
// use global point_pairs

var default_kx = 102398.7799;
var default_bx = -11072392.51;
var default_ky = 110894.2968;
var default_by = -6411.974587;
var default_kb = {kx:default_kx,bx:default_bx,ky:default_ky,by:default_by};

// dynamic update
var kx,bx,ky,by;

function setKB(result){
	kx = result.kx;
	bx = result.bx;
	ky = result.ky;
	by = result.by;
};

// ===================================================================
// baidu fs point transformation
// ===================================================================	
function baidu_to_fs(lon,lat){
	//{lon:113.114845,lat:23.032571}, ----->{lon:510416,lat:2547807}
	//var fs_lon = 102509*lon - 11084873.65; // x
	//var fs_lat = 111262*lat - 14860; // y
	
	var fs_lon = kx*lon + bx; // x
	var fs_lat = ky*lat + by; // y
	return {lon:fs_lon,lat:fs_lat};
};

function fs_to_baidu(lon,lat){
	var bd_lon = (lon-bx)/kx;
	var bd_lat = (lat-by)/ky;
	return {lon:bd_lon,lat:bd_lat};
};

function baidu_to_fs2(pt){
	var result = baidu_to_fs(pt.lon,pt.lat);
	var fs = {lon:result.lon,lat:result.lat};
	return fs;
};

function fs_to_baidu2(pt){
	var result = fs_to_baidu(pt.lon,pt.lat);
	var bd = {lon:result.lon,lat:result.lat};
	return bd;
};

// ===================================================================
// calculate nearest points
// ===================================================================
function d2FS(pt1,pt2){
	var d2 = (pt1.lon-pt2.lon)*(pt1.lon-pt2.lon)+(pt1.lat-pt2.lat)*(pt1.lat-pt2.lat);
	return d2;
};

function dFS(pt1,pt2){
	var d2 = d2FS(pt1,pt2);
	return Math.sqrt(d2);
};

/*
var DEFAULT_K = 5;
function getKNearestPoints(pt_fs,k){
	var nearestPoints = [];
	point_pairs.forEach(function(p){
		var p = new OpenLayers.LonLat(p[0],p[1]);
		//var pt_bd = new BMap.Point(p[2],p[3]);
		var d2 = d2FS(pt_fs,p);
		console.log(d2);
	});
	return nearestPoints;
};
*/

var default_radius = 1000;
function getPointsInRadius(point_fs,r){
	var points_in_radius = [];
	point_pairs.forEach(function(p){
		//var pt_fs = new OpenLayers.LonLat(p[0],p[1]);
		var pt_fs = {lon:p[0],lat:p[1]};
		var d = dFS(point_fs,pt_fs);
		//console.log(d);
		if(d < r){
			points_in_radius.push(p);
		}
	});
	return points_in_radius;
};

// @global
var min_point_count = 5;
function getPointsInRadius_3Level(point_fs,r){
	// use 3-level radius
	// 1-radius level
	var points_in_radius = getPointsInRadius(point_fs,r);
	if(points_in_radius.length<min_point_count){
		// 2-radius level
		points_in_radius = getPointsInRadius(point_fs,1.5*r);
		if(points_in_radius.length<min_point_count){
			// 3-radius level
			points_in_radius = getPointsInRadius(point_fs,2*r);
		}
	};
	
	// alert 
	if(points_in_radius.length<min_point_count){
		console.log("no enough points");
		//alert("Use global KB because there are not enough points "+points_in_radius.length);
	}
	return points_in_radius;
};

// ===================================================================
// calculate k and b for given (x1,x2,...xn) (y1,y2,...yn)
// ===================================================================
function cal_kb(xy_points){
	/*
	// formula for k and b
	k =( n(x1y1+x2y2+...+xnyn)-(x1+...+x2)(y1+...+yn) ) / ( n(x1^2+x2^2+...+xn^2) - (x1+...+x2)^2 )
	b = (y1+...+yn)/n - k*(x1+...+x2)/n
	*/
	var n = xy_points.length;
	var xy_sum = 0,x2_sum = 0,y2_sum = 0;
	var x_sum = 0,y_sum = 0;
	
	for(var i=0;i<n;i++){
		xy_sum += xy_points[i].x * xy_points[i].y;
		x2_sum += xy_points[i].x * xy_points[i].x;
		y2_sum += xy_points[i].y * xy_points[i].y;
		
		x_sum += xy_points[i].x;
		y_sum += xy_points[i].y;
	}
	
	var k =  (n*xy_sum - x_sum*y_sum)/(n*x2_sum - x_sum*x_sum);
	var b = y_sum/n - k* x_sum/n;
	return {k:k,b:b};
}

function calKB(points){
	if(points.length<2){
		return default_kb;
	}
	
	var points_x = [];
	var points_y = [];
	points.forEach(function(p){
		// 113.01888	500609.0969
		points_x.push({x:p[2],y:p[0]});
		
		//23.047282	2549401.656
		points_y.push({x:p[3],y:p[1]});
	});
	
	var kb_x = cal_kb(points_x);
	var kb_y = cal_kb(points_y);
	var new_kb = {kx:kb_x.k,bx:kb_x.b,ky:kb_y.k,by:kb_y.b};
	return new_kb;
};

// update kb by fs point
function updateKB_ByPoint(point_fs){
	var r = default_radius;
	var points_in_radius = getPointsInRadius_3Level(point_fs,r);
	var result = calKB(points_in_radius);
	setKB(result);
};

function fs_to_baidu_allInOne(point_fs){
	// update kb first 
	updateKB_ByPoint(point_fs);
	var point_bd = fs_to_baidu2(point_fs);
	return point_bd;
};

function baidu_to_fs_allInOne(point_bd){
	// get temp_point_fs from point_bd first
	setKB(default_kb);
	var temp_point_fs = baidu_to_fs2(point_bd);
	
	// update kb first 
	updateKB_ByPoint(temp_point_fs);
	var point_fs = baidu_to_fs2(point_bd);
	return point_fs;
};
