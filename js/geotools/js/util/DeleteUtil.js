/*
	io util
	
	************************
	@author: kezunlin
	@create date: 2015-12-04
	@update date: 2016-03-4
	@version: v1.3
	************************
	
	global
	@map
	@g_point_list(marker,address) for UI
*/

//=========================================================
// modify overlay
//=========================================================
function modifyOverlay(overlay){
	if(overlay == null)
		return;
	for(var i=0;i<g_point_list.length;i++){
		var marker = g_point_list[i].marker;
		if(overlay==marker){
			confirmModify(i,marker);
			return;
		}
	}
}

function confirmModify(i,marker){
	var address = g_point_list[i].address;
	var new_address = prompt("请修改地址",address);
	// make sure input name is valid
	if (new_address!=null && new_address!=""){
		// remove old marker 
		map.removeOverlay(marker);
		
		// add new marker
		var new_marker = addBaiduMarker(marker.point,new_address);
		
		// update global point list
		g_point_list[i].address = new_address;
		g_point_list[i].marker = new_marker;
	}else {
		alert("请输入有效地址");
	}
}

//=========================================================
// delete overlay
//=========================================================
// new style 
function deleteOverlay(overlay){
	if(overlay == null)
		return;
	for(var i=0;i<g_point_list.length;i++){
		var marker = g_point_list[i].marker;
		if(overlay==marker){
			confirmDelete(i,marker);
			return;
		}
	}
}

// old style
function deletePoint(point){
	var bselect = false;
	var i;
	for(i=0;i<g_point_list.length;i++){
		var marker = g_point_list[i].marker;
		var p = marker.point; // get point from list
		bselect = selectPoint(point,p);
		if (bselect == true){
			confirmDelete(i,marker);
			return;
		}
	}
}

function selectPoint(point,pt){
	var d = (point.lng-pt.lng)*(point.lng-pt.lng)+(point.lat-pt.lat)*(point.lat-pt.lat);
	var d2 = d*100000000;
	console.log(d2);
	if(d2 <1.0){
		return true;
	}else{
		return false;
	}
}

function confirmDelete(i,marker){
	var r=confirm("确定删除该点吗？");
	if (r==true){
		g_point_list = g_point_list.removeAt(i);
		map.removeOverlay(marker);
	}
}
