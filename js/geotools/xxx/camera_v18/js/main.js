/*
	main.js entry
*/

// close defaut POI click event
var level = 19;
var map;
var geoc;
var center_point;

var action_type = ""; // add move delete
var g_point_list = [];  // global g_point_list(marker,address) for UI
//var store_list = [];  // temp store_list(lng,lat,address) for storage
var filename = "camera"; 
var file_ext = ".json"; // must be json type

// global g_clear for use in IOUtil.js
// init value for g_clear should be same with checked state!
var g_clear = false;

// main entry for js
function main_entry(){
	init_map();
	// register_ui_events_dom(); // old style
	register_ui_events_jquery(); // new style
}

function init_map(){
	map = new BMap.Map("allmap",{enableMapClick:false}); 
	center_point = new BMap.Point(113.1296690000,23.0249320000); //23.0249320000,113.1296690000
	map.centerAndZoom(center_point,level);
	map.setCurrentCity("佛山市");

	//map.setMapType(BMAP_HYBRID_MAP);
	//map.setMapType(BMAP_SATELLITE_MAP);
	map.setMapType(BMAP_NORMAL_MAP);

	map.addControl(new BMap.NavigationControl());           
	map.addControl(new BMap.MapTypeControl());  	
	map.enableScrollWheelZoom(true);                           
	map.disable3DBuilding();
	
	/*
	var style = 'normal';  // normal midnight
	map.setMapStyle({style:style});
	*/
	
	geoc = new BMap.Geocoder();
	map.addEventListener("click",mapClick);
	map.addEventListener("mousemove",mapMouseMove);
	map.setDefaultCursor("default"); 
}

// dom style
function register_ui_events_dom(){
	//====================================================================
	// ui event
	//====================================================================
	document.getElementById("AddButton").onclick = function(){ 
		action_type = "add";
		map.setDefaultCursor("crosshair"); 
		disableMoving(g_point_list); // disable moving
	};
	document.getElementById("DeleteButton").onclick = function(){ 
		action_type = "delete";
		map.setDefaultCursor("default"); 
		disableMoving(g_point_list); // disable moving
	};
	document.getElementById("MoveButton").onclick = function(){ 
		action_type = "move";
		map.setDefaultCursor("default"); 
		enableMoving(g_point_list); // enable moving
	};
	document.getElementById("ModifyButton").onclick = function(){ 
		action_type = "modify";
		map.setDefaultCursor("default"); 
		disableMoving(g_point_list); // disable moving
	};
	document.getElementById("ClearButton").onclick = function(){ 
		clearAll();
	};
	document.getElementById("DefaultButton").onclick = function(){ 
		action_type = "";
		map.setDefaultCursor("default"); 
		disableMoving(g_point_list); // disable moving
	};
	
	// init g_clear
	g_clear = $("#ClearAllPointsCheckBox").attr("checked")=="checked";
	document.getElementById("ClearAllPointsCheckBox").onclick = function(){ 
		g_clear = $("#ClearAllPointsCheckBox").attr("checked")=="checked";
		//alert(g_clear);
	};

	// locate by address and pos
	document.getElementById("AddressLocateButton").onclick = function(){ 
		addressLocate();
	};
	document.getElementById("PosLocateButton").onclick = function(){ 
		posLocate();
	};

	// save and load points
	document.getElementById("SaveButton").onclick = function(){ 
		saveFile();
	};
	//========================================================================
	// upload file
	//========================================================================
	registerFileEvent("file_input"); // register	
}

// jquery style
function register_ui_events_jquery(){
	//====================================================================
	// ui event
	//====================================================================
	$("#AddButton").click( function(){ 
		action_type = "add";
		map.setDefaultCursor("crosshair"); 
		disableMoving(g_point_list); // disable moving
	});
	
	$("#DeleteButton").click( function(){ 
		action_type = "delete";
		map.setDefaultCursor("default"); 
		disableMoving(g_point_list); // disable moving
	});
	
	$("#MoveButton").click( function(){ 
		action_type = "move";
		map.setDefaultCursor("default"); 
		enableMoving(g_point_list); // enable moving
	});
	
	$("#ModifyButton").click( function(){ 
		action_type = "modify";
		map.setDefaultCursor("default"); 
		disableMoving(g_point_list); // disable moving
	});
	
	$("#ClearButton").click( function(){ 
		clearAll();
	});
	
	$("#DefaultButton").click( function(){ 
		action_type = "";
		map.setDefaultCursor("default"); 
		disableMoving(g_point_list); // disable moving
	});
	
	// init g_clear
	g_clear = $("#ClearAllPointsCheckBox").attr("checked")=="checked";
	$("#ClearAllPointsCheckBox").click( function(){ 
		g_clear = $("#ClearAllPointsCheckBox").attr("checked")=="checked";
		//alert(g_clear);
	});

	// locate by address and pos
	$("#AddressLocateButton").click( function(){ 
		addressLocate();
	});
	
	$("#PosLocateButton").click( function(){ 
		posLocate();
	});

	// save and load points
	$("#SaveButton").click( function(){ 
		saveFile();
	});
	
	//========================================================================
	// upload file
	//========================================================================
	registerFileEvent("file_input"); // register	
}

