/**
 * Fuse + Custom JS modules
 */
var Observable = require("FuseJS/Observable");
var Common = require("./Common.js");


// User variables that keep updating throughout the life of app
var latitude = Observable(39.4);
var longitude = Observable(-111.5);

// Return only the latest lat / lon
var userLocation = latitude.combineLatest(longitude, function(lat, lon) {
	return {
		latitude: lat,
		longitude: lon
	};
});

function setLocation(location) {
	// Common.log(location);
	latitude.add(location.latitude);
	longitude.add(location.longitude);
}

function getLocation() {
	return userLocation;
}

module.exports = {
	// Methods
	setLocation: setLocation,
	getLocation: getLocation,

	// Data
	location: userLocation,
	// itemList: itemList,
};