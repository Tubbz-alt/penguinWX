require('colors');
const datePrefix = () => '[' + new Date().toLocaleString().bold + '] ';

/**
 * Log to console
 * @param {string} origin origin name
 * @param {string} message message text
 */
module.exports.log = (origin, message, extra) => {
	if (extra) {
		console.log(datePrefix() + (origin ? origin.blue + ': ' : '') + message, extra);
	} else {
		console.log(datePrefix() + (origin ? origin.blue + ': ' : '') + message);
	}
};

/**
 * Warn to console
 * @param {string} origin origin name
 * @param {string} message message text
 */
module.exports.warn = (origin, message, extra) => {
	if (extra) {
		console.warn(datePrefix() + (origin ? origin.yellow + ': ' : '') + message, extra);
	} else {
		console.warn(datePrefix() + (origin ? origin.yellow + ': ' : '') + message);
	}
};

/**
 * Error to console
 * @param {string} origin origin name
 * @param {string} message message text
 */
module.exports.error = (origin, message, extra) => {
	if (extra) {
		console.error(datePrefix() + (origin ? origin.red + ': ' : '') + message, extra);
	} else {
		console.error(datePrefix() + (origin ? origin.red + ': ' : '') + message);
	}
};
