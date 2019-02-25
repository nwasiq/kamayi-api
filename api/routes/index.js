'use strict';

const express = require('express');
const router = express.Router();

router.get('/authfailurejson', function (req, res) {
    res.json({
        success: false,
        message: 'authorization failed'
    });
});

router.use('/users', require('./user'));
router.use('/employers', require('./employer'));
router.use('/candidates', require('./candidate'));
router.use('/vacancies', require('./vacancy'));
router.use('/criteria', require('./criteria'));
router.use('/bulkcandidates', require('./bulkcandidate'));

module.exports = router;