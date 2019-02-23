'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let criteriaControleler = require('../controllers/criteria');

function denyAccessUnlessGranted() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.get('', denyAccessUnlessGranted(), criteriaControleler.findAll);
router.get('/:criteriaId', denyAccessUnlessGranted(), criteriaControleler.findOne);
router.put('/:criteriaId', denyAccessUnlessGranted(), criteriaControleler.update);
router.delete('/:criteriaId', denyAccessUnlessGranted(), criteriaControleler.delete);

module.exports = router;