/**
 * Fuse + Custom JS modules
 */
var GeoLocation = require("FuseJS/GeoLocation");
var Observable = require("FuseJS/Observable");
var Common 	= require("./Common.js");
var User 	= require("./User.js");
var Biz 	= require("./Biz.js");

// Get location (time out after a certain wait time)
const timeout_ms = 6000;

// Get location, then hit the Yelp API for results
GeoLocation.getLocation(timeout_ms).then((location) => {
	// TODO: keep an eye on location, periodically calling
	// getLocation(); update itemList if location has changed.
	User.setLocation(location);

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
	Biz.fetchData('search', urlParams)
		.then((data) => {
			// Remove crappy coffee shops
			var legitCoffeeShops = Biz.stripCoffeeShops(data);
			Biz.setItemList(legitCoffeeShops);
		});

}).catch((fail) => {
	console.log(" (x) getLocation failed ... " + fail);
});

module.exports = {
	// Methods
	// Data
	itemList: Biz.itemList,
};