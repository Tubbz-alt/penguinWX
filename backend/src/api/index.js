const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).send('PenguinWX API is running!');
});

router.use('/session', require('./session'));

module.exports = router;