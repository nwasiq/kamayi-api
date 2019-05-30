'use strict';

const express = require('express');
const router = express.Router({});

const permission = require('../middlewares/permission');
const passport = require('passport');

let userController = require('../controllers/user');
let crudController = require('../controllers/crud');
let reportController = require('../controllers/report');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', checkAuthToken(), permission.permit('admin', 'superAdmin'), permission.authenticateUserCreate(), crudController.create);
router.get('', checkAuthToken(), crudController.findAll);
router.get('/dashboard', checkAuthToken(), permission.permit('superAdmin', 'admin', 'placement'), userController.getDashboardFields);
router.get('/:userId/dashboard', checkAuthToken(), permission.permit('admin', 'superAdmin'), userController.getDashboardFieldsById);
router.get('/:entityId', checkAuthToken(), crudController.findOne);
router.put('/:entityId', checkAuthToken(), permission.permit('admin', 'superAdmin'), permission.authenticateUserUpdate(), crudController.update);
router.delete('/:entityId', checkAuthToken(), permission.permit('admin', 'superAdmin'), crudController.delete);
router.get('/role/:role', checkAuthToken(), permission.permit('admin', 'superAdmin'), userController.getUsersByRole);
router.get('/placementusers/:placementId/employers', checkAuthToken(), permission.permit('admin', 'superAdmin', 'placement'), userController.getEmployersAssignedForPlacementOfficer);
router.get('/placementusers/:placementId/vacancies', checkAuthToken(), permission.permit('admin', 'superAdmin', 'placement'), userController.getOpenVacanciesForPlacementOfficer);
router.post('/login', userController.login);
router.post('/report/callcenter/signups', checkAuthToken(), permission.permit('admin', 'superAdmin'), reportController.getCCReportByDate);
router.post('/report/callcenter/callstatus', checkAuthToken(), permission.permit('admin', 'superAdmin'), reportController.getCCReportByDate);

module.exports = router;