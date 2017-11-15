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
				log(items);

				// Sort based on proximity
				items.sort(function(a, b) {		
					// sort by proximity (closest first)
					return parseFloat(a.distance) - parseFloat(b.distance);
				});

				// Convert meters to miles, customize display value
				// items.forEach((item) => {
				// 	console.log(item.name);

				// 	// Add a custom distance parameter
				// 	var thisFarAway = (item.distance * 0.000621371).toFixed(1);
				// 	item.distance = thisFarAway < 0.1 
				// 	 	? `* Really Close *`
				// 	 	: `${thisFarAway} miles away`;

				// 	// Replace the larger original image with a smaller one
				// 	const pattern = /o.jpg/;
				// 	const smaller_img = item.image_url.replace( pattern, "l.jpg" );
				// 	item.image_url = smaller_img;
				// });
				return items;
			} else {
				return {};
			}
	});
} // End fetchData


module.exports = {
	fetchData: fetchData,
	log: log,
};