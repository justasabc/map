//
// http://dojotoolkit.org/reference-guide/1.8/dojo/_base/declare.html
//

define(
	[
		'dojo/_base/declare',
		'esri/layers/tiled',
        'esri/SpatialReference', 
	], function(
		declare,
		tiled, // esri.geometry.Extent
		SpatialReference,
		Extent){

  		    var  Setting = declare(null, {
  		    });

  		    var g_width = 20037508.3427892;	
		    var fs_wkt = ' PROJCS["FS_Xian_1980_GK_CM_111E", GEOGCS["GCS_Xian_1980", DATUM["D_Xian_1980",SPHEROID["Xian_1980",6378140.0,298.257]], PRIMEM["Greenwich",0.0], UNIT["Degree",0.0174532925199433]], PROJECTION["Gauss_Kruger"], PARAMETER["False_Easting",500000.0], PARAMETER["False_Northing",0.0], PARAMETER["Central_Meridian",113.001025], PARAMETER["Scale_Factor",1.0], PARAMETER["Latitude_Of_Origin",-0.000131], UNIT["Meter",1.0] ] ';
  		    Setting.width = g_width;
		    Setting.height = g_width;
		    Setting.spatialReference_fs = new SpatialReference({"wkt":fs_wkt});
		    Setting.spatialReference_wgs84 = new SpatialReference({wkid:4326});

		  var levels = [
		  13,
		  14,
		  15,
		  16,
		  17,
		  18,
		  19,
		  20
		  ]
		  var scales = [
		  72223.96373402483,
		  36111.981867012415,
		  18055.990933506208,
		  9027.995466753104,
		  4513.997733376552,
		  2256.998866688276,
		  1128.499433344138,
		  564.249716672069
		  ];
		  var resolutions = [
		  19.10925707129402, 
		  9.55462853564701, 
		  4.777314267823505, 
		  2.3886571339117526, 
		  1.1943285669558763, 
		  0.5971642834779382, 
		  0.2985821417389691, 
		  0.14929107086948454
		  ];

		  var lods = [];
		  levels.forEach(function(value,index){
			  var lod = {"level" : levels[index], "resolution" : resolutions[index], "scale" : scales[index]};
			  lods.push(lod);
		  }
		  );
		  Setting.lods = lods;

          var tileinfo = new esri.layers.TileInfo({
            		"rows" : 256,
            		"cols" : 256,
            		"compressionQuality" : 0,
            		"origin" : {
              			"x" : -Setting.width,
              			"y" : Setting.height
			  },
            		"spatialReference" : Setting.spatialReference_fs,
            		"lods" : Setting.lods
          	});

	  	Setting.tileInfo = tileinfo;

		Setting.extent_vector = new esri.geometry.Extent(494043.57239999995, 2535990.899700001, 518379.2123999996, 2552105.0396999996, Setting.spatialReference_fs);
		Setting.extent_image = new esri.geometry.Extent(495626.68421803735 , 2534378.9967090613, 518629.3342180374, 2553836.8967090617, Setting.spatialReference_fs);
		Setting.extent_25dimage = new esri.geometry.Extent(496117.80467445566, 2535231.9442850314, 517781.26885500166, 2552716.944999657, Setting.spatialReference_fs);
		 
		// GetTileUrl methods 
		// 2016-4-14 
		// old url  http://19.133.29.238:7002
		// new url  http://19.134.126.50:9010
		 Setting.getTileUrl_vector = function(level, row, col) {
          		//return "http://19.133.29.238:7002/CCGTMAP13_20/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CCGTMAP15_20&STYLE=CCGTMAP15_20&TILEMATRIXSET=Matrix_0&TILEMATRIX="+level+"&TILEROW="+row+"&TILECOL="+col+"&FORMAT=image%2Ftile";
			var d = {
				name : "CCGTMAP15_20",
				url :  "http://19.134.126.50:9010/CCGTMAP13_20/wmts",
				matrixSet: "Matrix_0",
				style : "CCGTMAP15_20",
				layer : "CCGTMAP15_20",
				format : "image/tile"
			};
			var url = d.url + "?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER="+d.layer+"&STYLE="+d.style+"&TILEMATRIXSET="+d.matrixSet+"&TILEMATRIX="+level+"&TILEROW="+row+"&TILECOL="+col+"&FORMAT="+d.format;
			return url;
		 }; 

		 Setting.getTileUrl_image = function(level, row, col) {
         		//return "http://19.133.29.238:7002/CCGTWP2015/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CCGTWP2015&STYLE=CCGTWP2015&TILEMATRIXSET=Matrix_0&TILEMATRIX="+level+"&TILEROW="+row+"&TILECOL="+col+"&FORMAT=image%2Ftile";
			var d = {
				name : "CCGTWP2015",
				url :  "http://19.134.126.50:9010/CCGTWP2015/wmts",
				matrixSet: "Matrix_0",
				style : "CCGTWP2015",
				layer : "CCGTWP2015",
				format : "image/tile"
			};
			var url = d.url + "?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER="+d.layer+"&STYLE="+d.style+"&TILEMATRIXSET="+d.matrixSet+"&TILEMATRIX="+level+"&TILEROW="+row+"&TILECOL="+col+"&FORMAT="+d.format;
			return url;
		 };

		 Setting.getTileUrl_25dimage = function(level, row, col) {
			//return "http://19.133.29.238:7002/CCGTFZH2013/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CCGTFZH2013&STYLE=CCGTFZH2013&TILEMATRIXSET=Matrix_0&TILEMATRIX="+level+"&TILEROW="+row+"&TILECOL="+col+"&FORMAT=image%2Ftile";
			var d = {
				name : "CCGTFZH2013",
				url :  "http://19.134.126.50:9010/CCGTFZH2013/wmts",
				matrixSet: "Matrix_0",
				style : "CCGTFZH2013",
				layer : "CCGTFZH2013",
				format : "image/tile"
			};
			var url = d.url + "?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER="+d.layer+"&STYLE="+d.style+"&TILEMATRIXSET="+d.matrixSet+"&TILEMATRIX="+level+"&TILEROW="+row+"&TILECOL="+col+"&FORMAT="+d.format;
			return url;
		 };

  		return Setting;
});

