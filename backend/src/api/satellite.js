const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const logger = require('../utils/logger');
const scheduler = require('../utils/scheduler');

const satellites = require('../utils/satellites');
const passes = require('../utils/passes');

router.get('/:satellite', (req, res) => {
	satellites.getSatellite(req.params.satellite).then(
		row => {
			if (row) {
				res.status(200).json(row);
			} else {
				res.status(404).send('Satellite ' + req.params.satellite + ' not found!');
			}
		},
		e => {
			logger.error('/api/satellite/:satellite', 'Error getting satellite' + req.params.satellite + ': ', e);
			res.status(500).send('Error getting satellite' + req.params.satellite);
		}
	);
});

router.post('/:satellite', authMiddleware.isAuthed, (req, res) => {
	const satellite = req.body;
	if (
		satellite.satellite &&
		satellite.frequency &&
		satellite.sample_rate &&
		satellite.gain &&
		satellite.decode_method &&
		satellite.min_elevation &&
		typeof satellite.enabled === 'boolean'
	) {
		satellites
			.updateSatellite(
				satellite.satellite,
				satellite.frequency,
				satellite.sample_rate,
				satellite.gain,
				satellite.decode_method,
				satellite.min_elevation,
				satellite.enabled
			)
			.then(
				() => {
					passes.getPasses(satellite.satellite).then(
						satPasses => {
							satPasses
								.filter(
									pass =>
										pass.start > new Date() &&
										(pass.status === 'scheduled' || pass.status === 'canceled')
								)
								.forEach(pass => {
									passes.updatePass({
										...pass,
										status: satellite.enabled ? 'scheduled' : 'canceled',
									}).then(() => {
										if (!satellite.enabled) {
											scheduler.cancel(pass.pass_id);
											logger.warn(
												'/api/satellite/:satellite',
												'Canceled pass ' + pass.pass_id.green
											);
										} else {
											logger.log(
												'/api/satellite/:satellite',
												'Updated pass ' + pass.pass_id.green
											);
										}
									}, e => {
										logger.error(
											'/api/satellite/:satellite',
											'Error updating pass ' + pass.pass_id.green,
											e
										);
									});
								});
						},
						e => {
							logger.error(
								'/api/satellite/:satellite',
								'Error getting passes for ' + satellite.satellite.green,
								e
							);
						}
					);
					logger.log(
						'/api/satellite/:satellite',
						'Updated satellite ' + satellite.satellite.green,
						satellite
					);
					res.status(202).json(satellite);
				},
				e => {
					logger.error(
						'/api/satellite/:satellite',
						'Error updating satellite ' + req.params.satellite.green + ': ',
						e
					);
					res.status(500).send('Error updating satellite ' + req.params.satellite);
				}
			);
	} else {
		res.status(400).send(
			'Invalid satellite object. Expected {satellite: string, frequency: number, sample_rate: number, gain: number, min_elevation: number, enabled: boolean}'
		);
	}
});

module.exports = router;
