'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');
let bulkCandidateController = require('../controllers/bulkCandidate');
let crudController = require('../controllers/crud');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', checkAuthToken(), bulkCandidateController.importExcel);
router.get('', checkAuthToken(), crudController.findAll);
router.get('/:entityId', checkAuthToken(), crudController.findOne);
router.put('/:entityId', checkAuthToken(), crudController.update);
router.get('/status/:statusType', checkAuthToken(), bulkCandidateController.getBulkCandiesByStatus);

module.exports = router;