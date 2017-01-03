// by kezunlin 
// date 2015-9-16
//
var map;
var vector,vectoranno,image,imageanno;
var center;

var csv,layer1,layer2,layer3;

require([
	"dojo/on",
	"dojo/dom",
	"dojo/parser", 
	"esri/graphic",
	"esri/layers/GraphicsLayer",
	"esri/layers/CSVLayer",
	"esri/Color",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/symbols/PictureMarkerSymbol",
        "esri/renderers/SimpleRenderer",
        "esri/InfoTemplate",
        "esri/urlUtils",

        "esri/map", 
	"esri/dijit/OverviewMap",
	"esri/dijit/HomeButton",
        "esri/dijit/Basemap", 
        "esri/dijit/BasemapLayer", 
        "esri/dijit/BasemapGallery", 
        "esri/dijit/BasemapToggle",
        "esri/dijit/LayerList",
        "esri/arcgis/utils",
	"esri/geometry/Extent",
	"esri/geometry/Point",
	"js/tdt/TdtVectorLayer",
	"js/tdt/TdtVectorAnnoLayer",
	"js/tdt/TdtImageLayer",
	"js/tdt/TdtImageAnnoLayer",
	"js/baidu/BaiduVectorLayer",
	"js/baidu/BaiduAnnoLayer",
	"js/baidu/BaiduImageLayer",
        "esri/dijit/Measurement",
        "esri/dijit/Scalebar",
	"dijit/layout/BorderContainer", 
	"dijit/layout/ContentPane", 
        "dijit/TitlePane",
	"dojo/domReady!"
      ], function (
 	on,
	dom,
        parser,
	Graphic,
	GraphicsLayer,
	CSVLayer,
	Color,
	SimpleMarkerSymbol,
	PictureMarkerSymbol,
	SimpleRenderer,
	InfoTemplate,
	urlUtils,
        Map, 
	OverviewMap, 
	HomeButton,
	Basemap,
	BasemapLayer,
	BasemapGallery,
	BasemapToggle,
	LayerList,
        arcgisUtils,
	Extent,
	Point,
	TdtVectorLayer,
	TdtVectorAnnoLayer,
	TdtImageLayer,
	TdtImageAnnoLayer,
	BaiduVectorLayer,
	BaiduAnnoLayer,
	BaiduImageLayer,
	Measurement,
	Scalebar
      ) {
        parser.parse(); 
	main();

	function main(){
		initExtent = new Extent({"xmin":113.0582,"ymin":23.0209,"xmax":113.17527,"ymax":23.0366,"spatialReference":{"wkid":4326}});
		center = new Point({"x": 113.1030, "y": 23.0298, "spatialReference": {"wkid": 4326 } });
		map = new Map("map", {
	    		center: center,
			zoom: 14,
	    		logo: false
		});
		map.on("load",onMapLoad);
		map.on("click",onMapClick);

		//initImageLayer();	
		//initBasemapGallery();
		//initBasemapToggle();

		initHomeButton();
		initVectorLayer();	

		// for html ui
		registerUIEvents();
	}

	function onMapLoad(e){
		addLayer();
	}
	function onMapClick(e){
		// e.mapPoint e.screenPoint
		// e.graphics
		// geometry,
		console.log(e.mapPoint);
	}
	function initHomeButton(){
		var home = new HomeButton({
        		map: map
      		}, "HomeButton");
      		home.startup();
	}
	function initLayerList(){
		var layerList = new LayerList({
    			map: map,
    			layers: [csv]
  		},"LayerList");
		layerList.on('toggle',onToggleLayerList);
		layerList.startup();
	}
	function onToggleLayerList(e){
		// layerIndex visible
		console.log(e);
	}

	function addLayer(){
		var urlprefix = "http://localhost";
		var data_url = urlprefix + "/map/data/layer.json";

		csv = new GraphicsLayer();		
		csv.id = "jinggai";
        	var orangeRed = new Color([238, 69, 0, 0.5]); // hex is #ff4500
        	var marker = new SimpleMarkerSymbol("solid", 15, null, orangeRed);
		var marker = new PictureMarkerSymbol(urlprefix+"/map/image/jinggai.jpg", 15, 15);
        	var renderer = new SimpleRenderer(marker);
        	csv.setRenderer(renderer);
        	var template = new InfoTemplate("ID: ${id}", "Address: ${address} </br> Image: <img src='${image}'/>");
        	csv.setInfoTemplate(template);

		// get json data
		$.ajax({       
			type:"GET",       
			url:data_url,
			dataType:"json",       
			success: function (data) {            
				$.each(data, function(i,e){           
					var pt = new Point(e.longitude,e.latitude,map.spatialReference);
					//console.log(pt);
		 			var attr = {"id":e.id,"address":e.address,"image":urlprefix+"/map/image/jinggai.jpg"};
  					var graphic = new Graphic(pt,marker,attr,template);
					csv.add(graphic);
				});
				csv.on("mouse-over",onMouseOver);
				csv.on("mouse-out",onMouseOut);
        			map.addLayer(csv);
			},
			error: function (data) {
				console.log(data);
			}
		});  

		/*
		data.forEach( function(e){
			var pt = new Point(e.longitude,e.latitude,map.spatialReference);
			//console.log(pt);
  			var attr = {"id":e.id,"address":e.address,"image":urlprefix+"/map/image/jinggai.jpg"};
  			var graphic = new Graphic(pt,marker,attr,template);
			csv.add(graphic);
		})
		csv.on("mouse-over",onMouseOver);
		csv.on("mouse-out",onMouseOut);
        	map.addLayer(csv);
		*/
	}

	function onMouseOver(e){
		map.setCursor("pointer");
	}
	function onMouseOut(e){
		map.setCursor("default");
	}

	function initVectorLayer(){
		vector = new TdtVectorLayer();
		map.addLayer(vector);

		vectoranno = new TdtVectorAnnoLayer();
		map.addLayer(vectoranno);
	}

	function initImageLayer(){
		image = new TdtImageLayer();
		map.addLayer(image);

		imageanno = new TdtImageAnnoLayer();
		map.addLayer(imageanno);
	}

	function initOverviewMap(){
		overviewMap = new OverviewMap({
    			map: map
  		}, dom.byId('OverviewMap'));
        	overviewMap.startup();
	}

	function initScalebar(){
		var scalebar = new Scalebar({
        		map: map,
        		scalebarUnit: "dual"
        	});
	}

	function initBasemapGallery(){
      		//add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
      		var basemapGallery = new BasemapGallery({
        		showArcGISBasemaps: false,
        		map: map
      		}, "basemapGallery");
      		basemapGallery.startup();
      		basemapGallery.on("error", function(msg) {
        		console.log("basemap gallery error:  ", msg);
      		});
	}

	function initBasemapToggle(){
		vector = new TdtVectorLayer();
		image = new TdtImageLayer();

		basemap = BasemapLayer();
      		var toggle = new BasemapToggle({
        		map: map,
        		basemap: "satellite"
      		}, "BasemapToggle");
      		toggle.startup();
	}

	function initMeasurement(){
        	var measurement = new Measurement({
        		map: map
        	}, dom.byId("measurementDiv"));
        	measurement.startup();
	}

	// for html ui events
	function registerUIEvents(){
		$("#button").bind('click',onclick);
	}
	function onclick(e){
		console.log(e);
		initImageLayer();
	}

});

