/**
 * Provides a clean way to print data to console
 * @param  {[type]} items [description]
 * @return {[type]}       [description]
 */
function log(items) {
	items.forEach((item) => {
		for (var propName in item) {
			console.log(propName + ' : ' + item[propName]);
		}
		console.log(' ------------------------------------------------ ');
	});
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
	
	// console.log(" >>> API URL ");
	// console.log(requestUrl);

	return fetch(requestUrl)
		.then(function(response) { 
			return response.json();
		})
		.then(function(response) {
			if (typeof response.businesses === 'object') {
				var items = response.businesses;
				// log(items);

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
stripCoffeeShops: function(items) {
	let goodCoffeeShops = [];
	items.forEach((item, index) => {
		const itemName = item.name.trim().toLowerCase();
		const imgUrl = item.image_url.trim();

		if (itemName.indexOf('starbucks') == -1 &&
			itemName.indexOf('dunkin donuts') == -1 &&
			itemName.indexOf('biggby') == -1 &&
			itemName.indexOf('dunkin\' donuts') == -1 &&
			itemName.indexOf('coffee bean and tea') == -1 &&
			itemName.indexOf('coffee bean & tea') == -1 &&
			itemName.indexOf('peet\'s') == -1 &&
			itemName.indexOf('caribou') == -1 &&
			itemName.indexOf('tim horton') == -1 && 
			itemName.indexOf('boba') == -1 && 
			itemName.indexOf('deli') == -1 &&
			item.rating > 3 &&
			imgUrl !== ''
		) {
			goodCoffeeShops.push(item);
		}
	});
	return goodCoffeeShops;
}, // End stripCoffeeShops()

module.exports = {
	fetchData: fetchData,
	log: log,
};