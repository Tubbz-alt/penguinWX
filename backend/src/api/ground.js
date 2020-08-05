const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const logger = require('../utils/logger');

const ground = require('../utils/ground');
const passes = require('../utils/passes');

router.get('/', authMiddleware.isAuthed, (req, res) => {
	ground.getGround().then(
		groundPosition => {
			if (groundPosition) {
				res.status(200).json(groundPosition);
			} else {
				res.status(404).send('No ground position available!');
			}
		},
		e => {
			logger.error('/api/ground', 'Error getting ground position: ', e);
			res.status(500).send('Error getting ground position');
		}
	);
});

router.post('/', authMiddleware.isAuthed, (req, res) => {
	if (req.body) {
		if (req.body.longitude && typeof req.body.longitude === 'number') {
			if (req.body.latitude && typeof req.body.latitude === 'number') {
				if (req.body.elevation && typeof req.body.elevation === 'number') {
					ground.setGround(req.body.longitude, req.body.latitude, req.body.elevation).then(
						() => {
							passes.deleteScheduledPasses().then(() => {
								require('../loop').generatePasses();
							});
							res.status(200).json({
								longitude: req.body.longitude,
								latitude: req.body.latitude,
								elevation: req.body.elevation,
							});
						},
						e => {
							logger.error('/api/ground', 'Error storing new ground position: ', e);
							res.status(500).send('Error storing new ground position!');
						}
					);
				} else {
					res.status(400).send('Expected POST body `elevation` field to be a string!');
				}
			} else {
				res.status(400).send('Expected POST body `latitude` field to be a string!');
			}
		} else {
			res.status(400).send('Expected POST body `longitude` field to be a number!');
		}
	} else {
		res.status(400).send('Expected POST body!');
	}
});

module.exports = router;
