// by kezunlin 
// date 2015-9-16
/*
// http://www.cnblogs.com/lyqf365/p/3287293.html
// http://blog.csdn.net/zhizhu8256/article/details/8822675
// http://t0.tianditu.com/cva_w/wmts?request=GetCapabilities&service=wmts
// http://www.cnblogs.com/sailheart/archive/2011/03/11/1981536.html
// http://blog.csdn.net/zhizhu8256/article/details/8823403

Map Projection Code
EPSG：4326  经纬度(in degree)
EPSG：3785/900931  墨卡托(in meter)  

EPSG: 4490  国家2000坐标系             
http://blog.csdn.net/zhizhu8256/article/details/8822675

<ows:SupportedCRS>urn:ogc:def:crs:EPSG::900913</ows:SupportedCRS>
<ows:SupportedCRS>urn:ogc:def:crs:EPSG::4326</ows:SupportedCRS>

for tianditu
<ows:SupportedCRS>urn:ogc:def:crs:EPSG::4490</ows:SupportedCRS>
vector
http://www.tianditu.com/service/info.html?sid=1005&type=info
image
http://www.tianditu.com/service/info.html?sid=1061&type=info

for tianditufs
http://services.tianditugd.com/gdimg201311_anno/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities
*/
var map;
var featureLayer;
var heatLayer;
var spatialReference_fs,spatialReference_wgs84;

var level_offset = 13;
var start_level = 13;
var end_level = 20;
var default_level = 0; // 0-7--->13-20

