/**

Authors:
  Akash AN, BT Somaiah, Shruti Nair
  9th September'16

*/
var CloudantJS = function(){

};

CloudantJS.prototype.getAllEntries = function(){
	var resourceRequest = new WLResourceRequest("/adapters/CloudantJS/getAllEntries", WLResourceRequest.GET, 30000);
	return resourceRequest.send().then(function(response){
		return response.responseJSON.rows;
	});
};

CloudantJS.prototype.getAllDocEntries = function(){
	var resourceRequest = new WLResourceRequest("/adapters/CloudantJS/getAllDocEntries", WLResourceRequest.GET, 30000);
	return resourceRequest.send().then(function(response){
		return response.responseJSON.rows;
	});
};

CloudantJS.prototype.getAllAppointmentEntries = function(){
	var resourceRequest = new WLResourceRequest("/adapters/CloudantJS/getAllAppointmentEntries", WLResourceRequest.GET, 30000);
	return resourceRequest.send().then(function(response){
		return response.responseJSON.rows;
	});
};


CloudantJS.prototype.addEntry = function(entry){
	var resourceRequest = new WLResourceRequest("/adapters/CloudantJS/addEntry", WLResourceRequest.POST, 30000);
	return resourceRequest.sendFormParameters({ "params" : "['" + JSON.stringify(entry) + "']" });
};

CloudantJS.prototype.deleteEntry = function(entry){
	var resourceRequest = new WLResourceRequest("/adapters/CloudantJS/deleteEntry", WLResourceRequest.POST, 30000);
	return resourceRequest.sendFormParameters({ "params" : "['" + JSON.stringify(entry) + "']" });
};

CloudantJS.prototype.addAppointment = function(entry){
	var resourceRequest = new WLResourceRequest("/adapters/CloudantJS/addAppointment", WLResourceRequest.POST, 30000);
	return resourceRequest.sendFormParameters({ "params" : "['" + JSON.stringify(entry) + "']" });
};


