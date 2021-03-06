'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let vacancyController = require('../controllers/vacancy');
let crudController = require('../controllers/crud');
let permission = require('../middlewares/permission');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.get('', checkAuthToken(), vacancyController.getVacanciesWithEmployerInfo);
router.get('/:entityId', checkAuthToken(), crudController.findOne);
router.put('/:entityId', checkAuthToken(), permission.permit('admin', 'placement'), permission.authenticateVacancyStatusUpdate(), crudController.update);
router.delete('/:entityId', checkAuthToken(), crudController.delete);
router.get('/:vacancyId/tentativeshortlist', checkAuthToken(), vacancyController.createTentativeCandidateShortlist);
router.post('/:vacancyId/shortlist', checkAuthToken(), vacancyController.createCandidateShortlist);
router.get('/:vacancyId/shortlist/:occupation', checkAuthToken(), vacancyController.findVacancyShortlist);
router.post('/:vacancyId/candidates', checkAuthToken(), vacancyController.updateStatusForCandidatesInAVacancy);
router.get('/status/:statusId', checkAuthToken(), permission.permit('admin'), vacancyController.getVacanciesByStatus);
router.post('/status/:status', checkAuthToken(), permission.permit('admin', 'placement'), vacancyController.updateStatusForVacancies);

module.exports = router;