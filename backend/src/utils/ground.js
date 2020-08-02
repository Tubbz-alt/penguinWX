const db = require('./database').db;
const logger = require('./logger');

module.exports.setGround = (longitude, latitude, elevation) =>
	new Promise((resolve, reject) => {
		db.run(
			'INSERT or REPLACE INTO ground (rowid, longitude, latitude, elevation) VALUES (1, $longitude, $latitude, $elevation)',
			{
				$longitude: longitude,
				$latitude: latitude,
				$elevation: elevation,
			},
			e => {
				if (e) {
					logger.error('Ground', 'Error INSERTing position to `ground` table: ', e);
					reject(e);
				} else {
					resolve();
				}
			}
		);
	});

	/**
	 * @returns {Promise<{
	 * longitude: number,
	 * latitude: number,
	 * elevation: number
	 * }>} ground position object
	 */
module.exports.getGround = () =>
	new Promise((resolve, reject) => {
		db.get('SELECT * FROM ground WHERE rowid = 1', (e, row) => {
			if (e) {
				logger.error('Ground', 'Error getting ground data row: ', e);
				reject(e);
			} else {
				if (row) {
					resolve(row);
				} else {
					resolve(null);
				}
			}
		});
	});
