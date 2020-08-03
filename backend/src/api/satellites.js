const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const logger = require('../utils/logger');

const satellites = require('../utils/satellites');

router.get('/', (req, res) => {
	satellites.getSatellites().then(
		rows => {
			res.status(200).json(rows);
		},
		e => {
			logger.error('/api/satellites', 'Error getting all satellites: ', e);
			res.status(500).send('Error getting all satellites');
		}
	);
});

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
			logger.error('/api/satellites/:satellite', 'Error getting satellite' + req.params.satellite + ': ', e);
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
					logger.log('/api/satellites/:satellite', 'Updated satellite ' + satellite.satellite.green, satellite);
					res.status(200).json(satellite);
				},
				e => {
					logger.error(
						'/api/satellites/:satellite',
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
