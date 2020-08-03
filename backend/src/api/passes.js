const express = require('express');
const router = express.Router();

const logger = require('../utils/logger');

const passes = require('../utils/passes');

router.get('/', (req, res) => {
	passes.getPasses().then(
		rows => {
			res.status(200).json(rows);
		},
		e => {
			logger.error('/api/passes', 'Error getting all passes: ', e);
			res.status(500).send('Error getting all passes');
		}
	);
});

module.exports = router;
