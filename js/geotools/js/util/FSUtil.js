/*
	fs util
	
	************************
	@author: kezunlin
	@create date: 2015-11-24
	@update date: 2015-11-24
	@version: v1.4
	************************
	
	global variable:  fsmap, vectorLayer
*/

function fs_demo_style(){
	var myStyles = new OpenLayers.StyleMap({
			"default": new Geo.Style({
				pointRadius: 8,
				fillColor: "black",
				strokeColor: "#666666",
				strokeWidth: 2,
				graphicZIndex: 1,
				fillOpacity: 0.7
			}),
			"select": new Geo.Style({
				fillColor: "#66ccff",
				strokeColor: "#3399ff",
				graphicZIndex: 2
			})
	});
};

function addFSPoint(pt){
	var point_style_fs = OpenLayers.Util.extend({}, Geo.Feature.Vector.style["default"]);
	point_style_fs.pointRadius = 8;
	point_style_fs.strokeColor = fs_color;
	point_style_fs.fillColor = fs_color;
	point_style_fs.fillOpacity = 1.0;

	var newpoint = new Geo.Geometry.Point(pt.lon,pt.lat);
	var pointFeature = new Geo.Feature.Vector(newpoint);
	pointFeature.style = point_style_fs;
	vectorLayer.addFeatures([pointFeature]);
};
		
function addFSGridLine(grid_points){
	var line_style_fs = OpenLayers.Util.extend({}, Geo.Feature.Vector.style["default"]);
	line_style_fs.strokeColor = fs_color;
	line_style_fs.strokeWidth = 4;
	
	var line_point_pairs = [];
	grid_points.forEach(function(p){
		line_point_pairs.push(new Geo.Geometry.Point(p[0],p[1]));
	});
	line_point_pairs.push(line_point_pairs[0]);
	
	var line_fs = new Geo.Geometry.LineString(line_point_pairs);
	var lineFeature = new Geo.Feature.Vector(line_fs);
	lineFeature.style = line_style_fs;
	vectorLayer.addFeatures([lineFeature]);
}


// baidu fs util entry
function FSUtil() {
	// fields
	//this.point_pairs = point_pairs;
	
	// methods
	//this.download = download;
};