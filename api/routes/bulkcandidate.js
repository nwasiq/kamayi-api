'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');
let bulkCandidateController = require('../controllers/bulkCandidate');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', checkAuthToken(), bulkCandidateController.importExcel);
router.get('', checkAuthToken(), bulkCandidateController.findExcelCandidates);

module.exports = router;