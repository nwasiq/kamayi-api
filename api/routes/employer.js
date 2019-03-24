'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let employerController = require('../controllers/employer');
let vacancyController = require('../controllers/vacancy');
let crudController = require('../controllers/crud');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', checkAuthToken(), crudController.create);
router.get('', checkAuthToken(), crudController.findAll);
router.get('/:entityId', checkAuthToken(), crudController.findOne);
router.put('/:entityId', checkAuthToken(), crudController.update);
router.delete('/:entityId', checkAuthToken(), crudController.delete);
router.post('/:employerId/vacancies', checkAuthToken(), vacancyController.createVacancyForEmployer);
router.get('/:employerId/vacancies', checkAuthToken(), vacancyController.findVacanciesForEmployer);

module.exports = router;