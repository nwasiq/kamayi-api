'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let vacancyController = require('../controllers/vacancy');

function denyAccessUnlessGranted() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.get('', denyAccessUnlessGranted(), vacancyController.findAll);
router.get('/:vacancyId', denyAccessUnlessGranted(), vacancyController.findOne);
router.put('/:vacancyId', denyAccessUnlessGranted(), vacancyController.update);
router.delete('/:vacancyId', denyAccessUnlessGranted(), vacancyController.delete);
router.get('/:vacancyId/shortlist', denyAccessUnlessGranted(), vacancyController.createCandidateShortlist);

module.exports = router;