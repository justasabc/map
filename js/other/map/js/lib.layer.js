dojo.declare("AgsServerYXLayer", esri.layers.TiledMapServiceLayer, {
    constructor: function (settings) {
        // AgsServerYXLayer.userUrl=serverurl;
        this.surl = settings; //settings.url;
        //surl= serverurl;
        this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
        this.initialExtent = (this.fullExtent = new esri.geometry.Extent(428696.37422841, 2497346.34871162, 547701.438248546, 2616306.15128831, this.spatialReference));
        //- 33.874786, 56.280494, -33.01922607, 56.8002853
        this.tileInfo = new esri.layers.TileInfo({
            "rows": 512,
            "cols": 512,
            "compressionQuality": 0,
            "origin": {
                "x": -5123200,
                "y": 10002100
            },
            "spatialReference": {
                "wkid": 4326
            },
            "lods": [
            { "level": 0, "resolution": 158.750317500635, "scale": 600000 },
            { "level": 1, "resolution": 132.291931250529, "scale": 500000 },
            { "level": 2, "resolution": 66.1459656252646, "scale": 250000 },
            { "level": 3, "resolution": 33.0729828126323, "scale": 125000 },
            { "level": 4, "resolution": 16.9333672000677, "scale": 64000 },
            { "level": 5, "resolution": 8.46668360003387, "scale": 32000 },
            { "level": 6, "resolution": 4.23334180001693, "scale": 16000 },
            { "level": 7, "resolution": 2.11667090000847, "scale": 8000 },
            { "level": 8, "resolution": 1.05833545000423, "scale": 4000 },
            { "level": 9, "resolution": 0.529167725002117, "scale": 2000 }
            ]
        });

        this.loaded = true;
        this.onLoad(this);
    },
    getTileUrl: function (level, row, col) {
        return this.surl + "/tile/" + level + "/" + row + "/" + col;
    }
});



dojo.declare("FSWMTSLayer", esri.layers.TiledMapServiceLayer, {
    //佛山矢量
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({
            wkt: 'PROJCS["fs",GEOGCS["GCS_Xian_1980",DATUM["D_Xian_1980",SPHEROID["Xian_1980",6378140.0,298.257]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",113.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
            //wkid: 0
        });
        this.initialExtent = new esri.geometry.Extent(-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789, this.spatialReference);
        this.fullExtent = new esri.geometry.Extent(-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789, this.spatialReference);
        this.tileInfo = new esri.layers.TileInfo({
            "dpi": "90.714285714274296",
            "format": "image/png",
            "compressionQuality": 0,
            "spatialReference": {
                "wkid": "-9999"
            },
            "rows": 256,
            "cols": 256,
            "origin": {
                "x": -20037508.34,
                "y": 20037508.34   //3578-3574 //20037508.342789
            },

            // Scales in DPI 96
            "lods": [
                { "level": 0, "scale": 591657527.591555, "resolution": 156543.033928 },
                { "level": 1, "scale": 295828763.795777, "resolution": 78271.5169639999 },
                { "level": 2, "scale": 147914381.897889, "resolution": 39135.7584820001 },
                { "level": 3, "scale": 73957190.948944, "resolution": 19567.8792409999 },
                { "level": 4, "scale": 36978595.474472, "resolution": 9783.93962049996 },
                { "level": 5, "scale": 18489297.737236, "resolution": 4891.96981024998 },
                { "level": 6, "scale": 9244648.868618, "resolution": 2445.98490512499 },
                { "level": 7, "scale": 4622324.434309, "resolution": 1222.99245256249 },
                { "level": 8, "scale": 2311162.217155, "resolution": 611.49622628138 },
                { "level": 9, "scale": 1155581.108577, "resolution": 305.748113140558 },
                { "level": 10, "scale": 577790.554289, "resolution": 152.874056570411 },
                { "level": 11, "scale": 288895.277144, "resolution": 76.4370282850732 },
                { "level": 12, "scale": 144447.638572, "resolution": 38.2185141425366 },
                { "level": 13, "scale": 72223.819286, "resolution": 19.1092570712683 },
                { "level": 14, "scale": 36111.909643, "resolution": 9.55462853563415 },
                { "level": 15, "scale": 18055.954822, "resolution": 4.77731426794937 },
                { "level": 16, "scale": 9027.977411, "resolution": 2.38865713397468 },
                { "level": 17, "scale": 4513.988705, "resolution": 1.19432856685505 },
                { "level": 18, "scale": 2256.994353, "resolution": 0.597164283559817 },
                { "level": 19, "scale": 1128.497176, "resolution": 0.298582141647617 },
                { "level": 20, "scale": 533.181329, "resolution": 0.1492910708238085 }
            ]

        });
        this.loaded = true;
        this.onLoad(this);
    },

    getTileUrl: function (level, row, col) {
        
        if (level >= 14) {
            return "http://19.128.104.244:8001/FSZWMAP20141420/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=T0629&STYLE=T0629&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + (level) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";
        } else {
            return "http://19.128.104.244:8001/ZWMAP20149TO13/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ZWMAP20149TO13&STYLE=ZWMAP20149TO13&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + (level) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";
        }
    }
});


