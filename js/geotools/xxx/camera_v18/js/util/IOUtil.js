/*
	io util: save&load,show&clear points
	
	************************
	@author: kezunlin
	@create date: 2015-11-24
	@update date: 2016-03-4
	@version: v1.5
	************************
	
	global
	@map 
	@g_point_list(marker,address) for UI
	
	(add 2016-03-04)
	@g_clear for clearing existing points when open file
	
	temp 
	@store_list(lng,lat,address) for storage
	
	http://eligrey.com/demos/FileSaver.js/
	https://github.com/dcneiner/Downloadify
	http://pixelgraphics.us/downloadify/test.html
	http://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
*/

//===========================================================
// show and clear points
//===========================================================
function showAll(){
	g_point_list.forEach(function(p,i){
		// ui
		map.addOverlay(p.marker);
		setMarkerLabel(p.marker,p.address); 
	});
	// show point count
	showPointCount();
};

function clearAll(){
	map.clearOverlays();
	g_point_list.length = 0;
	
	// show point count
	showPointCount();
};

// ===================================================================
// download text to filename only for Chrome and Firefox  (not for ie)
// ===================================================================
function linkDownload(a, filename, type,content) {
	var uriContent =  type+","+encodeURIComponent(content);
	a.setAttribute('href', uriContent);
	a.setAttribute('download', filename);
}

function download2(filename, content) {
	var a = document.createElement('a');
	var type = "data:text/plain;charset=utf-8";
	linkDownload(a, filename,type,content);
	
	if (document.createEvent) {
		var event = document.createEvent('MouseEvents');
		event.initEvent('click', true, true);
		a.dispatchEvent(event);
	}
	else {
		a.click();
	}
};

function download(filename, content) {
	var a = document.createElement('a');
	//var type = "data:application/octet-stream";
	var type = "data:text/plain;charset=utf-8";
	linkDownload(a, filename,type,content);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

// ==============================================================
// NEED UPDATE
// ==============================================================
//@g_point_list(marker,address) for UI   frontend
//@store_list(lng,lat,address) for storage backend

function frontend_to_backend(f){
	//(marker,address)
	var pt = f.marker.point;
	var address = f.address;
	var b = {"lng":pt.lng,"lat":pt.lat,"address":address};
	return b;
}

function backend_to_frontend(b){
	//(lng,lat,address)
	var pt = new BMap.Point(b.lng,b.lat);
	var address = b.address;
	var marker = new BMap.Marker(pt);
	var f = {"marker":marker,"address":address};
	return f;
}

function pointList_to_storeList(point_list){
	var store_list = [];
	point_list.forEach(function(f,i){
		var b = frontend_to_backend(f);
		store_list.push(b);
	});
	return store_list;
}

function storeList_to_pointList(store_list){
	var point_list = [];
	store_list.forEach(function(b,i){
		var f = backend_to_frontend(b);
		point_list.push(f);
	});
	return point_list;
}

function json_to_str(json){
	return JSON.stringify(json);
}

function str_to_json(str){
	return JSON.parse(str);
}

function json_demo(){
	var json_obj = {"name":kezunlin};
	var str = JSON.stringify(json_obj);
	var new_json_obj = JSON.parse(str);
}

function outputPoint(g_point_list){
	var store_list = pointList_to_storeList(g_point_list);
	var str = json_to_str(store_list);
	console.log("====================================");
	console.log(str);
	
	var length = g_point_list.length;
	window.prompt(length+"个点，Ctrl+C复制，保存为多个“points.json”文件", str);
}

function saveJson(g_point_list,filename){
	var store_list = pointList_to_storeList(g_point_list);
	var str = json_to_str(store_list);
	console.log("====================================");
	console.log(str);
	download(filename,str);
}

// load from url
function loadJson_byUrl(data_url){
	//1) clear all at first 
	clearAll();
	
	//2) load all points
	$.ajaxSetup({async : false}); // false
	$.get(data_url,function(store_list){
		console.log("Loading json...");
		// set new value for global point list (NOTICE HERE)
		g_point_list = storeList_to_pointList(store_list);
		console.log(" Loading finished.");
	});
	
	//3) show all at last 
	showAll();
}

// load from file result
// @r: str points
// @g_clear: whether clear existing points (true for open file, false for append file)
function loadJson_byFileResult(r,g_clear){
	//1) clear all at first 
	if (g_clear){
		clearAll();
	}
	
	//2) load all points
	console.log("Loading json...");
	var store_list = str_to_json(r);
	// set new value for global point list (NOTICE HERE)
	var temp_point_list = storeList_to_pointList(store_list);
	
	// append point
	append_globalPointList(g_clear,temp_point_list);
	
	console.log(" Loading finished.");
	
	//3) show all at last 
	showAll();
}

// append point list to g_point_list
function append_globalPointList(g_clear,temp_point_list){
	if (g_clear){
		// clear existing points
		g_point_list = [];
	}
	temp_point_list.forEach(function(f,i){
		g_point_list.push(f);
	});
}

//========================================================================
// upload file
//========================================================================
function registerFileEvent(id){
	var input = document.getElementById(id);
	if(typeof FileReader === 'undefined'){
		var msg = "Sorry, your browser doesn't support FileReader. Please use Chrome/Firefox instead";
		alert(msg);
		input.setAttribute('disabled','disabled');
	}else{
		input.addEventListener('change',uploadFile,false);
	}
}

function uploadFile(e){
	// e.currentTarget------this-----<input type="file" id="file_input">
	var length = e.currentTarget.files;
	if(length<1){
		alert("No file has been uploaded!");
		return;
	}
	var file = e.currentTarget.files[0];
	var reader = new FileReader();
	reader.onload = onLoadFile;
	//reader.readAsDataURL(file);  // for image,html 
	reader.readAsText(file); // for text
}

function onLoadFile(e){
	var r = e.currentTarget.result; // this-----reader
	// use g_clear to control results
	loadJson_byFileResult(r,g_clear);
}