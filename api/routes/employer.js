'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let employerController = require('../controllers/employer');
let vacancyController = require('../controllers/vacancy');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', checkAuthToken(), employerController.create);
router.get('', checkAuthToken(), employerController.findAll);
router.get('/:employerId', checkAuthToken(), employerController.findOne);
router.put('/:employerId', checkAuthToken(), employerController.update);
router.delete('/:employerId', checkAuthToken(), employerController.delete);
router.post('/:employerId/vacancies', checkAuthToken(), vacancyController.createVacancyForEmployer);
router.get('/:employerId/vacancies', checkAuthToken(), vacancyController.findVacanciesForEmployer);

module.exports = router;