'use strict';

const express = require('express');
const router = express.Router({});

const permit = require('../middlewares/permission');
const passport = require('passport');

let userController = require('../controllers/user');
let crudController = require('../controllers/crud');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', checkAuthToken(), permit('admin', 'superAdmin'), userController.create);
router.get('', checkAuthToken(), crudController.findAll);
router.get('/:userId', checkAuthToken(), crudController.findOne);
router.put('/:userId', checkAuthToken(), permit('admin', 'superAdmin'), userController.update);
router.delete('/:userId', checkAuthToken(), permit('admin', 'superAdmin'), crudController.delete);
router.post('/login', userController.login);

module.exports = router;