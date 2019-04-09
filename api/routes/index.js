'use strict';

const express = require('express');
const router = express.Router();

router.get('/authfailurejson', function (req, res) {
    res.json({
        success: false,
        message: 'authorization failed: Invalid Token'
    });
});

router.use('/users', require('./user'));
router.use('/employers', require('./employer'));
router.use('/candidates', require('./candidate'));
router.use('/vacancys', require('./vacancy'));
router.use('/criterias', require('./criteria'));
router.use('/occupations', require('./occupation'));
router.use('/bulkcandidates', require('./bulkcandidate'));

module.exports = router;