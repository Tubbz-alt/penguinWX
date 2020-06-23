const express = require('express');
const router = express.Router();

const authUtils = require('../../utils/auth');

router.use('/setpassword', require('./setpassword'));

router.post('/', (req, res) => {
	if (req.body) {
		if (req.body.password && typeof req.body.password === 'string') {
			authUtils.getAuth().then(auth => {
				authUtils.verifyPassword(req.body.password, auth.salt, auth.hash).then(valid => {
					if (valid) {
						res.status(200).send(auth.token);
					} else {
						res.status(401).send('Invalid password!');
					}
				});
			}, e => {
				console.error('ERROR getting stored authentication: ', e);
				res.status(500).send('ERROR getting stored authentication!');
			});
		} else {
			res.status(400).send('Expected POST body `password` field to be a string!');
		}
	} else {
		res.status(400).send('Expected POST body!');
	}
});

module.exports = router;