var vector,vectoranno,image,imageanno;
var fs_vector,fs_image,fs_25dimage;
var center;
var layer1,layer2,layer3;
var layers_data;
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
    "js/heatmap/HeatmapLayer",

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
	HeatmapLayer,

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
        pointTransformation();
	
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
        //map.on("click",onMapClick);
        map.on("zoom-end",onMapZoomEnd);
		map.on("extent-change", onMapExtentChange);

        initHomeButton();
	    initToolbar();

        initVectorLayer();
		
		// init heat map layer
        //initFeatureLayer();
		initHeatmap();
    }
	
	function onMapExtentChange(){
		console.log("onMapExtentChange");
	}

    function initFeatureLayer(){
            featureLayer = new FeatureLayer("http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/SanFrancisco/311Incidents/MapServer/0", {
                mode: FeatureLayer.MODE_ONDEMAND,
                visible: false
            });
            map.addLayer(featureLayer);

            getFeatures();
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

    function pointTransformation(){
            /*
            //1) wgs84---fs
		    var point = new OpenLayers.LonLat(113.101873,23.029604);
		    point.transform(wgs_proj,fs_proj);
		    console.log(point); // lon: 510336.9451766819  lat: 2547835.2998046526 
            */
		    var x = 113.101873, y = 23.029604;
            var inputpoint = new Point({"x": x, "y": y, "spatialReference": spatialReference_wgs84 });
            console.log(inputpoint);

            // https://developers.arcgis.com/javascript/samples/util_coordinate_converter/
            // http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Project/02r3000000pv000000/
            var geometryService = new esri.tasks.GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            var PrjParams = new esri.tasks.ProjectParameters();
            PrjParams.geometries = [inputpoint];
            PrjParams.inSR = spatialReference_wgs84;
            PrjParams.outSR = spatialReference_fs;

            // project
            geometryService.project(PrjParams, function (geometries) {
                    console.log(geometries[0]);
                    // Object {type: "point", x: 510336.945189592, y: 2547835.28105017, spatialReference: Object}
            });
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

        map.addLayer(heatLayer);
        // resize map
        //map.resize();
		
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
        
        //heatLayer.setData(data);
        //console.log(heatLayer);
		
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
	    initLayersData();

        // for html ui
        registerUIEvents();
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
    function initHomeButton(){
        var home = new HomeButton({
                map: map
            }, "HomeButton");
            home.startup();
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

    function initLayersData(){
        var urlprefix = "http://localhost";
        layer1 = new GraphicsLayer();
        var layer_name_1 = "jg";
        var data_url_1 = urlprefix + "/map/data/layer1.json";
        var image_url_1 = urlprefix + "/map/image/jg.jpg";
        layer2 = new GraphicsLayer();
        var layer_name_2 = "xsf";
        var data_url_2 = urlprefix + "/map/data/layer2.json";
        var image_url_2 = urlprefix + "/map/image/xfs.jpg";
        layer3 = new GraphicsLayer();
        var layer_name_3 = "ld";
        var data_url_3 = urlprefix + "/map/data/layer3.json";
        var image_url_3 = urlprefix + "/map/image/ld.jpg";
        layers_data = [
            {"layer":layer1,"layer_name":layer_name_1,"data_url":data_url_1,"image_url":image_url_1},
            {"layer":layer2,"layer_name":layer_name_2,"data_url":data_url_2,"image_url":image_url_2},
            {"layer":layer3,"layer_name":layer_name_3,"data_url":data_url_3,"image_url":image_url_3},
            ];
        layers_data.forEach( function(e){
            createLayer(e.layer,e.layer_name,e.data_url,e.image_url);
        });
    }

    function createLayer(layer,layer_name,data_url,image_url){
        layer.id = layer_name;
        var orangeRed = new Color([238, 69, 0, 0.5]); // hex is #ff4500
        //var marker = new SimpleMarkerSymbol("solid", 15, null, orangeRed);
        var marker = new PictureMarkerSymbol(image_url, 25, 25);
        var renderer = new SimpleRenderer(marker);
        layer.setRenderer(renderer);
        var template = new InfoTemplate("<b>部件编号:</b> ${id}", 
			"<b>地址描述:</b> ${address} </br> <b>所属部门:</b> ${department} </br> <b>部件用途:</b> ${usage} </br> <img src='${image}' width='200px' height='200px'/>");
        layer.setInfoTemplate(template);

        // get json data
        $.ajax({       
            type:"GET",       
            url:data_url,
            dataType:"json",       
            success: function (data) {            
                $.each(data, function(i,e){           
						//  Typically the latitude coordinate is the Y value, and the longitude coordinate is the X value. 
                    var pt = new Point(e.longitude,e.latitude,map.spatialReference);
                    //console.log(pt);
                    var attr = {
                        "id":e.id,
                        "address":e.address,
                        "department":e.department,
                        "usage":e.usage,
                        "image":image_url 
                    };
                    var graphic = new Graphic(pt,marker,attr,template);
                    layer.add(graphic);
                });
                layer.on("mouse-over",onMouseOver);
                layer.on("mouse-out",onMouseOut);
                //map.addLayer(layer);
            },
            error: function (data) {
                console.log(data);
            }
        });  
		
		/*
		// read local file using jQuery
		$.get(data_url,function(data){
			data.forEach(function(p){
				console.log(p);
			});
			
		});
		*/
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

        vector = new TdtVectorLayer();
        map.addLayer(vector);

        vectoranno = new TdtVectorAnnoLayer();
        map.addLayer(vectoranno);
    }

    function initImageLayer(){
		if (use_fs){
			fs_initImageLayer();
			//fs_init25DImageLayer();
			return;
		}

        image = new TdtImageLayer();
        map.addLayer(image);

        imageanno = new TdtImageAnnoLayer();
        map.addLayer(imageanno);
    }


	function fs_initVectorLayer(){
        fs_vector = new FS_TdtVectorLayer();
        map.addLayer(fs_vector);
	}
	function fs_initImageLayer(){
        fs_image = new FS_TdtImageLayer();
        map.addLayer(fs_image);
	}
    function fs_init25DImageLayer(){
        fs_25dimage = new FS_Tdt25DImageLayer();
        map.addLayer(fs_25dimage);
    }

	//===========================================================================================
	// for html ui events
	//===========================================================================================
	function registerUIEvents(){
		initLayerSelect();
		
		$("#wellSelector").bind("change", selectWellLayer);
		$("#cameraSelector").bind("change", selectCameraLayer);
		$("#lightSelector").bind("change", selectLightLayer);
		$("#changeMapType").bind("click", changeMapType);

	}
	
	//图层选择工具条--井盖控制 creared at 2015-09-19 start
	function selectWellLayer()
	{
		if($("#wellSelector").is(":checked"))
		{
				map.addLayer(layer1);
		}
		else
		{
				map.removeLayer(layer1);
		}
	}
	//图层选择工具条--井盖控制 creared at 2015-09-19 end
	
	//图层选择工具条--摄像头控制 creared at 2015-09-19 start
	function selectCameraLayer()
	{
		if($("#cameraSelector").is(":checked"))
		{
			map.addLayer(layer2);
		}
		else
		{
			map.removeLayer(layer2);
		}
	}
	//图层选择工具条--摄像头控制 creared at 2015-09-19 end
	
	//图层选择工具条--路灯控制 creared at 2015-09-19 start
	function selectLightLayer()
	{
		if($("#lightSelector").is(":checked"))
		{
			map.addLayer(layer3);
		}
		else
		{
			map.removeLayer(layer3);
		}
	}
	//图层选择工具条--路灯控制 creared at 2015-09-19 end
	
	
	//地图切换按钮功能函数 created at 2015-09-19 start
	function changeMapType()
	{
		$.fn.custombox(this, {
			url: "#changeMapWin",
			effect: "fadein",
			overlayOpacity: 0.5,
			complete: function(){
				$("#changeOverviewMap").bind("click", changeOverviewMap);
				$("#changeImageMap").bind("click", changeImageMap);
			}
	    });
	}
	//地图切换按钮功能函数 created at 2015-09-19 end
	
	
	//加载页面后设置图层选择checkbox为勾选状态，并显示所有图层 created at 2015-09-21 start
	function initLayerSelect()
	{
		$("[name='mapLayerCheckbox']").attr("checked", "true");	
		
		map.addLayer(layer1);
		map.addLayer(layer2);
		map.addLayer(layer3);
	}
	//加载页面后设置图层选择checkbox为勾选状态，并显示所有图层 created at 2015-09-21 start
	
	//地图切换选择矢量图 created at 2015-09-19 start
	function changeOverviewMap()
	{
		initVectorLayer();
		$.fn.custombox('close');
	}
	//地图切换选择矢量图 created at 2015-09-19 end

	//地图切换选择影像图 created at 2015-09-19 start
	function changeImageMap()
	{
		initImageLayer();
		//init25DImageLayer();
		
		$.fn.custombox('close');
	}
	//地图切换选择影像图 created at 2015-09-19 end
	
	//===========================================================================================
	// for html ui events
	//===========================================================================================

});