dojo.declare("FSWPLayer", esri.layers.TiledMapServiceLayer, {
    //佛山卫片
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({
            wkt: 'PROJCS["fs",GEOGCS["GCS_Xian_1980",DATUM["D_Xian_1980",SPHEROID["Xian_1980",6378140.0,298.257]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",113.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
            //wkid: 0
        });
        this.initialExtent = new esri.geometry.Extent(-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789, this.spatialReference);
        this.fullExtent = new esri.geometry.Extent(-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789, this.spatialReference);
        this.tileInfo = new esri.layers.TileInfo({
            "dpi": "90.714285714274296",
            "format": "image/png",
            "compressionQuality": 0,
            "spatialReference": {
                "wkid": "-9999"
            },
            "rows": 256,
            "cols": 256,
            "origin": {
                "x": -20037508.34,
                "y": 20037508.34   //3578-3574 //20037508.342789
            },

            // Scales in DPI 96
            "lods": [
                { "level": 0, "scale": 591657527.591555, "resolution": 156543.033928 },
                { "level": 1, "scale": 295828763.795777, "resolution": 78271.5169639999 },
                { "level": 2, "scale": 147914381.897889, "resolution": 39135.7584820001 },
                { "level": 3, "scale": 73957190.948944, "resolution": 19567.8792409999 },
                { "level": 4, "scale": 36978595.474472, "resolution": 9783.93962049996 },
                { "level": 5, "scale": 18489297.737236, "resolution": 4891.96981024998 },
                { "level": 6, "scale": 9244648.868618, "resolution": 2445.98490512499 },
                { "level": 7, "scale": 4622324.434309, "resolution": 1222.99245256249 },
                { "level": 8, "scale": 2311162.217155, "resolution": 611.49622628138 },
                { "level": 9, "scale": 1155581.108577, "resolution": 305.748113140558 },
                { "level": 10, "scale": 577790.554289, "resolution": 152.874056570411 },
                { "level": 11, "scale": 288895.277144, "resolution": 76.4370282850732 },
                { "level": 12, "scale": 144447.638572, "resolution": 38.2185141425366 },
                { "level": 13, "scale": 72223.819286, "resolution": 19.1092570712683 },
                { "level": 14, "scale": 36111.909643, "resolution": 9.55462853563415 },
                { "level": 15, "scale": 18055.954822, "resolution": 4.77731426794937 },
                { "level": 16, "scale": 9027.977411, "resolution": 2.38865713397468 },
                { "level": 17, "scale": 4513.988705, "resolution": 1.19432856685505 },
                { "level": 18, "scale": 2256.994353, "resolution": 0.597164283559817 },
                { "level": 19, "scale": 1128.497176, "resolution": 0.298582141647617 },
                { "level": 20, "scale": 533.181329, "resolution": 0.1492910708238085 }
            ]

        });
        this.loaded = true;
        this.onLoad(this);
    },

    getTileUrl: function (level, row, col) {
        return "http://19.128.104.244:8001/ZWDOM2014/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ZWDOM2014&STYLE=ZWDOM2014&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + (level) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";
    }
});

