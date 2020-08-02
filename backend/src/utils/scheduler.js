let references = {};

/**
 * Run a callback at a given date
 * @param {Date} date date to run at
 * @param {function} callback callback to run
 * @param {string} reference a reference to the timer
 * @returns {string} a reference to the timer
 */
module.exports.scheduleCallback = (date, endDate, callback, reference) => {
	const now = new Date();

	if (!reference) {
		reference = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	let interval = date - now;
	if (interval > 500) {
		interval = interval / 2;
	}

	references[reference] = setTimeout(
		() => {
			if (new Date() > date && (endDate ? new Date() < endDate : true)) {
				this.cancel(references[reference]);
				callback();
			} else {
				this.scheduleCallback(date, endDate ? endDate : null, callback, reference);
			}
		},
		date < now ? 0 : interval
	);
	return reference;
};

/**
 * Run a callback on a given interval
 * @param {number} interval interval in ms
 * @param {function} callback callback to run
 * @param {string} reference a reference to the timer
 * @returns {string} a reference to the timer
 */
module.exports.scheduleInterval = (interval, callback, reference, runInitially) => {
	if (runInitially) {
		callback();
	}

	if (!reference)
		reference = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

	this.scheduleCallback(
		new Date(new Date().getTime() + interval),
		null,
		() => {
			callback();
			this.scheduleInterval(interval, callback, reference, false);
		},
		reference
	);

	return reference;
};

/**
 * Cancel a scheduled callback
 * @param {string} reference the reference to cancel
 */
module.exports.cancel = reference => {
	clearTimeout(references[reference]);
	delete references[reference];
};

module.exports.exists = reference => {
	return Boolean(references[reference]);
};
