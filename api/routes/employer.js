'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let employerController = require('../controllers/employer');

function denyAccessUnlessGranted() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', denyAccessUnlessGranted(), employerController.create);
router.get('', denyAccessUnlessGranted(), employerController.findAll);
router.get('/:employerId', denyAccessUnlessGranted(), employerController.findOne);
router.put('/:employerId', denyAccessUnlessGranted(), employerController.update);
router.delete('/:employerId', denyAccessUnlessGranted(), employerController.delete);

module.exports = router;