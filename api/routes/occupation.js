'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');
let crudController = require('../controllers/crud');
let occupationController = require('../controllers/occupation');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', checkAuthToken(), crudController.create);
router.get('', checkAuthToken(), crudController.findAll);
router.get('/:entityId', checkAuthToken(), crudController.findOne);
router.put('/:entityId', checkAuthToken(), crudController.update);
router.delete('/:entityId', checkAuthToken(), crudController.delete);
router.post('/bulk', checkAuthToken(), occupationController.bulkInsert);

module.exports = router;