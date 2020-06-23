const express = require('express');
const router = express.Router();

const authUtils = require('../../utils/auth');
const authMiddleware = require('../../middleware/auth');

router.post('/', authMiddleware.isAuthed, (req, res) => {
	if (req.body) {
		if (req.body.password && typeof req.body.password === 'string') {
			authUtils.setAuth(req.body.password).then(({ token }) => {
				res.status(200).send(token);
			}, e => {
				console.error('ERROR storing new authentication: ', e);
				res.status(500).send('ERROR storing new authentication!');
			});
		} else {
			res.status(400).send('Expected POST body `password` field to be a string!');
		}
	} else {
		res.status(400).send('Expected POST body!');
	}
});

module.exports = router;