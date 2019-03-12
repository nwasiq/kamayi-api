'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let candidateController = require('../controllers/candidate');
let criteriaController = require('../controllers/criteria');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', checkAuthToken(), candidateController.create);
router.get('', checkAuthToken(), candidateController.findAll);
router.get('/:candidateId', checkAuthToken(), candidateController.findOne);
router.put('/:candidateId', checkAuthToken(), candidateController.update);
router.delete('/:candidateId', checkAuthToken(), candidateController.delete);
router.get('/:candidateId/criteria', checkAuthToken(), candidateController.findCriteriaForCandidate);
router.post('/:candidateId/criteria', checkAuthToken(), criteriaController.createCriteriaForCandidate);

module.exports = router;