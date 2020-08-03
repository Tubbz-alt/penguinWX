const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).send('PenguinWX API is running!');
});

router.use('/session', require('./session'));
router.use('/password', require('./password'));

router.use('/ground', require('./ground'));

router.use('/passes', require('./passes'));
router.use('/satellites', require('./satellites'));
router.use('/satellite', require('./satellite'));

module.exports = router;
