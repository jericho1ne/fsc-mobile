/**
 * Fuse + Custom JS modules
 */
var GeoLocation = require("FuseJS/GeoLocation");
var Observable = require("FuseJS/Observable");
var Common 	= require("./Common.js");
var User 	= require("./User.js");
var Biz 	= require("./Biz.js");
var Blog 	= require("./Blog.js");

// Get location (time out after a certain wait time)
const timeout_ms = 8000;

function getCoffeeShopsNearby() {
	// Get location, then hit the Yelp API for results
	return GeoLocation.getLocation(timeout_ms).then((location) => {
		// TODO: keep an eye on location, periodically calling
		// getLocation(); update itemList if location has changed.
		User.setLocation(location);

		// Make the API call for nearby businesses
		// Need either `location` OR (`lat` && `lon`)
		var urlParams = 
			`${Common.PRESET_PARAMS}&` +
			`lat=${location.latitude}&` + 
			`lon=${location.longitude}`;

		Biz.fetchData('search', urlParams)
			.then((data) => {
				// TODO: Display "nothing found" msg if array length === 0
				Biz.setItemList(data);
			});

	}).catch((fail) => {
		console.log(" (x) getLocation failed ... " + fail);
	});
}

module.exports = {
	// Methods
	getCoffeeShopsNearby: getCoffeeShopsNearby,

	// Data
	itemList: Biz.itemList,
};