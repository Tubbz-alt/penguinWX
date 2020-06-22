const express = require('express');
const apiRoutes = require('./src/api');

const port = 8080;

// initialize the db if it's not ready yet
const db = require('./src/database');

// express server
const app = express();
// JSON parsing middleware
app.use(express.json());
// api route handlers
app.use('/api', apiRoutes);
// start listening
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
