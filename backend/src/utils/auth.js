const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('./database').db;

const logger = require('./logger');

/**
 * salts and hashes a password (string)
 * @param {string} password the password to salt and hash
 * @returns {{salt: string, hash: string}} salt and hash strings
 */
module.exports.generateSaltHash = password => {
	// create a random 32 byte salt
	const salt = crypto.randomBytes(32).toString('hex');

	// create the hash of our password
	const hash = crypto.createHmac('sha512', salt);
	hash.update(password);
	const hashValue = hash.digest('hex');

	return {
		salt: salt,
		hash: hashValue,
	};
};

/**
 * Verifies a password (string) against a salt and hash
 * @param {string} password the password to verify
 * @param {string} salt the salt to verify against
 * @param {string} hash the hash to verify against
 * @returns {Promise<boolean>} resolves true if the password is valid
 */
module.exports.verifyPassword = (password, salt, hash) => {
		const newHash = crypto.createHmac('sha512', salt);
		newHash.update(password);
		const newHashValue = newHash.digest('hex');
		return newHashValue === hash;
};

/**
 * Salt and hash a password and store it in the database,
 * then return the salt and hash and a generated JWT
 * @param {string} password the password to salt and hash
 * @returns {Promise<{salt: string, hash: string, token: string}>}
 */
module.exports.setAuth = password =>
	new Promise((resolve, reject) => {
		const { salt, hash } = module.exports.generateSaltHash(password);

		db.run(
			'INSERT or REPLACE INTO auth (rowid, salt, hash) VALUES (1, $salt, $hash)',
			{
				$salt: salt,
				$hash: hash,
			},
			e => {
				if (e) {
					logger.error('Auth', 'Error INSERTing auth salt/hash in `auth` table: ', e);
					reject(e);
				} else {
					jwt.sign('valid-' + Math.random().toString(36), salt, {}, (err, token) => {
						resolve({
							salt: salt,
							hash: hash,
							token: token,
						});
					});
				}
			}
		);
	});
/**
 * Get the stored salt and hash from the database
 * and return a generated JWT
 * @returns {Promise<{salt: string, hash: string, token: string}>}
 */
module.exports.getAuth = () =>
	new Promise((resolve, reject) => {
		db.get('SELECT * FROM auth WHERE rowid = 1', (e, row) => {
			if (e) {
				logger.error('Auth', 'Error getting auth data row: ', e);
				reject(e);
			} else {
				if (row) {
					jwt.sign('valid-' + Math.random().toString(36), row.salt, {}, (err, token) => {
						resolve({
							salt: row.salt,
							hash: row.hash,
							token: token,
						});
					});
				} else {
					resolve(null);
				}
			}
		});
	});
