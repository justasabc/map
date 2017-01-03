// by kezunlin 
// date 2016-12-23
var map;
var featureLayer;
var heatLayer;
var spatialReference_fs,spatialReference_wgs84;
var queryTask;

var level_offset = 13;
var start_level = 13;
var end_level = 20;
var default_level = 0; // 0-7--->13-20

var vector,vectoranno,image,imageanno;
var fs_vector,fs_image,fs_25dimage;
var center;
var toolbar;
var markerSymbol,lineSymbol,fillSymbol;
var geometryService;
var use_fs = true;

require([
    "dojo/on",
    "dojo/dom",
    "dojo/parser", 
    "esri/graphic",
	
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"esri/layers/ArcGISTiledMapServiceLayer",
	"esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/CSVLayer",
	
    "esri/Color",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/CartographicLineSymbol",
    "esri/symbols/PictureFillSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/InfoTemplate",
    "esri/urlUtils",
    "esri/toolbars/draw",

    "esri/map", 
    "esri/SpatialReference", 
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

    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
	"esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/tasks/FeatureSet",

    "js/tdt/all/TdtVectorLayer",
    "js/tdt/all/TdtVectorAnnoLayer",
    "js/tdt/all/TdtImageLayer",
    "js/tdt/all/TdtImageAnnoLayer",

    "js/tdt/fs/Setting",
    "js/tdt/fs/FS_TdtVectorLayer",
    "js/tdt/fs/FS_TdtImageLayer",
    "js/tdt/fs/FS_Tdt25DImageLayer",
    "js/heatmap/HeatmapLayer", //  HeatmapLayer

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
	
	ArcGISDynamicMapServiceLayer,
	ArcGISTiledMapServiceLayer,
	FeatureLayer,
    GraphicsLayer,
    CSVLayer,
	
    Color,
    SimpleMarkerSymbol,
    PictureMarkerSymbol,
    SimpleLineSymbol,
    CartographicLineSymbol,
    PictureFillSymbol,
    SimpleRenderer,
    InfoTemplate,
    urlUtils,
	Draw,

    Map, 
	SpatialReference,
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

    GeometryService,
    ProjectParameters,
	QueryTask,
    Query,
    FeatureSet,

    TdtVectorLayer,
    TdtVectorAnnoLayer,
    TdtImageLayer,
    TdtImageAnnoLayer,

    Setting,
    FS_TdtVectorLayer,
    FS_TdtImageLayer,
    FS_Tdt25DImageLayer,
	HeatmapLayer, // HeatmapLayer 

    BaiduVectorLayer,
    BaiduAnnoLayer,
    BaiduImageLayer,
	
    Measurement,
    Scalebar
      ) {
    parser.parse(); 
	main();

    function main(){
	    initSpatialReference();
	
	    // 504571,2541766
	    var x = 504571;
	    var y = 2541766;
        var center = new Point({"x": x, "y": y, "spatialReference": spatialReference_fs });

        map = new Map("map", {
                center: center,
		        zoom: default_level,
                logo: false
        });
        map.on("load",onMapLoad);
        map.on("click",onMapClick);
        map.on("zoom-end",onMapZoomEnd);
		map.on("extent-change", onMapExtentChange);

        //initHomeButton();
	    initToolbar();

        //initVectorLayer();
		initImageLayer();
		
		// init heat map layer
        //initFeatureLayer();
		initHeatmap();
		
		pre_test();
		
		queryTask = new QueryTask("http://19.134.126.50/ArcGIS/rest/services/CCZF_ZJWG/MapServer/0");
    }
	
	function onMapExtentChange(){
		console.log("onMapExtentChange");
	}

    // get the features within the current extent from the feature layer
    function getFeatures() {
           // set up query
            var q = new Query();
            // only within extent
            q.geometry = map.extent;
            q.returnGeometry = true;
            q.outFields = ["*"];
            
            // give me all of them!
            q.where = "1=1";
            // make sure I get them back in my spatial reference
            q.outSpatialReference = map.spatialReference;
            // get em!
            featureLayer.queryFeatures(q, function (featureSet) {
                var data = [];
                // if we get results back
                if (featureSet && featureSet.features && featureSet.features.length) {
                    // set data to features
                    data = featureSet.features; // Graphic []
                }
                // set heatmap data
                heatLayer.setData(data);
            });
    }

	function initSpatialReference(){
		spatialReference_fs = Setting.spatialReference_fs;
		spatialReference_wgs84 = Setting.spatialReference_wgs84;
	}
    
    function initHeatmap(){
			 // create heat layer
		heatLayer = new HeatmapLayer({
			"useLocalMaximum": false,
			config: {
				"radius": 40,
				"gradient": {
					0.45: "rgb(000,000,255)",
					0.55: "rgb(000,255,255)",
					0.65: "rgb(000,255,000)",
					0.95: "rgb(255,255,000)",
					1.00: "rgb(255,000,000)"
				}
			},
			"map": map,
			"opacity": 0.85
		}, "heatLayer");

		// data = featureSet.features;
        var g = Graphic();
		var data = [
            {
                attributes: {},
                geometry: {
                    spatialReference: spatialReference_fs,
                    type: "point",
                    x: 504550,
                    y: 2541750
                }
            },
            {
                attributes: {},
                geometry: {
                    spatialReference: spatialReference_fs,
                    type: "point",
                    x: 504000,
                    y: 2541750
                }
            },
            {
                attributes: {},
                geometry: {
                    spatialReference: spatialReference_fs,
                    type: "point",
                    x: 504999,
                    y: 2541750
                }
            }
        ];
        
        heatLayer.setData(data);
        //console.log(heatLayer);
		
		map.addLayer(heatLayer);
        // resize map
        //map.resize();
		
		// heatLayer.visible
		//heatLayer.show();
		//heatLayer.hide();
        //
        // heatLayer.config.useLocalMaximum = false;
    }
	
	function toggleHeatmap(){
		if (heatLayer){
				if(heatLayer.visible){
					heatLayer.hide();
				}else {
					heatLayer.show();
				}
			}
	}

    function onMapLoad(e){
        console.log("onMapLoad");
        // for html ui
        //registerUIEvents();
    }
    function onMapClick(e){
        // e.mapPoint e.screenPoint
        // e.graphics
        // geometry,
        //console.log(e.mapPoint);
    }

    function onMapZoomEnd(e){
	    var level = map.getLevel()+start_level;
	    console.log(level);
	    return;
  
        var visible = level >= default_level;
        console.log(visible);
        if(visible){
            map.addLayer(layer1);
            map.addLayer(layer2);
            map.addLayer(layer3);
        }
        else{
            map.removeLayer(layer1);
            map.removeLayer(layer2);
            map.removeLayer(layer3);
        }
    }
    
	function initToolbar() {
          toolbar = new Draw(map);
          toolbar.on("draw-end", addGraphic);

		  $("#drawPolygon").bind("click", drawPolygon);
		  $("#clearButton").bind("click", clearGraphics);

		  $("#vector").bind("click", fs_initVectorLayer);
		  $("#image").bind("click", fs_initImageLayer);
		  $("#image25d").bind("click", fs_init25DImageLayer);
		  
		  $("#heatmap").bind("click", toggleHeatmap);
        }

	function drawPolygon(){
			toolbar.activate(Draw.POLYGON);
            //map.disableMapNavigation();
	}
	function clearGraphics(){
			map.graphics.clear();
	}

	function initSymbol(){
		// markerSymbol is used for point and multipoint, see http://raphaeljs.com/icons/#talkq for more examples
        markerSymbol = new SimpleMarkerSymbol();
        markerSymbol.setPath("M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z");
        markerSymbol.setColor(new Color("#00FFFF"));

        // lineSymbol used for freehand polyline, polyline and line. 
        lineSymbol = new CartographicLineSymbol(
          CartographicLineSymbol.STYLE_SOLID,
          new Color([255,0,0]), 10, 
          CartographicLineSymbol.CAP_ROUND,
          CartographicLineSymbol.JOIN_MITER, 5
        );

        // fill symbol used for extent, polygon and freehand polygon, use a picture fill symbol
        // the images folder contains additional fill images, other options: sand.png, swamp.png or stiple.png
        fillSymbol = new PictureFillSymbol(
          "image/mangrove.png",
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color('#000'), 
            1
          ), 
          42, 
          42
        );
	}

	function addGraphic(evt) {
          //deactivate the toolbar and clear existing graphics 
          toolbar.deactivate(); 
          //map.enableMapNavigation();

		  initSymbol();
          // figure out which symbol to use
          var symbol;
          if ( evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
            symbol = markerSymbol;
          } else if ( evt.geometry.type === "line" || evt.geometry.type === "polyline") {
            symbol = lineSymbol;
          }
          else {
            symbol = fillSymbol;
          }
		  var g = new Graphic(evt.geometry, symbol);
          map.graphics.add(g);

		  // output
		  var points_array = g.geometry.rings[0];
          console.log("polygon");
		  //console.log(points_array);
		  points_array.forEach(function(e){
				  console.log(e);
		  })
        }
     
    function onMouseOver(e){
        map.setCursor("pointer");
    }
    function onMouseOut(e){
        map.setCursor("default");
    }
    function initVectorLayer(){
		if (use_fs){
			fs_initVectorLayer();
			return;
		}
    }

    function initImageLayer(){
		if (use_fs){
			fs_initImageLayer();
			//fs_init25DImageLayer();
			return;
		}
    }

	function fs_initVectorLayer(){
        fs_vector = new FS_TdtVectorLayer();
		fs_vector.id = 'vector';
        map.addLayer(fs_vector);
		// map.layerIds  ["image","vector", "heatLayer"]
		
		/*
		//CCSLLayer,CCYXLayer,CCGTFZH,  参考lib.layer.js文件
		var mylayer = new CCSLLayer();
		map.addLayer(mylayer);
		*/
	}
	function fs_initImageLayer(){
        fs_image = new FS_TdtImageLayer();
		fs_image.id = 'image';
        map.addLayer(fs_image);
	}
    function fs_init25DImageLayer(){
        fs_25dimage = new FS_Tdt25DImageLayer();
		fs_25dimage.id = '25d';
        map.addLayer(fs_25dimage);
    }

	//===========================================================================================
	// for html ui events
	//===========================================================================================
	function registerUIEvents(){
		return;
		initLayerSelect();
		
		$("#wellSelector").bind("change", selectWellLayer);
		$("#cameraSelector").bind("change", selectCameraLayer);
		$("#lightSelector").bind("change", selectLightLayer);
		$("#changeMapType").bind("click", changeMapType);

	}
	
	//===========================================================================================
	// for html ui events
	//===========================================================================================

	
function pre_test(){
	// ZJWG  PQWG  DWG  WWG
	// tiled 
	var url="http://19.134.126.50/ArcGIS/rest/services/CCZF_ZJWG/MapServer/";
	var tiled = new esri.layers.ArcGISTiledMapServiceLayer(url);
	tiled.id = 'tiled';
	map.addLayer(tiled);
	tiled.setVisibility(true);
	
	// no tiled (dynamic) 
	// layer with  N child layers
	var url = 'http://19.134.126.50/ArcGIS/rest/services/CCZF_BJ/MapServer';
	var bj = new esri.layers.ArcGISDynamicMapServiceLayer(url);
	bj.id = 'bj';
	//map.addLayer(bj);
	
	ids = [0,1];
	bj.setVisibleLayers(ids);
	
	//test();
}

function test(){
	var url = 'http://19.134.126.50/ArcGIS/rest/services/CCZF_BJ/MapServer/0';
	var template = new esri.InfoTemplate("RESULT", "ID: ${OBJECTID}");
	var params = {outFields: ["OBJECTID","FS_X","FS_Y"],
		infoTemplate: template
	};
	featurelayer = new esri.layers.FeatureLayer(url,params);
	map.addLayer(featurelayer);
	
	
        var symbol = new esri.symbol.SimpleMarkerSymbol(
          esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 
          12, 
          new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_NULL, 
            new esri.Color([247, 34, 101, 0.9]), 
            1
          ),
          new esri.Color([207, 34, 171, 0.5])
        );
        featurelayer.setSelectionSymbol(symbol); 
	
	//featurelayer.setVisibility(true);
}

function queryLayer(featurelayer,evt){	
	/*
	var circle = new esri.geometry.Circle({
            center: evt.mapPoint,
            radius: 10,
    });
	*/	  
     var query = new esri.tasks.Query();
	 //query.geometry = geometry; // user defined select by geometry
     query.outFields = ["*"];
     query.returnGeometry = true;
     query.orderByFields = ["OBJECTID"];
     query.where = "OBJECTID=123"; // select by attributes 
	 
     featurelayer.selectFeatures(query, esri.layers.FeatureLayer.MODE_ONDEMAND, function(results) {
		console.log(results.length);
		alert("Total Records: #"+results.length);
		// processing results here ...
		var feature = results[0];
		
		var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE,
                100,
                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([255,0,0]),
                    1
                ),
                new esri.Color([255,0,0])
            );
		
		map.graphics.add(new Graphic(evt.geometry, symbol));
     });
}

	
});
