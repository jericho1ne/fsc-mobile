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
const timeout_ms = 12000;

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

/**
 * Get new businesses nearby when position has changed
 * @return nothing
 */
function reloadHandler() {
	// Clear existing coffee shops
	Biz.itemList.replaceAll([]);
	// Run search again for nearby shops
	getCoffeeShopsNearby();
	
	// Handle UI stuff
	Biz.isLoading.value = true;

	// Manual cutoff 
	// setTimeout(endLoading, 1750);
}

function refreshMap(args) {
	console.log('*** refreshMap ***');
	console.log(User.lat.value + ', ' + User.lon.value);

	// Trigger "loading" modal
	Biz.isLoading.value = true;

	// Make the API call for nearby businesses
	const urlParams = 
		`${Common.PRESET_PARAMS}&` +
		`lat=${User.lat.value}&` + 
		`lon=${User.lon.value}`;

	Biz.fetchData('search', urlParams)
		.then((data) => {
			// TODO: Display a "sorry" message if (legitCoffeeShops.length === 0)
			Biz.setItemList(data);
		});
}

module.exports = {
	// Methods
	getCoffeeShopsNearby: getCoffeeShopsNearby,
	reloadHandler: reloadHandler, 
	refreshMap: refreshMap,

	// Data
	itemList: Biz.itemList,
};