const sqlite3 = require('sqlite3').verbose();
const logger = require('./logger');
require('colors');

const dbPath = './db.sqlite';
const db = new sqlite3.Database(dbPath, e => {
	if (e) {
		logger.error('Database', 'Error opening database at ' + dbPath + ': ', e);
		throw e;
	} else {
		logger.log('Database', 'Opened database at ' + dbPath.green);
	}
});

// initialize the database
db.serialize(() => {
	db.run(
		'CREATE TABLE IF NOT EXISTS tle (\
			satellite TEXT PRIMARY KEY,\
			line_1 TEXT NOT NULL,\
			line_2 TEXT NOT NULL\
		)',
		e => {
			if (e) {
				logger.error('Database', 'Error creating `tle` table: ', e);
				throw e;
			}
		}
	);
	// ground station
	db.run(
		'CREATE TABLE IF NOT EXISTS ground (\
			longitude FLOAT NOT NULL,\
			latitude FLOAT NOT NULL,\
			elevation FLOAT NOT NULL\
		)',
		e => {
			if (e) {
				logger.error('Database', 'Error creating `ground` table: ', e);
				throw e;
			}
		}
	);
	// satellites table
	// stores satellite data
	// frequency, bandwidth, etc
	db.run(
		'CREATE TABLE IF NOT EXISTS satellites (\
			satellite TEXT NOT NULL PRIMARY KEY,\
			frequency INT NOT NULL,\
			sample_rate INT NOT NULL,\
			gain INT NOT NULL,\
			decode_method TEXT NOT NULL,\
			min_elevation FLOAT\
		)',
		e => {
			if (e) {
				logger.error('Database', 'Error creating `satellites` table: ', e);
				throw e;
			}
		}
	);
	// pass table
	// data about individual satellite passes and recoridng info
	db.run(
		'CREATE TABLE IF NOT EXISTS passes (\
			pass_id TEXT NOT NULL PRIMARY KEY,\
			satellite TEXT NOT NULL,\
			start DATETIME NOT NULL,\
			duration FLOAT NOT NULL,\
			end DATETIME NOT NULL,\
			max_elevation FLOAT,\
			size FLOAT,\
			status TEXT\
		)',
		e => {
			if (e) {
				logger.error('Database', 'Error creating `passes` table: ', e);
				throw e;
			}
		}
	);
	// auth table
	// holds salt and hash
	// only ever has one row
	db.run('CREATE TABLE IF NOT EXISTS auth (\
			salt TEXT NOT NULL,\
			hash TEXT NOT NULL\
		)', e => {
		if (e) {
			logger.error('Database', 'Error creating `auth` table: ', e);
			throw e;
		}
	});
});

module.exports.db = db;