function enableMoving(g_point_list){
	g_point_list.forEach(function(p){
		// p.marker,  p.address 
		var marker = p.marker;
		marker.enableDragging();
	});
}

function disableMoving(g_point_list){
	g_point_list.forEach(function(p){
		// p.marker,  p.address 
		var marker = p.marker;
		marker.disableDragging();
	});
}

//=================================================================
// save file  (2016-02-29)
//=================================================================
function saveFile(){
	filename = prompt("请输入文件名称","");
	// make sure input name is valid
	if (filename!=null && filename!=""){
		filename = filename + file_ext;
		
		// save json file
		saveJson(g_point_list,filename);
		alert(filename+"保存成功！");
	}else{
		alert("请输入文件名称！");
	}
}

//====================================================================
// show info
//====================================================================
// show current point (2016-03-01)
function showCurrentPoint(pt){
	//document.getElementById('lng').value= pt.lng;	
	//document.getElementById('lat').value= pt.lat;
	$('#lng').val(pt.lng);
	$('#lat').val(pt.lat);
}

function showPointCount(){
	var text = "当前点数：#"+g_point_list.length+"个";
	//document.getElementById('count').innerHTML=text;
	$('#count').html(text);
}

//=================================================================
// map events
//=================================================================
function mapClick(e){
	console.log("mapClick");
	if (action_type=="add"){
		// if add camera, auto populate input field with geocoding address
		addCamera(e.point);
		//addAddress(e.point);
	}else if (action_type=="delete"){
		//deletePoint(e.point);  // old style
		deleteOverlay(e.overlay);// new style
	}else if (action_type=="modify"){
		modifyOverlay(e.overlay);// new style
	}
}

function mapMouseMove(e){
	var pt = e.point;
	/*
	if (action_type=="add"){
	}else if (action_type=="delete"){
	}
	*/
	
	// show info 
	showCurrentPoint(pt);
	showPointCount(); // must be here, otherwise count display will not be correct!
}
//=================================================================
// end of map events
//=================================================================

// add camera
function addCamera(pt){
	geoc.getLocation(pt, function(rs){
		var addComp = rs.addressComponents;
		var full_address = addComp.province+addComp.city+addComp.district+addComp.street+addComp.streetNumber;
		// auto populate field with address
		inputField(pt,full_address);
	});
}

// add normal address
function addAddress(pt){
	inputField(pt,"");
}

function inputField(pt,text){
	var address = prompt("请输入地址",text);
	// make sure input name is valid
	if (address!=null && address!=""){
		// add baidu marker
		var marker = addBaiduMarker(pt,address); 
		
		// save point 
		var point_dict = {"marker":marker,"address":address};
		g_point_list.push(point_dict);
	}else {
		alert("请输入有效地址");
	}
}

//====================================================================
// locate address 
//====================================================================	
function addressLocate(){
	var name = $("#address").val();
	if (name!=null && name!=""){
		address_locate(name);
	}else {
		alert("请输入有效地址");
	}
}

function address_locate(name){
	geoc.getPoint(name, function(point){
		if (point) {
			// center map
			centerMap(point);
		}else{
			alert("您选择地址没有解析到结果!");
		}
	}, "佛山市");
}

// locate pos  (2016-03-01)
function posLocate(){
	var lng = $("#lng").val();
	var lat = $("#lat").val();
	if (lng!=null && lng!="" && lat!=null && lat!=""){
		var pos = new BMap.Point(lng,lat);
		centerMap(pos);
	}
	else {
		alert("请输入有效坐标");
	}
}

// center map and add a marker
function centerMap(point){
	map.centerAndZoom(point, level);
	addBaiduMarker(point,"+"); // add baidu marker		
}
