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
router.get('/:entityId', checkAuthToken(), crudController.findOne);
router.put('/:entityId', checkAuthToken(), crudController.update);
router.delete('/:entityId', checkAuthToken(), crudController.delete);

module.exports = router;