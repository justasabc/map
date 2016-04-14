/*
	batch data util
	
	************************
	@author: kezunlin
	@create date: 2015-12-8
	@update date: 2016-03-4
	@version: v1.0
	************************
	
	depends:
	@PointUtil.js  to process data   (fs_to_baidu_allInOne,baidu_to_fs_allInOne)
	@IOUtil.js to save file          (download)
*/

function array_to_str(array){
	var str = "";
	array.forEach(function(e){
		str += e+"\r\n";
	});
	return str;
};

function save_array(array,filename){
	// [1,2,3,4,5]
	var str = array_to_str(array);
	download(filename,str);
};

// [x1,x2,x3,...] [y1,y2,y3,...]
function batch_baidu2fs(x_array,y_array){
	var x_len = x_array.length;
	var y_len = y_array.length;
	if(x_len!=y_len){
		alert("data not full!");
		return;
	}
	
	var new_x_array = [];
	var new_y_array = [];
	// transform
	x_array.forEach(function(e,i){
		var point_bd = {lon:x_array[i],lat:y_array[i]};
		// core method
		var pt_fs = baidu_to_fs_allInOne(point_bd);
		// store
		new_x_array.push(pt_fs.lon);
		new_y_array.push(pt_fs.lat);
	});
	
	// save to file
	save_array(new_x_array,"fs_x.txt");
	save_array(new_y_array,"fs_y.txt");
};

// [x1,x2,x3,...] [y1,y2,y3,...]
function batch_fs2baidu(x_array,y_array){
	var x_len = x_array.length;
	var y_len = y_array.length;
	if(x_len!=y_len){
		alert("data not full!");
		return;
	}
	
	var new_x_array = [];
	var new_y_array = [];
	// transform
	x_array.forEach(function(e,i){
		var point_fs = {lon:x_array[i],lat:y_array[i]};
		// core method
		var pt_bd = fs_to_baidu_allInOne(point_fs);
		// store
		new_x_array.push(pt_bd.lon);
		new_y_array.push(pt_bd.lat);
	});
	
	// save to file
	save_array(new_x_array,"bd_x.txt");
	save_array(new_y_array,"bd_y.txt");
};