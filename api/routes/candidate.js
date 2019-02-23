'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let candidateController = require('../controllers/candidate');
let criteriaController = require('../controllers/criteria');

function denyAccessUnlessGranted() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', denyAccessUnlessGranted(), candidateController.create);
router.get('', denyAccessUnlessGranted(), candidateController.findAll);
router.get('/:candidateId', denyAccessUnlessGranted(), candidateController.findOne);
router.put('/:candidateId', denyAccessUnlessGranted(), candidateController.update);
router.delete('/:candidateId', denyAccessUnlessGranted(), candidateController.delete);
router.get('/:candidateId/criteria', denyAccessUnlessGranted(), candidateController.findCriteriaForCandidate);
router.post('/:candidateId/criteria', denyAccessUnlessGranted(), criteriaController.createCriteriaForCandidate);

module.exports = router;