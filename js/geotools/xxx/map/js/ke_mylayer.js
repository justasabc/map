

dojo.declare("CCSLLayer", esri.layers.TiledMapServiceLayer, {
    //禅城矢量
    constructor: function () {
        this.spatialReference = new esri.SpatialReference({
            wkt: 'PROJCS["fs",GEOGCS["GCS_Xian_1980",DATUM["D_Xian_1980",SPHEROID["Xian_1980",6378140.0,298.257]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",113.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
        });
        this.initialExtent = new esri.geometry.Extent(494043.57239999995, 2535990.899700001, 518379.2123999996, 2552105.0396999996,this.spatialReference);
        this.fullExtent = new esri.geometry.Extent(494043.57239999995, 2535990.899700001, 518379.2123999996, 2552105.0396999996,this.spatialReference);
        this.tileInfo = new esri.layers.TileInfo({
            "dpi": "90.714285714274296",
            "format": "image/png",
            "compressionQuality": 0,
            "spatialReference": this.spatialReference,
            "rows": 256,
            "cols": 256,
            "origin": {
                "x": -20037508.34,
                "y": 20037508.34   //3578-3574 //20037508.342789
            },

            // Scales in DPI 96
            "lods": [{
                "level": 0,
                "scale": 591657527.591555,
                "resolution": 156543.033928
            }, {
                "level": 1,
                "scale": 295828763.795777,
                "resolution": 78271.5169639999
            }, {
                "level": 2,
                "scale": 147914381.897889,
                "resolution": 39135.7584820001
            }, {
                "level": 3,
                "scale": 73957190.948944,
                "resolution": 19567.8792409999
            }, {
                "level": 4,
                "scale": 36978595.474472,
                "resolution": 9783.93962049996
            }, {
                "level": 5,
                "scale": 18489297.737236,
                "resolution": 4891.96981024998
            }, {
                "level": 6,
                "scale": 9244648.868618,
                "resolution": 2445.98490512499
            }, {
                "level": 7,
                "scale": 4622324.434309,
                "resolution": 1222.99245256249
            }, {
                "level": 8,
                "scale": 2311162.217155,
                "resolution": 611.49622628138
            }, {
                "level": 9,
                "scale": 1155581.108577,
                "resolution": 305.748113140558
            }, {
                "level": 10,
                "scale": 577790.554289,
                "resolution": 152.874056570411
            }, {
                "level": 11,
                "scale": 288895.277144,
                "resolution": 76.4370282850732
            }, {
                "level": 12,
                "scale": 144447.638572,
                "resolution": 38.2185141425366
            }, {
                "level": 13,
                "scale": 72223.819286,
                "resolution": 19.1092570712683
            }, {
                "level": 14,
                "scale": 36111.909643,
                "resolution": 9.55462853563415
            }, {
                "level": 15,
                "scale": 18055.954822,
                "resolution": 4.77731426794937
            }, {
                "level": 16,
                "scale": 9027.977411,
                "resolution": 2.38865713397468
            }, {
                "level": 17,
                "scale": 4513.988705,
                "resolution": 1.19432856685505
            }, {
                "level": 18,
                "scale": 2256.994353,
                "resolution": 0.597164283559817
            }, {
                "level": 19,
                "scale": 1128.497176,
                "resolution": 0.298582141647617

            }

            ]

        });
        this.loaded = true;
        this.onLoad(this);
    },

    getTileUrl: function (level, row, col) {
        return "http://19.134.126.50:9010/CCGTMAP13_20/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CCGTMAP15_20&STYLE=CCGTMAP15_20&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + (level) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";
    }
});

