'use strict';

const express = require('express');
const router = express.Router();

router.get('/authfailurejson', function (req, res) {
    res.json({
        success: false,
        message: 'authorization failed'
    });
});

router.use('/users', require('./userRoutes'));

module.exports = router;