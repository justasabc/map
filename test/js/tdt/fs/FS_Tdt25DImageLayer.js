define(
	[
	"dojo/_base/declare",
	"esri/layers/tiled",
	"js/tdt/fs/Setting"
	], function(declare,tiled,Setting){

	return declare("",
		esri.layers.TiledMapServiceLayer, {
        	constructor: function() {
          this.spatialReference = Setting.spatialReference_fs;
	  this.initialExtent = this.fullExtent = Setting.extent_25dimage;
          this.tileInfo = Setting.tileInfo;
          this.loaded = true;
          this.onLoad(this);
        },
 
        getTileUrl: Setting.getTileUrl_25dimage,

      });
});
