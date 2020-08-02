const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).send('PenguinWX API is running!');
});

router.use('/session', require('./session'));
router.use('/password', require('./password'));
router.use('/passes', require('./passes'));

module.exports = router;
