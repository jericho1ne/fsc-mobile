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

module.exports = {
	log: log,
};