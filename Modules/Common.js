/**
 * Fuse JS modules
 */

// Route telephone number click to Dial app, IG links, etc
var InterApp = require("FuseJS/InterApp");
var Maps = require("FuseJS/Maps");

// Business search API presets
const BIZ_SEARCH_URL = 'https://api.findsomecoffee.com/';
const MAX_RESULTS = 34;
const PRESET_PARAMS = 
	`term=coffee-tea&` +
	// List of comma delimited pricing levels (1,2,3,4)
	`price=1,2,3,4&` +
	// Defaults to best_match if not provided  { best_match, rating, review_count, distance }
	`sort_by=distance&` +
	`limit=${MAX_RESULTS}`;

/**
 * Provides a clean way to print data to console
 * @param  {[type]} items [description]
 * @return {[type]}       [description]
 */
function log(items) {
	if (Array.isArray(items)) {
		items.forEach((item) => {
		console.log(JSON.stringify(item));

		for (var propName in item) {
			console.log(propName + ' : ' + item[propName]);
		}
		console.log('----------------------------------------------- ');
	});
	}
	else {
		console.log(JSON.stringify(items));
		console.log('----------------------------------------------- ');
	}
} // End log()


/**
 * On phone number click, route to telephone app
 */
function callPhoneNumber(args) {
	// console.log('*** callPhoneNumber ***' + JSON.stringify(args.data.phone));
	InterApp.launchUri("tel:" + args.data.phone);
}

function goToIG(args) {
	// console.log('*** callPhoneNumber ***' + JSON.stringify(args.data.phone));
	InterApp.launchUri("instagram://user?username=findsomecoffee");
}

function shareViaSms(args) {
	const sms_link = 
		`sms:1-408-555-1212;body=${args.data.composite_address}`;
	// console.log('****** shareViaSMS ***' + JSON.stringify(sms_link));
	// InterApp.launchUri(JSON.stringify(sms_link));
}

function getDirections(args) {
	const lat = args.data.coordinates.latitude;
	const lon = args.data.coordinates.longitude;
	// console.log('*** getDirections ***' + lat + " , " + lon + " || " + args.data.composite_address);
	Maps.searchNear(lat, lon, args.data.composite_address);
}

function readBlogPost(args) {
	// console.log('*** readBlogPost ***' + JSON.stringify(args.data.url));
	InterApp.launchUri(args.data.url);
}

module.exports = {
	// Data
	MAX_RESULTS,
	PRESET_PARAMS,
	BIZ_SEARCH_URL,

	// Methods
	log: log,
	callPhoneNumber: callPhoneNumber,
	goToIG: goToIG,
	shareViaSms: shareViaSms,
	getDirections: getDirections,
	readBlogPost: readBlogPost,
};