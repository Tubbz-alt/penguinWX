const db = require('./database').db;
const tle = require('./tle');
const jspredict = require('jspredict');

const logger = require('./logger');

/**
 * Add a new satellite or update an existing satellite into the database
 * @param {string} satellite satellite name (TLE format)
 * @param {number} frequency recording frequency (Hz)
 * @param {number} samplerate recording samplerate (Hz)
 * @param {number} gain gain (dBi)
 * @param {string} method satellite type ("noaa" or "meteor")
 * @param {number} minElevation minimum elevation for passes
 * @param {boolean} enabled is the satellite enabled for passes
 */
module.exports.updateSatellite = (satellite, frequency, samplerate, gain, method, minElevation, enabled) =>
	new Promise((resolve, reject) => {
		db.run(
			'INSERT or REPLACE INTO satellites\
		(satellite, frequency, sample_rate, gain, decode_method, min_elevation, enabled)\
		VALUES\
		($satellite, $frequency, $samplerate, $gain, $method, $minelevation, $enabled)',
			{
				$satellite: satellite,
				$frequency: frequency,
				$samplerate: samplerate,
				$gain: gain,
				$method: method,
				$minelevation: minElevation,
				$enabled: typeof enabled === 'boolean' ? enabled : true
			},
			e => {
				if (e) {
					logger.error('Satellites', 'Error INSERTing into `satellites` table: ', e);
					reject(e);
				} else {
					resolve();
				}
			}
		);
	});

/**
 * Get all satellites in the database
 * @returns {Promise<{
 * satellite: string,
 * frequency: number,
 * sample_rate: number,
 * gain: number,
 * decode_method: string
 * }[]>}
 */
module.exports.getSatellites = () =>
	new Promise((resolve, reject) => {
		db.all(`SELECT * FROM satellites`, (e, rows) => {
			if (e) {
				logger.error('Satellites', 'Error SELECTing from `satellites` table: ', e);
				reject(e);
			} else {
				resolve(rows.map(row => ({ ...row, enabled: (row.enabled === 1 ? true : false) })));
			}
		});
	});

/**
 * Get a single satellite from the database
 * @param {string} satellite satellite name (TLE format)
 * @returns {Promise<{
 * satellite: string,
 * frequency: number,
 * sample_rate: number,
 * gain: number,
 * decode_method: string
 * }>} satellite object
 */
module.exports.getSatellite = satellite =>
	new Promise((resolve, reject) => {
		db.get(`SELECT * FROM satellites WHERE satellite = ?`, satellite, (e, row) => {
			if (e) {
				logger.error('Satellites', 'Error SELECTing from `satellites` table: ', e);
				reject(e);
			} else {
				if (row) {
					resolve({ ...row, enabled: (row.enabled === 1 ? true : false) });
				} else {
					resolve(null);
				}
			}
		});
	});

/**
 * Generate a set of passes at a ground position for a satellite within two set dates
 * @param {string} satellite satellite name (TLE format)
 * @param {Date} startDate pass set start date
 * @param {Date} endDate pass set end date
 * @param {number} longitude ground longitude (degrees)
 * @param {number} latitude ground latitude (degrees)
 * @param {number} elevation ground elevation (km)
 * @returns {Promise<{}[]>}
 */
module.exports.generatePasses = (satellite, minElevation, startDate, endDate, longitude, latitude, elevation) =>
	new Promise((resolve, reject) => {
		const qth = [longitude, latitude, elevation];
		tle.getTLE(satellite).then(
			satTLE => {
				if (satTLE) {
					const concatTLE = satTLE.satellite + '\n' + satTLE.line_1 + '\n' + satTLE.line_2;
					const transits = jspredict.transits(concatTLE, qth, startDate, endDate, minElevation);
					resolve(transits);
				} else {
					logger.error('Satellites', 'No TLE found for ' + satellite);
				}
			},
			e => {
				logger.error('Satellites', 'Error getting TLE for ' + satellite);
				reject(e);
			}
		);
	});
