/**
 * Fuse + Custom JS modules
 */
var Observable = require("FuseJS/Observable");
var Common = require("./Common.js");
var User = require("./User.js");

var blogLoading = Observable(true);

// `blogPosts` get pulled in from Medium blog
var blogPosts = Observable();

function setItemList(new_items) {
	blogPosts.replaceAll(new_items); 
	// Hide blog "loading" modal
	blogLoading.value = false;
}

/**
 * Ajax call to data source
 * @param {string} endpoint (eg: search, cities, etc)
 * @param {string} requestUrl GET url params to be appended
 * @return {Promise} 
 */
function fetchData(endpoint, urlParams) {
	var requestUrl = 
		'https://api.findsomecoffee.com/blog/';
	if (typeof urlParams !== 'undefined') {
		requestUrl += `?${urlParams}`;
	}
	// console.log(" >>> BLOG API URL :: " + requestUrl);
	// 
	return fetch(requestUrl)
		.then(function(response) { 
			return response.json();
		})
		.then(function(response) {
			if (typeof response === 'object') {
				var items = response;
				//Common.log(items);

				setItemList(items);
				// return items;
			} else {
				return {};
			}
	});
} // End fetchData

module.exports = {
	// Data
	blogPosts: blogPosts,
	blogLoading: blogLoading,

	// Methods
	setItemList: setItemList, 
	fetchData: fetchData,
};