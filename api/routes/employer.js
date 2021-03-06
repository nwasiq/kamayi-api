'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let vacancyController = require('../controllers/vacancy');
let crudController = require('../controllers/crud');
let employerController = require('../controllers/employer');
const permission = require('../middlewares/permission');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', checkAuthToken(), crudController.create);
router.get('', checkAuthToken(), crudController.findAll);
router.get('/unassigned', checkAuthToken(), permission.permit('admin'), employerController.getUnassignedEmployers);
router.get('/:entityId', checkAuthToken(), crudController.findOne);
router.put('/:entityId', checkAuthToken(), permission.permit('admin', 'superAdmin', 'placement', 'callCenter'), permission.authenticatePlacementOfficerUpdate(), crudController.update);
router.delete('/:entityId', checkAuthToken(), crudController.delete);
router.post('/:employerId/vacancies', checkAuthToken(), vacancyController.createVacancyForEmployer);
router.get('/:employerId/vacancies', checkAuthToken(), vacancyController.findVacanciesForEmployer);

module.exports = router;