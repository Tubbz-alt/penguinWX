const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const salthash = require('./utils/salthash');

const dbPath = './db.sqlite';
const db = new sqlite3.Database(dbPath, e => {
	if (e) {
		console.error('ERROR opening database at ' + dbPath + ': ', e);
		throw e;
	} else {
		console.log('Opened database at ' + dbPath);
	}
});

// initialize the database
db.serialize(() => {
	db.run("\
		CREATE TABLE IF NOT EXISTS passes (\
			satellite TEXT NOT NULL,\
			start_date DATETIME NOT NULL,\
			duration INT NOT NULL,\
			end_date DATETIME NOT NULL,\
			frequency INT NOT NULL,\
			sample_rate INT NOT NULL,\
			gain INT NOT NULL\
		)\
	", e => {
		if (e) {
			console.error('ERROR creating `passes` table: ', e);
			throw e;
		}
	});
	db.run("\
		CREATE TABLE IF NOT EXISTS auth (\
			salt TEXT NOT NULL,\
			hash TEXT NOT NULL\
		)\
	", e => {
		if (e) {
			console.error('ERROR creating `auth` table: ', e);
			throw e;
		}
	});
});

/**
 * Salt and hash a password and store it in the database
 * @param {string} password the password to salt and hash
 */
module.exports.setAuth = (password) => new Promise((resolve, reject) => {
	const { salt, hash } = salthash.generateSaltHash(password);

	db.run("\
		INSERT or REPLACE INTO auth (rowid, salt, hash)\
		VALUES (1, $salt, $hash)\
	", {
		$salt: salt,
		$hash: hash,
	}, e => {
		if (e) {
			console.error('ERROR INSERTing auth salt/hash in `auth` table: ', e);
			reject(e);
		} else {
			jwt.sign('valid', salt, {}, (err, token) => {
				resolve({
					salt: salt,
					hash: hash,
					token: token,
				});
			});
		}
	});
});
/**
 * Get the stored salt and hash from the database
 */
module.exports.getAuth = () => new Promise((resolve, reject) => {
	db.get("SELECT * FROM auth WHERE rowid = 1", (e, row) => {
		if (e) {
			console.error('ERROR getting auth data row: ', e);
			reject(e);
		} else {
			if (row) {
				jwt.sign('valid', row.salt, {}, (err, token) => {
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

/**
 * Add a satellite pass to the pass table in the database
 */
module.exports.addPass = ({ satellite, duration, startDate, endDate, frequency, sampleRate, gain }) => {
	db.run("\
		INSERT INTO passes\
		(satellite, start_date, duration, end_date, frequency, sample_rate, gain)\
		VALUES\
		($satellite, $startDate, $duration, $endDate, $frequency, $sampleRate, $gain)\
	", {
		$satellite: satellite,
		$duration: duration,
		$startDate: startDate,
		$endDate: endDate,
		$frequency: frequency,
		$sampleRate: sampleRate,
		$gain: gain,
	}, e => {
		if (e) {
			console.error('ERROR INSERTing into `passes` table: ', e);
		}
	});
}

module.exports.db = db;