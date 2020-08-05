const express = require('express');
const apiRoutes = require('./src/api');

const logger = require('./src/utils/logger');
require('colors');

// port to listen on
const port = 8080;

// initialize the db if it's not ready yet
require('./src/utils/database');

const satellites = require('./src/utils/satellites');
satellites.getSatellite('NOAA 18').then(sat => {
	if (sat === null) satellites.updateSatellite('NOAA 18', 137912500, 55000, 40, 'noaa', 19);
}, e => {
	logger.error('Main', 'Error checking for satellite ' + 'NOAA 18'.green, e);
});
satellites.getSatellite('NOAA 15').then(sat => {
	if (sat === null) satellites.updateSatellite('NOAA 15', 137620000, 55000, 40, 'noaa', 19);
}, e => {
	logger.error('Main', 'Error checking for satellite ' + 'NOAA 15'.green, e);
});
satellites.getSatellite('NOAA 19').then(sat => {
	if (sat === null) satellites.updateSatellite('NOAA 19', 137100000, 55000, 40, 'noaa', 19);
}, e => {
	logger.error('Main', 'Error checking for satellite ' + 'NOAA 19'.green, e);
});
satellites.getSatellite('METEOR-M 2').then(sat => {
	if (sat === null) satellites.updateSatellite('METEOR-M 2', 137100000, 150000, 50, 'meteor', 19);
}, e => {
	logger.error('Main', 'Error checking for satellite ' + 'METEOR-M 2'.green, e);
});

// start up the express server
const app = express();
// JSON parsing and compression middlewares
app.use(express.json());
app.use(require('compression')());
// api route handlers
app.use('/api', apiRoutes);
app.use('/', express.static('../frontend/build'));
// start listening
app.listen(port, () => logger.log('Main', 'Listening on ' + `http://localhost:${port}`.green));

require('./src/utils/tle')
	.updateTLEs()
	.then(
		() => {
			logger.log('TLE', 'Updated TLE database');
			require('./src/loop').startLoops();
		},
		e => {
			logger.error('TLE', 'Error updating TLEs: ', e);
			require('./src/loop').startLoops();
		}
	);
