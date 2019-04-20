'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let candidateController = require('../controllers/candidate');
let criteriaController = require('../controllers/criteria');
const permission = require('../middlewares/permission');
let crudController = require('../controllers/crud');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', checkAuthToken(), candidateController.create);
router.get('', checkAuthToken(), crudController.findAll);
router.get('/:entityId', checkAuthToken(), crudController.findOne);
router.put('/:entityId', checkAuthToken(), crudController.update);
router.delete('/:entityId', checkAuthToken(), crudController.delete);
router.get('/:candidateId/criteria', checkAuthToken(), candidateController.findCriteriaForCandidate);
router.post('/:candidateId/criteria', checkAuthToken(), criteriaController.createCriteriaForCandidate);
router.post('/filter', checkAuthToken(), permission.permit('admin', 'superAdmin', 'callCenter'), candidateController.filterCandidates);

module.exports = router;