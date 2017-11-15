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
		`limit=3`;

	// Api method returns a promise containing 
	// nearby coffee shops
	Common.fetchData('search', urlParams)
		.then((data) => {
			// Sort based on proximity
			data.sort(function(a, b) {		
				// sort by proximity (closest first)
				return parseFloat(a.distance) - parseFloat(b.distance);
			});

			// Convert meters to miles, 
			// customize display values
			data.forEach((item) => {
				let thisFarAway = (item.distance * 0.000621371).toFixed(1);
				item.distance = thisFarAway < 0.1 
					? `* Really Close *`
					: `${thisFarAway} miles away`;

				// Replace the larger original image with a smaller one
				const pattern = /o.jpg/;
				const smaller_img = item.image_url.replace(pattern, 'l.jpg');							
				item.image_url = smaller_img;				

				// Set directions url
				item.composite_address = `${item.name}, ${item.location.address1}, ${item.location.city}, ${item.location.country}`
				item.mapsURL = 
					'https://www.google.com/maps/search/?api=1&query=' +
				 	item.composite_address;
			});

			console.log(">>>>>>>>>>>>>>>>");
			console.log(data[0].id);
			console.log(data[0].name);
			// console.log(data[0].image_url);
			// console.log(data[0].url);
			console.log(data[0].rating + " stars");
			console.log(data[0].distance);
			console.log(">>>>>>>>>>>>>>>>");
			itemList.replaceAll(data);
		});

}).catch((fail) => {
	console.log(" (x) getLocation failed ... " + fail);
});
// console.log(JSON.stringify(GeoLocation.location));


module.exports = {
	// Methods
	// Data
	itemList: itemList,
	// callPhoneNumber: Common.callPhoneNumber,
};