const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const logger = require('../utils/logger');
const scheduler = require('../utils/scheduler');

const loop = require('../loop');
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

router.put('/action', authMiddleware.isAuthed, (req, res) => {
	const { action } = req.body;
	switch (action) {
		case 'delete_scheduled':
			passes.deleteScheduledPasses().then(
				deletedPasses => {
					for (let i = 0; i <= deletedPasses.length; i++) {
						if (i < deletedPasses.length) {
							scheduler.cancel(deletedPasses[i]);
						}
					}
					res.status(202).json(deletedPasses);
				},
				e => {
					logger.error('/api/passes/action', 'Error deleting scheduled passes: ', e);
					res.status(500).send('Error deleting scheduled passes');
				}
			);
			break;
		case 'schedule_new':
			loop.generatePasses();
			res.status(202).send();
			break;
		default:
			res.status(200).send();
	}
});

module.exports = router;
