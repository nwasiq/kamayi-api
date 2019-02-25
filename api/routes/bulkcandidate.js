'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');
let bulkCandidateController = require('../controllers/bulkCandidate');

function denyAccessUnlessGranted() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', denyAccessUnlessGranted(), bulkCandidateController.importExcel);
router.get('', denyAccessUnlessGranted(), bulkCandidateController.findExcelCandidates);

module.exports = router;