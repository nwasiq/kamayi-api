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
router.get('/:vacancyId/tentativeshortlist', denyAccessUnlessGranted(), vacancyController.createTentativeCandidateShortlist);
router.post('/:vacancyId/shortlist', denyAccessUnlessGranted(), vacancyController.createCandidateShortlist);
router.get('/:vacancyId/shortlist', denyAccessUnlessGranted(), vacancyController.findVacancyShortlist);
router.post('/:vacancyId/shortlist/:candidateId', denyAccessUnlessGranted(), vacancyController.updateStatusForCandidateInAVacancy);

module.exports = router;