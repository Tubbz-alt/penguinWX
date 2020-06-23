const jwt = require('jsonwebtoken');
const authUtils = require('../utils/auth');

module.exports.isAuthed = (req, res, next) => {
	// read the given token from headers
	const authJwt = req.header('auth-jwt');

	// get our salt and hash from the database
	authUtils.getAuth().then(auth => {
		// if no salt/hash is defined
		if (!auth) {
			// automatically allow
			next();
		// else if an auth token was given in headers
		} else if (authJwt) {
			try {
				// try decoding the token
				const decoded = jwt.verify(authJwt, auth.salt);
				if (decoded) {
					next();
				} else {
					// else error
					res.status(401).send('UNAUTHORIZED: Invalid token contents!');
				}
			} catch {
				// catch decoding failures
				res.status(401).send('UNAUTHORIZED: Can\'t verify token!');
			}
		} else {
			// else fail if no token is given
			res.status(401).send('UNAUTHORIZED: No authentication token!');
		}
	}, e => {
		// handle read errors
		console.error('ERROR getting auth from db: ', e);
	});	
}