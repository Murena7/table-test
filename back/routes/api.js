const express = require('express');
const controller = require('../controllers/api');

const router = express.Router();

router.get('/campaigns', controller.campaigns);
router.get('/buyers', controller.buyers);
router.get('/daily', controller.daily);
router.get('/hourly', controller.hourly);

module.exports = router;
