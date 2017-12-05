/**
 * Fuse + Custom JS modules
 */
var Observable = require("FuseJS/Observable");
var Common = require("./Common.js");
var User = require("./User.js");

var blogLoading = Observable(true);
var feedIsLoading = Observable(true);

// `blogPosts` get pulled in from Medium blog
var blogPosts = Observable();
var feedItems = Observable();

function loadFeed() {
	Common.fetchData(Common.FSC_API_URL, 'feed', '').then((response) => {
		if (typeof response === 'object') {
			var items = response;
			setFeedItems(items);
		} else {
			console.log(" (x) Unable to access feed.");
		}
	});
}

function setItemList(new_items) {
	Common.log(new_items[0]);
	blogPosts.replaceAll(new_items);
	// Hide blog "loading" modal
	blogLoading.value = false;
}

function setFeedItems(new_items) {
	feedItems.replaceAll(new_items);
	// Hide feed "loading" modal
	feedIsLoading.value = false;
}

function reloadFeed() {
	// Handle UI stuff
	feedIsLoading.value = true;
	// Manual cutoff 
	// setTimeout(endLoading, 1750);
	loadFeed();
}

module.exports = {
	// Data
	blogPosts,
	blogLoading,
	feedItems,
	feedIsLoading,

	// Methods
	loadFeed,
	setItemList, 
	setFeedItems,
	reloadFeed,
};