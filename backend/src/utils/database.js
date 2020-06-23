const sqlite3 = require('sqlite3').verbose();

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
		CREATE TABLE IF NOT EXISTS tle (\
			satellite TEXT PRIMARY KEY,\
			line_1 TEXT NOT NULL,\
			line_2 TEXT NOT NULL\
		)\
	", e => {
		if (e) {
			console.error('ERROR creating `tle` table: ', e);
			throw e;
		}
	});
	// satellites table
	// stores satellite data
	// frequency, bandwidth, etc
	db.run("\
		CREATE TABLE IF NOT EXISTS satellites (\
			satellite TEXT NOT NULL,\
			frequency INT NOT NULL,\
			sample_rate INT NOT NULL,\
			gain INT NOT NULL,\
			decode_method TEXT NOT NULL\
		)\
	", e => {
		if (e) {
			console.error('ERROR creating `satellites` table: ', e);
			throw e;
		}
	});
	// pass table
	// data about individual satellite passes and recoridng info
	db.run("\
		CREATE TABLE IF NOT EXISTS passes (\
			satellite TEXT NOT NULL,\
			start_date DATETIME NOT NULL,\
			duration INT NOT NULL,\
			end_date DATETIME NOT NULL,\
			status TEXT\
		)\
	", e => {
		if (e) {
			console.error('ERROR creating `passes` table: ', e);
			throw e;
		}
	});
	// auth table
	// holds salt and hash
	// only ever has one row
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