dojo.declare("CCSLLayer", esri.layers.TiledMapServiceLayer, {
    //禅城矢量
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({
            wkt: 'PROJCS["fs",GEOGCS["GCS_Xian_1980",DATUM["D_Xian_1980",SPHEROID["Xian_1980",6378140.0,298.257]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",113.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
        });
        this.initialExtent = new esri.geometry.Extent(-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789, this.spatialReference);
        this.fullExtent = new esri.geometry.Extent(-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789, this.spatialReference);
        this.tileInfo = new esri.layers.TileInfo({
            "dpi": "90.714285714274296",
            "format": "image/png",
            "compressionQuality": 0,
            "spatialReference": {
                "wkid": "-9999"
            },
            "rows": 256,
            "cols": 256,
            "origin": {
                "x": -20037508.34,
                "y": 20037508.34   //3578-3574 //20037508.342789
            },

            // Scales in DPI 96
            "lods": [
                { "level": 13, "scale": 72223.819286, "resolution": 19.1092570712683 },
                { "level": 14, "scale": 36111.909643, "resolution": 9.55462853563415 },
                { "level": 15, "scale": 18055.954822, "resolution": 4.77731426794937 },
                { "level": 16, "scale": 9027.977411, "resolution": 2.38865713397468 },
                { "level": 17, "scale": 4513.988705, "resolution": 1.19432856685505 },
                { "level": 18, "scale": 2256.994353, "resolution": 0.597164283559817 },
                { "level": 19, "scale": 1128.497176, "resolution": 0.298582141647617 },
                { "level": 20, "scale": 564.249716672069, "resolution": 0.1492910708238085 }
            ]

        });
        this.loaded = true;
        this.onLoad(this);
    },

    getTileUrl: function (level, row, col) {
        return "http://19.134.126.50:9010/CCGTMAP2015_MAP/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CCGTMAP2015_MAP&STYLE=CCGTMAP2015_MAP&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + (level) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";
    }
});


dojo.declare("CCSLLayer_Anno", esri.layers.TiledMapServiceLayer, {
    //禅城矢量
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({
            wkt: 'PROJCS["fs",GEOGCS["GCS_Xian_1980",DATUM["D_Xian_1980",SPHEROID["Xian_1980",6378140.0,298.257]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",113.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
        });
        this.initialExtent = new esri.geometry.Extent(-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789, this.spatialReference);
        this.fullExtent = new esri.geometry.Extent(-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789, this.spatialReference);
        this.tileInfo = new esri.layers.TileInfo({
            "dpi": "90.714285714274296",
            "format": "image/png",
            "compressionQuality": 0,
            "spatialReference": {
                "wkid": "-9999"
            },
            "rows": 256,
            "cols": 256,
            "origin": {
                "x": -20037508.34,
                "y": 20037508.34   //3578-3574 //20037508.342789
            },

            // Scales in DPI 96
            "lods": [
                { "level": 13, "scale": 72223.819286, "resolution": 19.1092570712683 },
                { "level": 14, "scale": 36111.909643, "resolution": 9.55462853563415 },
                { "level": 15, "scale": 18055.954822, "resolution": 4.77731426794937 },
                { "level": 16, "scale": 9027.977411, "resolution": 2.38865713397468 },
                { "level": 17, "scale": 4513.988705, "resolution": 1.19432856685505 },
                { "level": 18, "scale": 2256.994353, "resolution": 0.597164283559817 },
                { "level": 19, "scale": 1128.497176, "resolution": 0.298582141647617 },
                { "level": 20, "scale": 564.249716672069, "resolution": 0.1492910708238085 }
            ]

        });
        this.loaded = true;
        this.onLoad(this);
    },

    getTileUrl: function (level, row, col) {
        return "http://19.134.126.50:9010/CCGTMAP2015_ANN/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CCGTMAP2015_ANN&STYLE=CCGTMAP2015_ANN&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + (level) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";
    }
});


