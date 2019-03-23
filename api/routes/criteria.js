'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let criteriaController = require('../controllers/criteria');
let crudController = require('../controllers/crud');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.get('', checkAuthToken(), crudController.findAll);
router.get('/:criteriaId', checkAuthToken(), crudController.findOne);
router.put('/:criteriaId', checkAuthToken(), crudController.update);
router.delete('/:criteriaId', checkAuthToken(), crudController.delete);

module.exports = router;