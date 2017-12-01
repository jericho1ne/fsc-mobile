/**
 * Fuse + Custom JS modules
 */
var Observable = require("FuseJS/Observable");
var Common = require("./Common.js");
var User = require("./User.js");

var isLoading = Observable(true);

// `itemList` changes based on user location.
// Gets replaced as soon as getLocation() + fetchData() returns
var itemList = Observable();

function setItemList(new_items) {
	itemList.replaceAll(new_items); 
	// Hide "loading" modal
	isLoading.value = false;
}

/**
 * Ajax call to data source
 * @param {string} endpoint (eg: search, cities, etc)
 * @param {string} requestUrl GET url params to be appended
 * @return {Promise} 
 */
function fetchData(endpoint, urlParams) {
	var requestUrl = 
		'https://api.findsomecoffee.com/' 
		+ endpoint + '?' + urlParams;
		
	// console.log(" >>> API URL :: " + requestUrl);

	return fetch(requestUrl)
		.then(function(response) { 
			return response.json();
		})
		.then(function(response) {
			if (typeof response === 'object') {
				var items = response;

				// Sort based on proximity
				items.sort(function(a, b) {		
					// sort by proximity (closest first)
					return parseFloat(a.distance) - parseFloat(b.distance);
				});
				// Convert meters to miles, 
				// customize display values
				items.forEach((item) => {
					// Add a custom distance parameter
					var thisFarAway = (item.distance * 0.000621371).toFixed(1);
					item.distance = thisFarAway < 0.1 
					 	? `* Really Close *`
					 	: `${thisFarAway} miles away`;

					// Replace the larger original image with a smaller one
					const pattern = /o.jpg/;
					const smaller_img = item.image_url.replace( pattern, "l.jpg" );
					item.image_url = smaller_img;

					// Set directions url
					item.composite_address = `${item.name}, ${item.location.address1}, ${item.location.city}, ${item.location.country}`
					item.mapsURL = 
						'https://www.google.com/maps/search/?api=1&query=' +
					 	item.composite_address;
				});

				return items;
			} else {
				return {};
			}
	});
} // End fetchData


/**
 * Remove mainstream shops and ones without a photo
 * @param  {array} items Array of cofee shops returned from API
 * @return {array} Stripped down list that passes QC ;)
 */
function stripCoffeeShops(items) {
	var goodCoffeeShops = [];
	items.forEach((item, index) => {
		const itemName = item.name.trim().toLowerCase();
		const imgUrl = item.image_url.trim();
		if (imgUrl !== '') {
			goodCoffeeShops.push(item);
		}
	});
	return goodCoffeeShops;
} // End stripCoffeeShops()


module.exports = {
	// Data
	itemList: itemList,
	isLoading: isLoading,

	// Methods
	setItemList: setItemList, 
	fetchData: fetchData,
	stripCoffeeShops: stripCoffeeShops,
};