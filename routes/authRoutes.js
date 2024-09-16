const express = require('express');
const { getDefaultAccessToken, getAnotherAccessToken } = require('../controllers/authController');

const router = express.Router();

router.get('/default-token', getDefaultAccessToken);
router.get('/another-token', getAnotherAccessToken);

module.exports = router;