dojo.declare("CCYXLayer", esri.layers.TiledMapServiceLayer, {
    //禅城影像
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({
            wkt: 'PROJCS["fs",GEOGCS["GCS_Xian_1980",DATUM["D_Xian_1980",SPHEROID["Xian_1980",6378140.0,298.257]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",113.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
        });
        this.initialExtent = new esri.geometry.Extent(-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789, this.spatialReference);
        this.fullExtent = new esri.geometry.Extent(-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789, this.spatialReference);
        this.tileInfo = new esri.layers.TileInfo({
            "dpi": "90.714285714274296",
            "format": "image/png",
            "compressionQuality": 0,
            "spatialReference": {
                "wkid": "-9999"
            },
            "rows": 256,
            "cols": 256,
            "origin": {
                "x": -20037508.34,
                "y": 20037508.34   //3578-3574 //20037508.342789
            },

            // Scales in DPI 96
            "lods": [
                { "level": 13, "scale": 72223.819286, "resolution": 19.1092570712683 },
                { "level": 14, "scale": 36111.909643, "resolution": 9.55462853563415 },
                { "level": 15, "scale": 18055.954822, "resolution": 4.77731426794937 },
                { "level": 16, "scale": 9027.977411, "resolution": 2.38865713397468 },
                { "level": 17, "scale": 4513.988705, "resolution": 1.19432856685505 },
                { "level": 18, "scale": 2256.994353, "resolution": 0.597164283559817 },
                { "level": 19, "scale": 1128.497176, "resolution": 0.298582141647617 },
                { "level": 20, "scale": 564.249716672069, "resolution": 0.1492910708238085 }
            ]

        });
        this.loaded = true;
        this.onLoad(this);
    },

    getTileUrl: function (level, row, col) {
        return "http://19.134.126.50:9010/CCGTWP2015/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CCGTWP2015&STYLE=CCGTWP2015&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";

    }
});

dojo.declare("CCGTFZH", esri.layers.TiledMapServiceLayer, {
    //禅城2.5纬
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({
            wkt: 'PROJCS["fs",GEOGCS["GCS_Xian_1980",DATUM["D_Xian_1980",SPHEROID["Xian_1980",6378140.0,298.257]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",113.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
        });
        this.initialExtent = new esri.geometry.Extent(-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789, this.spatialReference);
        this.fullExtent = new esri.geometry.Extent(-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789, this.spatialReference);
        this.tileInfo = new esri.layers.TileInfo({
            "dpi": "90.714285714274296",
            "format": "image/png",
            "compressionQuality": 0,
            "spatialReference": {
                "wkid": "-9999"
            },
            "rows": 256,
            "cols": 256,
            "origin": {
                "x": -20037508.34,
                "y": 20037508.34   //3578-3574 //20037508.342789
            },

            // Scales in DPI 96
            "lods": [
                { "level": 13, "scale": 72223.819286, "resolution": 19.1092570712683 },
                { "level": 14, "scale": 36111.909643, "resolution": 9.55462853563415 },
                { "level": 15, "scale": 18055.954822, "resolution": 4.77731426794937 },
                { "level": 16, "scale": 9027.977411, "resolution": 2.38865713397468 },
                { "level": 17, "scale": 4513.988705, "resolution": 1.19432856685505 },
                { "level": 18, "scale": 2256.994353, "resolution": 0.597164283559817 },
                { "level": 19, "scale": 1128.497176, "resolution": 0.298582141647617 },
                { "level": 20, "scale": 564.249716672069, "resolution": 0.1492910708238085 }
            ]

        });
        this.loaded = true;
        this.onLoad(this);
    },

    getTileUrl: function (level, row, col) {
        return "http://19.134.126.50:9010/CCGTFZH2013/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CCGTFZH2013&STYLE=CCGTFZH2013&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";

    }
});