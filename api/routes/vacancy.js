'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let vacancyController = require('../controllers/vacancy');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.get('', checkAuthToken(), vacancyController.findAll);
router.get('/:vacancyId', checkAuthToken(), vacancyController.findOne);
router.put('/:vacancyId', checkAuthToken(), vacancyController.update);
router.delete('/:vacancyId', checkAuthToken(), vacancyController.delete);
router.get('/:vacancyId/tentativeshortlist', checkAuthToken(), vacancyController.createTentativeCandidateShortlist);
router.post('/:vacancyId/shortlist', checkAuthToken(), vacancyController.createCandidateShortlist);
router.get('/:vacancyId/shortlist', checkAuthToken(), vacancyController.findVacancyShortlist);
router.post('/:vacancyId/shortlist/:candidateId', checkAuthToken(), vacancyController.updateStatusForCandidateInAVacancy);

module.exports = router;