var GeoLocation = require("FuseJS/GeoLocation");
var Observable = require("FuseJS/Observable");
var Common = require("./common.js");

// Item list changes based on location and needs; gets replaced as soon as 
// fetchData() returns
var itemList = Observable();

// Get location (time out after a certain wait time)
var userLocation = Observable();
var timeout_ms = 6000;

// Get location, then hit the Yelp API for results
GeoLocation.getLocation(timeout_ms).then((location) => {
	// TODO: keep an eye on location, periodically calling
	// getLocation(); update itemList if location has changed.
	userLocation.value = JSON.stringify(location);
	userLocation.lat = location.latitude;
	userLocation.lon = location.longitude;

	// Make the API call for nearby businesses
	var urlParams = 
		`term=coffee&` + 

		// Need either location OR lat/lon
		// `location=Los Angeles, CA&` +
		`lat=${location.latitude}&` + 
		`lon=${location.longitude}&` +

		// List of comma delimited pricing levels (1,2,3,4)
		`price=1,2,3,4&` +
		
		// Defaults to best_match if not provided
		//   { best_match, rating, review_count, distance }
		`sort_by=distance&` +

		// Always set a limit!
		`limit=30`;

	// Api method returns a promise containing 
	// nearby coffee shops
	Common.fetchData('search', urlParams)
		.then((data) => {
			// Remove crappy coffee shops
			// var legitCoffeeShops = Common.stripCoffeeShops(data);
			// console.log(">>>>>>>>>>>>>>>>");
			// console.log(JSON.stringify(data[0]));
			// console.log(">>>>>>>>>>>>>>>>");
			itemList.replaceAll(legitCoffeeShops);
		});

}).catch((fail) => {
	console.log(" (x) getLocation failed ... " + fail);
});

module.exports = {
	// Methods
	// Data
	itemList: itemList,
	// callPhoneNumber: Common.callPhoneNumber,
};