'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let candidateController = require('../controllers/candidate');
let criteriaController = require('../controllers/criteria');
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

module.exports = router;