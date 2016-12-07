/**

Authors:
  Akash AN, BT Somaiah, Shruti Nair
  9th September'16


*/
var Cloudant = function(type){
	if(type == "javascript"){
		return new CloudantJS();
	}
	
};
