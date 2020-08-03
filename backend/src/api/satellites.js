const express = require('express');
const router = express.Router();

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

module.exports = router;
