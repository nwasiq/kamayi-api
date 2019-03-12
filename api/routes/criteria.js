'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let criteriaController = require('../controllers/criteria');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.get('', checkAuthToken(), criteriaController.findAll);
router.get('/:criteriaId', checkAuthToken(), criteriaController.findOne);
router.put('/:criteriaId', checkAuthToken(), criteriaController.update);
router.delete('/:criteriaId', checkAuthToken(), criteriaController.delete);

module.exports = router;