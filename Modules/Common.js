/**
 * Fuse JS modules
 */

// Route telephone number click to Dial app, IG links, etc
var InterApp = require("FuseJS/InterApp");
var Maps = require("FuseJS/Maps");
var Environment = require('FuseJS/Environment');

// Determine device OS
const ENV_IOS = Environment.ios;
const ENV_ANDROID = Environment.android;

// Business search API presets
const FSC_API_URL 		= 'https://api.findsomecoffee.com/';
const JUICER_API_URL	= 'https://www.juicer.io/api/feeds/findsomecoffee';

// Business search presets
const MAX_RESULTS = 28;
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
			for (var propName in item) {
				console.log(propName + ' : ' + item[propName]);
			}
			console.log('----------------------------- ');
		});
	} else if (typeof items === 'object') {
		console.log('>-----------------------------< ');
		for (var propName in items) {
			console.log(propName + ' : ' + items[propName]);
		}
		console.log('>-----------------------------< ');

	} else {
		console.log(JSON.stringify(items));
		console.log('------------------ ');
	}
} // End log()

/**
 * Ajax call to data source
 * @param {string} apiUrl Base url to be prepended
 * @param {string} endpoint (eg: blog, biz search, instagram feed, etc)
 * @param {string} requestUrl GET url params to be appended
 * @return {Promise} 
 */
function fetchData(apiUrl, endpoint, urlParams) {
	// Append endpoint (eg: `search/`) to base URL
	let requestUrl = apiUrl + endpoint;

	// Append any extra params, if necessary
	requestUrl += (typeof urlParams !== 'undefined' && urlParams !== '') 
		? `/?${urlParams}` 
		: '';

	// console.log(" >>> fetchData() requestUrl :: " + requestUrl);
	
	return fetch(requestUrl)
		.then((response) => {
			return response.json();
		})
		.then((jsonData) => {
			if (typeof jsonData === 'object') {
				return jsonData;
			} else {
				console.log(` (x) Unable to access "${endpoint}" endpoint.`);
			}
		})
		.catch((err) => {
			console.log( 'Error : ' + err.message );
		});
} 

/**
 * On phone number click, route to telephone app
 */
function callPhoneNumber(args) {
	// console.log('*** callPhoneNumber ***' + JSON.stringify(args.data.phone));
	InterApp.launchUri("tel:" + args.data.phone);
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
	Maps.searchNear(lat, lon, args.data.composite_address);
}

function openMapAt(lat, lon) {
	// console.log('*** getDirections ***' + lat + " , " + lon);
	Maps.openAt(lat, lon);
}

function goToIG(args) {
	if (args.data.location[0] !== '' && args.data.location[1] !== '') {
		openMapAt(args.data.location[0], args.data.location[1]);
	} else {
		// console.log('*** goToIG ***' + 'instagram://media?id=' + args.data.id);
		// https://www.instagram.com/developer/mobile-sharing/iphone-hooks/
		// - media?id=MEDIA_ID
		// - user?username=USERNAME
		// - tag?name=TAG
		// - location?id=LOCATION_ID
		if (ENV_IOS) {
			//InterApp.launchUri('instagram://media?id=' + args.data.id);
			InterApp.launchUri(args.data.url);
		} else if (ENV_ANDROID) {
			InterApp.launchUri(args.data.url);
		}
	}
}

function goToFscOnIG(args) {
	if (ENV_IOS) {
		InterApp.launchUri("instagram://user?username=findsomecoffee");
	} else if (ENV_ANDROID) {
		InterApp.launchUri("https://instagram.com/findsomecoffee/");
	}
}

function readBlogPost(args) {
	// console.log('*** readBlogPost ***' + JSON.stringify(args.data.url));
	InterApp.launchUri(args.data.url);
}

function getPostDetail(args) {
	// console.log('*** getPostDetail ***' + JSON.stringify(args.data.url));
	// Must be just an instagram post
	if (args.data.url.indexOf('blog') !== -1) {
		readBlogPost(args);
	} else {
		goToIG(args);
	}
}

module.exports = {
	// Data
	MAX_RESULTS,
	PRESET_PARAMS,
	FSC_API_URL,
	JUICER_API_URL,

	ENV_IOS,
	ENV_ANDROID,
	// ENV_PREVIEW: Environment.preview,
	// ENV_MOBILE: Environment.mobile,

	// Methods
	log,
	fetchData,
	callPhoneNumber,
	goToIG,
	shareViaSms,
	getDirections,
	readBlogPost,
	getPostDetail,
};