dojo.declare("CCYXLayer", esri.layers.TiledMapServiceLayer, {
    //禅城影像
    constructor: function () {
		this.spatialReference = new esri.SpatialReference({
            wkt: 'PROJCS["fs",GEOGCS["GCS_Xian_1980",DATUM["D_Xian_1980",SPHEROID["Xian_1980",6378140.0,298.257]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",113.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
        });
		
        this.initialExtent = new esri.geometry.Extent(495626.68421803735 , 2534378.9967090613, 518629.3342180374, 2553836.8967090617, this.spatialReference);
        this.fullExtent = new esri.geometry.Extent(495626.68421803735 , 2534378.9967090613, 518629.3342180374, 2553836.8967090617,this.spatialReference);
        //
        this.tileInfo = new esri.layers.TileInfo({
            "dpi": "90.714285714274296",
            "format": "image/png",
            "compressionQuality": 0,
            "spatialReference": this.spatialReference,
            "rows": 256,
            "cols": 256,
            "origin": {
                "x": -20037508.34,
                "y": 20037508.34   //3578-3574 //20037508.342789
            },

            // Scales in DPI 96
            "lods": [{
                "level": 0,
                "scale": 591657527.591555,
                "resolution": 156543.033928
            }, {
                "level": 1,
                "scale": 295828763.795777,
                "resolution": 78271.5169639999
            }, {
                "level": 2,
                "scale": 147914381.897889,
                "resolution": 39135.7584820001
            }, {
                "level": 3,
                "scale": 73957190.948944,
                "resolution": 19567.8792409999
            }, {
                "level": 4,
                "scale": 36978595.474472,
                "resolution": 9783.93962049996
            }, {
                "level": 5,
                "scale": 18489297.737236,
                "resolution": 4891.96981024998
            }, {
                "level": 6,
                "scale": 9244648.868618,
                "resolution": 2445.98490512499
            }, {
                "level": 7,
                "scale": 4622324.434309,
                "resolution": 1222.99245256249
            }, {
                "level": 8,
                "scale": 2311162.217155,
                "resolution": 611.49622628138
            }, {
                "level": 9,
                "scale": 1155581.108577,
                "resolution": 305.748113140558
            }, {
                "level": 10,
                "scale": 577790.554289,
                "resolution": 152.874056570411
            }, {
                "level": 11,
                "scale": 288895.277144,
                "resolution": 76.4370282850732
            }, {
                "level": 12,
                "scale": 144447.638572,
                "resolution": 38.2185141425366
            }, {
                "level": 13,
                "scale": 72223.819286,
                "resolution": 19.1092570712683
            }, {
                "level": 14,
                "scale": 36111.909643,
                "resolution": 9.55462853563415
            }, {
                "level": 15,
                "scale": 18055.954822,
                "resolution": 4.77731426794937
            }, {
                "level": 16,
                "scale": 9027.977411,
                "resolution": 2.38865713397468
            }, {
                "level": 17,
                "scale": 4513.988705,
                "resolution": 1.19432856685505
            }, {
                "level": 18,
                "scale": 2256.994353,
                "resolution": 0.597164283559817
            }, {
                "level": 19,
                "scale": 1128.497176,
                "resolution": 0.298582141647617

            }

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
		
        this.initialExtent = new esri.geometry.Extent(496117.80467445566, 2535231.9442850314, 517781.26885500166, 2552716.944999657, this.spatialReference);
        this.fullExtent = new esri.geometry.Extent(496117.80467445566, 2535231.9442850314, 517781.26885500166, 2552716.944999657,this.spatialReference);
        //
        this.tileInfo = new esri.layers.TileInfo({
            "dpi": "90.714285714274296",
            "format": "image/png",
            "compressionQuality": 0,
            "spatialReference": this.spatialReference,
            "rows": 256,
            "cols": 256,
            "origin": {
                "x": -20037508.34,
                "y": 20037508.34   //3578-3574 //20037508.342789
            },

            // Scales in DPI 96
            "lods": [{
                "level": 0,
                "scale": 591657527.591555,
                "resolution": 156543.033928
            }, {
                "level": 1,
                "scale": 295828763.795777,
                "resolution": 78271.5169639999
            }, {
                "level": 2,
                "scale": 147914381.897889,
                "resolution": 39135.7584820001
            }, {
                "level": 3,
                "scale": 73957190.948944,
                "resolution": 19567.8792409999
            }, {
                "level": 4,
                "scale": 36978595.474472,
                "resolution": 9783.93962049996
            }, {
                "level": 5,
                "scale": 18489297.737236,
                "resolution": 4891.96981024998
            }, {
                "level": 6,
                "scale": 9244648.868618,
                "resolution": 2445.98490512499
            }, {
                "level": 7,
                "scale": 4622324.434309,
                "resolution": 1222.99245256249
            }, {
                "level": 8,
                "scale": 2311162.217155,
                "resolution": 611.49622628138
            }, {
                "level": 9,
                "scale": 1155581.108577,
                "resolution": 305.748113140558
            }, {
                "level": 10,
                "scale": 577790.554289,
                "resolution": 152.874056570411
            }, {
                "level": 11,
                "scale": 288895.277144,
                "resolution": 76.4370282850732
            }, {
                "level": 12,
                "scale": 144447.638572,
                "resolution": 38.2185141425366
            }, {
                "level": 13,
                "scale": 72223.819286,
                "resolution": 19.1092570712683
            }, {
                "level": 14,
                "scale": 36111.909643,
                "resolution": 9.55462853563415
            }, {
                "level": 15,
                "scale": 18055.954822,
                "resolution": 4.77731426794937
            }, {
                "level": 16,
                "scale": 9027.977411,
                "resolution": 2.38865713397468
            }, {
                "level": 17,
                "scale": 4513.988705,
                "resolution": 1.19432856685505
            }, {
                "level": 18,
                "scale": 2256.994353,
                "resolution": 0.597164283559817
            }, {
                "level": 19,
                "scale": 1128.497176,
                "resolution": 0.298582141647617

            }

            ]

        });
        this.loaded = true;
        this.onLoad(this);
    },

    getTileUrl: function (level, row, col) {
        return "http://19.134.126.50:9010/CCGTFZH2013/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CCGTFZH2013&STYLE=CCGTFZH2013&TILEMATRIXSET=Matrix_0&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=image%2Ftile";

    }
});