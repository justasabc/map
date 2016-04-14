/*
	array util
	
	************************
	@author: kezunlin
	@create date: 2015-11-25
	@update date: 2016-03-04
	@version: v1.0
	************************
*/

// add removeAt for array
Array.prototype.removeAt = function( index ){
	// 0-based index
	if(index>=0 && index<this.length){
		for(var i=index; i<this.length; i++){
			this[i] = this[i+1];
		}
		this.length = this.length-1;
	}
	return this;
}

function removeElement(index,array){
	if(index>=0 && index<array.length){
		for(var i=index; i<array.length; i++){
			array[i] = array[i+1];
		}
		array.length = array.length-1;
	}
	return array;
}
