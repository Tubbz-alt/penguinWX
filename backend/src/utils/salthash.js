const crypto = require('crypto');

module.exports.generateSaltHash = (password) => {
	// create a random 32 byte salt
	const salt = crypto.randomBytes(32).toString('hex');

	// create the hash of our password
	const hash = crypto.createHmac('sha512', salt)
	hash.update(password);
	const hashValue = hash.digest('hex');

	return {
		salt: salt,
		hash: hashValue
	}
}

module.exports.verifyPassword = (password, salt, hash) => new Promise(resolve => {
	const newHash = crypto.createHmac('sha512', salt)
	newHash.update(password);
	const newHashValue = newHash.digest('hex');

	resolve(newHashValue === hash);
});