/*
 <ows:Constraint name="96DPIPyramidType">
	<ows:Value>Matrix_0</ows:Value>
</ows:Constraint>
<ows:Constraint name="OGCPyramidType">
	<ows:Value>Matrix_1</ows:Value>
</ows:Constraint>
<ows:Constraint name="ArcGISPyramidType">
	<ows:Value>Matrix_2</ows:Value>
</ows:Constraint>
				
Ê¸Á¿£ºhttp://19.133.29.238:7002/CCGTMAP13_20/wmts
Ó°Ïñ£ºhttp://19.133.29.238:7002/CCGTWP2015/wmts
2.5D£ºhttp://19.133.29.238:7002/CCGTFZH2013/wmts

vector
http://19.133.29.238:7002/CCGTMAP13_20/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CCGTMAP15_20&STYLE=CCGTMAP15_20&TILEMATRIXSET=Matrix_0&TILEMATRIX=18&TILEROW=114388&TILECOL=134416&FORMAT=image%2Ftile

image
http://19.133.29.238:7002/CCGTWP2015/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CCGTWP2015&STYLE=CCGTWP2015&TILEMATRIXSET=Matrix_0&TILEMATRIX=18&TILEROW=114388&TILECOL=134415&FORMAT=image%2Ftile

25d
http://19.133.29.238:7002/CCGTFZH2013/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CCGTFZH2013&STYLE=CCGTFZH2013&TILEMATRIXSET=Matrix_0&TILEMATRIX=18&TILEROW=114386&TILECOL=134413&FORMAT=image%2Ftile
*/
