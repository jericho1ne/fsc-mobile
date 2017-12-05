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
		var urlParams = 
			`term=coffee-tea&` + 
			// Need either `location` || (`lat` && `lon`)
			`lat=${location.latitude}&` + 
			`lon=${location.longitude}&` +
			// List of comma delimited pricing levels (1,2,3,4)
			`price=1,2,3,4&` +
			// Defaults to best_match if not provided  { best_match, rating, review_count, distance }
			`sort_by=distance&` +
			// Always set a limit!
			`limit=33`;

		Biz.fetchData('search', urlParams)
			.then((data) => {
				// Remove crappy coffee shops
				var legitCoffeeShops = Biz.stripCoffeeShops(data);

				// TODO: Display a "sorry" message if (legitCoffeeShops.length === 0)
				Biz.setItemList(legitCoffeeShops);
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