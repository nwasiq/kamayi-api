'use strict';

const express = require('express');
const router = express.Router({});

const permission = require('../middlewares/permission');
const passport = require('passport');

let userController = require('../controllers/user');
let crudController = require('../controllers/crud');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', checkAuthToken(), permission.permit('admin', 'superAdmin'), permission.authenticateUserCreate(), crudController.create);
router.get('', checkAuthToken(), crudController.findAll);
router.get('/:entityId', checkAuthToken(), crudController.findOne);
router.put('/:entityId', checkAuthToken(), permission.permit('admin', 'superAdmin'), permission.authenticateUserUpdate(), crudController.update);
router.delete('/:entityId', checkAuthToken(), permission.permit('admin', 'superAdmin'), crudController.delete);
router.get('/:placementId/employers', checkAuthToken(), permission.permit('admin', 'superAdmin', 'placement'), userController.getEmployersAssignedForPlacementOfficer);
router.get('/:placementId/vacancies', checkAuthToken(), permission.permit('admin', 'superAdmin', 'placement'), userController.getOpenVacanciesForPlacementOfficer);
router.post('/login', userController.login);

module.exports = router;