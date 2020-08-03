const express = require('express');
const apiRoutes = require('./src/api');

const logger = require('./src/utils/logger');
require('colors');

// port to listen on
const port = 8080;

// initialize the db if it's not ready yet
require('./src/utils/database');

require('./src/utils/ground.js').setGround(0,0,0);
require('./src/utils/satellites').updateSatellite('NOAA 18', 137912500, 55000, 40, 'noaa', 19);
require('./src/utils/satellites').updateSatellite('NOAA 15', 137620000, 55000, 40, 'noaa', 19);
require('./src/utils/satellites').updateSatellite('NOAA 19', 137100000, 55000, 40, 'noaa', 19);
require('./src/utils/satellites').updateSatellite('METEOR-M 2', 137100000, 150000, 50, 'meteor', 19);

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
			require('./src/loop')();
		},
		e => {
			logger.error('TLE', 'Error updating TLEs: ', e);
			require('./src/loop')();
		}
	);
