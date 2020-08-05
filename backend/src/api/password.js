const express = require('express');
const router = express.Router();

const logger = require('../utils/logger');

const authUtils = require('../utils/auth');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware.isAuthed, (req, res) => {
	if (req.body) {
		if (req.body.password && typeof req.body.password === 'string') {
			if (req.body.password !== '') {
				authUtils.setAuth(req.body.password).then(
					({ token }) => {
						res.status(200).json(token);
					},
					e => {
						logger.error('/api/password', 'Error storing new authentication: ', e);
						res.status(500).send('Error storing new authentication!');
					}
				);
			} else {
				res.status(400).send("POST body `password` field can't be empty!");
			}
		} else {
			res.status(400).send('Expected POST body `password` field to be a string!');
		}
	} else {
		res.status(400).send('Expected POST body!');
	}
});

module.exports = router;
