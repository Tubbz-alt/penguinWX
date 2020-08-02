const db = require('./database').db;
const https = require('https');

const logger = require('./logger');

/**
 * Updates the TLE database from the network
 */
module.exports.updateTLEs = () =>
	new Promise((resolve, reject) => {
		https
			.get('https://www.celestrak.com/NORAD/elements/weather.txt', res => {
				let data = '';

				res.on('data', chunk => {
					data += chunk;
				});

				res.on('end', () => {
					const lines = data
						.replace(/\r/g, '')
						.split('\n')
						.filter(l => l);
					let items = [];
					for (let i = 0; i < lines.length; i = i + 3) {
						items.push({
							satellite: lines[i].padEnd(69, ' '),
							line_1: lines[i + 1],
							line_2: lines[i + 2],
						});
					}

					const sqlVals = items.map(item => [item.satellite, item.line_1, item.line_2]).flat();
					const sqlPlaceholders = items.map(() => '(?,?,?)').join(',');

					db.run(
						`\
				INSERT or REPLACE INTO tle (satellite, line_1, line_2)\
				VALUES ${sqlPlaceholders}\
			`,
						sqlVals,
						e => {
							if (e) {
								logger.error('TLE', 'Error INSERTing tle into `tle` table: ', e);
								reject(e);
							} else {
								resolve();
							}
						}
					);
				});
			})
			.on('error', e => {
				logger.error('TLE', 'Error getting TLE data: ', e);
				reject(e);
			});
	});

/**
 * Gets an array of all stored TLEs
 */
module.exports.getTLEs = () =>
	new Promise((resolve, reject) => {
		db.all(`SELECT * FROM tle`, (e, rows) => {
			if (e) {
				logger.error('TLE', 'Error SELECTing from `tle` table: ', e);
				reject(e);
			} else {
				resolve(rows);
			}
		});
	});

/**
 * Get the TLE of a specific satellite
 * @param {string} satellite satellite name (TLE format)
 * @returns {Promise<{satellite: string, line_1: string, line_2: string}>}
 */
module.exports.getTLE = satellite =>
	new Promise((resolve, reject) => {
		db.get(`SELECT * FROM tle WHERE satellite = ?`, satellite.padEnd(69, ' '), (e, row) => {
			if (e) {
				logger.error('TLE', 'Error SELECTing from `tle` table: ', e);
				reject(e);
			} else {
				resolve(row);
			}
		});
	});
