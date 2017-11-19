/**
 * Fuse + Custom JS modules
 */
var Observable = require("FuseJS/Observable");
var Common = require("./Common.js");


// User variables that keep updating throughout the life of app
var latitude = Observable(34.0422);
var longitude = Observable(-118.3437);
var zoomLevel = Observable(10);

// Return only the latest lat / lon and zoom level
// var location = latitude.combineLatest(longitude, zoomLevel, function(latitude, longitude, zoomLevel) {
// 	return {
// 		lat: latitude,
// 		lon: longitude,
// 		zoom: zoomLevel
// 	};
// });

var location = Observable(function() {
	return {
		lat: latitude.value,
		lon: longitude.value,
		zoom: zoomLevel.value
	};
});

function setLocation(location) {
	// Common.log(location);
	latitude.value = location.latitude;
	longitude.value = location.longitude;
	zoomLevel.value = 14;
	// latitude.add(location.latitude);
	// longitude.add(location.longitude);
	
	// latitude.replaceAt(0, location.latitude);
	// longitude.replaceAt(0, location.longitude);
}

function getLocation() {
	return location;
}

module.exports = {
	// Methods
	setLocation: setLocation,
	getLocation: getLocation,

	// Data
	location: location,
	lat: latitude,
	lon: longitude,
	zoomLevel: zoomLevel
};