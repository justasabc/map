// by kezunlin 
// date 2015-9-16
//

require([
	"dojo/on","dojo/dom","dojo/parser", "esri/map", "esri/geometry/Extent","esri/geometry/Point",
	//"js/lib.layer",
	"js/ke_mylayer",
	"dojo/domReady!"
      ], function (
 	on,dom,parser,Map,Extent,Point
      ) {
    parser.parse(); 
		var initExtent = new Extent({"xmin":113.0582,"ymin":23.0209,"xmax":113.17527,"ymax":23.0366,"spatialReference":{"wkid":4326}});
		var center = new Point({"x": 113.1030, "y": 23.0298, "spatialReference": {"wkid": 4326 } });
		var map = new Map("map", {
	    	center: center,
			zoom: 14,
	    	logo: false
		});
		//CCSLLayer,CCYXLayer,CCGTFZH,  参考lib.layer.js文件
		var mylayer = new CCSLLayer();
		map.addLayer(mylayer);
});

