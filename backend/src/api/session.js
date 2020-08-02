const express = require('express');
const router = express.Router();

const logger = require('../utils/logger');

const authUtils = require('../utils/auth');

router.post('/', (req, res) => {
	if (req.body) {
		if (req.body.password && typeof req.body.password === 'string') {
			if (req.body.password !== '') {
				authUtils.getAuth().then(
					auth => {
						const valid = authUtils.verifyPassword(req.body.password, auth.salt, auth.hash);
						if (valid) {
							res.status(200).send(auth.token);
						} else {
							res.status(401).send('Invalid password!');
						}
					},
					e => {
						logger.error('/api/session', 'Error getting stored authentication: ', e);
						res.status(500).send('Error getting stored authentication!');
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
