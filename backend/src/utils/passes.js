const db = require('./database').db;
const logger = require('./logger');
const tle = require('./tle');
const jspredict = require('jspredict');

module.exports.updatePass = passData =>
	new Promise((resolve, reject) => {
		const { pass_id, satellite, duration, start, end, max_elevation, size, status } = passData;

		db.run(
			'\
		INSERT or REPLACE INTO passes\
		(pass_id, satellite, start, duration, end, max_elevation, size, status)\
		VALUES\
		($pass_id, $satellite, $start, $duration, $end, $max_elevation, $size, $status)\
	',
			{
				$pass_id: pass_id,
				$satellite: satellite,
				$duration: Math.round(duration),
				$start: start,
				$end: end,
				$max_elevation: max_elevation,
				$size: size ? size : 0,
				$status: status ? status : 'scheduled',
			},
			e => {
				if (e) {
					logger.error('Passes', 'Error INSERTing into `passes` table: ', e);
					reject(e);
				} else {
					resolve();
				}
			}
		);
	});

/**
 * Get an array of passes
 * @param {string} satellite satellite to get passes of (optional)
 * @returns {Promise<{
 * pass_id: string,
 * satellite: string,
 * start: Date,
 * duration: number,
 * end: Date,
 * max_elevation: number,
 * size: number,
 * status: string
 * }[]>}
 */
module.exports.getPasses = (satellite) =>
	new Promise((resolve, reject) => {
		let statement;
		if (satellite) {
			statement = 'SELECT * FROM passes WHERE satellite = ?';
		} else {
			statement = 'SELECT * FROM passes';
		}
		db.all(statement, satellite ? satellite : undefined, (e, rows) => {
			if (e) {
				logger.error('Passes', 'Error SELECTing from `passes` table: ', e);
				reject(e);
			} else {
				resolve(
					rows
						.map(row => ({ ...row, start: new Date(row.start), end: new Date(row.end) }))
						.sort((a, b) => a.start - b.start)
				);
			}
		});
	});

module.exports.updateStatus = (passId, status, size) =>
	new Promise((resolve, reject) => {
		db.run(
			'\
		UPDATE passes\
		SET\
		size = $size, status = $status\
		WHERE\
		pass_id = $pass_id\
	',
			{
				$pass_id: passId,
				$size: size,
				$status: status,
			},
			e => {
				if (e) {
					logger.error('Passes', 'Error REPLACEing into `passes` table: ', e);
					reject(e);
				} else {
					resolve();
				}
			}
		);
	});

module.exports.isNorthbound = (satellite, start, end) =>
	new Promise((resolve, reject) => {
		tle.getTLE(satellite).then(
			satTLE => {
				const concatTLE = satTLE.satellite + '\n' + satTLE.line_1 + '\n' + satTLE.line_2;

				const startPos = jspredict.observe(concatTLE, null, start);
				const endPos = jspredict.observe(concatTLE, null, end);

				if (startPos.latitude < endPos.latitude) {
					resolve(true);
				} else {
					resolve(false);
				}
			},
			e => {
				logger.error('Passes', 'Error getting TLE for ' + satellite);
				reject(e);
			}
		);
	});

/**
 * Create a pass schedule from an array of transits
 * @param {[]} transits the transits to sort
 */
module.exports.transitsToSchedule = transits => {
	let allPasses = transits.sort((a, b) => a.start - b.start);
	let toRemove = [];

	allPasses.forEach((pass, index, array) => {
		// if last pass
		if (index === allPasses.length - 1) {
			return;
		}
		// if pass is to be removed
		if (toRemove.includes(pass)) {
			return;
		}

		// if next pass starts within 30 seconds of the end of this pass
		if (array[index + 1].start - pass.end < 30000) {
			// if next pass starts before 50% of this pass
			if (array[index + 1].start < pass.start + pass.duration * 0.5) {
				logger.warn('Passes Scheduler', '50% overlap detected!', [array[index], array[index + 1]]);
				if (pass.maxElevation > array[index + 1].maxElevation) {
					logger.warn('Passes Scheduler', 'Flagging pass 2\n');
					toRemove.push(array[index + 1]);
				} else {
					logger.warn('Passes Scheduler', 'Flagging pass 1\n');
					toRemove.push(pass);
				}
				// else if less than 50% overlap
			} else {
				// get the amount of overlap time between the two passes in ms
				const overlap = pass.end - array[index + 1].start;
				logger.warn(
					'Passes Scheduler',
					'Insufficient gap detected! Correcting for ' +
						(Math.round(overlap + 30000) / 1000).toString() +
						's overlap'
				);

				// half of the overlap plus half of a buffer time (30 seconds) we require
				// so that there's enough time to disconnect from the radio before the next recording starts
				const difference = Math.round(overlap / 2) + 15000;

				// shift pass 1 end back by difference
				allPasses[index].end = new Date(pass.end.getTime() - difference);
				allPasses[index].duration = pass.duration - difference;
				// shift pass 2 start forward by difference
				allPasses[index + 1].start = new Date(allPasses[index + 1].start.getTime() + difference);
				allPasses[index + 1].duration = allPasses[index + 1].duration - difference;
			}
		}
	});

	return allPasses;
};
