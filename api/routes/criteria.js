'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let criteriaController = require('../controllers/criteria');

function denyAccessUnlessGranted() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', denyAccessUnlessGranted(), criteriaController.create);
router.get('', denyAccessUnlessGranted(), criteriaController.findAll);
router.get('/:criteriaId', denyAccessUnlessGranted(), criteriaController.findOne);
router.put('/:criteriaId', denyAccessUnlessGranted(), criteriaController.update);
router.delete('/:criteriaId', denyAccessUnlessGranted(), criteriaController.delete);

module.exports = router;