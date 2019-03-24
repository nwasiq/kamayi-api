'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let vacancyController = require('../controllers/vacancy');
let crudController = require('../controllers/crud');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.get('', checkAuthToken(), crudController.findAll);
router.get('/:entityId', checkAuthToken(), crudController.findOne);
router.put('/:entityId', checkAuthToken(), crudController.update);
router.delete('/:entityId', checkAuthToken(), crudController.delete);
router.get('/:vacancyId/tentativeshortlist', checkAuthToken(), vacancyController.createTentativeCandidateShortlist);
router.post('/:vacancyId/shortlist', checkAuthToken(), vacancyController.createCandidateShortlist);
router.get('/:vacancyId/shortlist', checkAuthToken(), vacancyController.findVacancyShortlist);
router.post('/:vacancyId/shortlist/:candidateId', checkAuthToken(), vacancyController.updateStatusForCandidateInAVacancy);

module.exports = router;