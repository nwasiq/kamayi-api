'use strict';

const express = require('express');
const router = express.Router({});

const permit = require('../middlewares/permission');
const passport = require('passport');

let userController = require('../controllers/user');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', checkAuthToken(), permit('admin', 'superAdmin'), userController.create);
router.get('', checkAuthToken(), userController.findAll);
router.get('/:userId', checkAuthToken(), userController.findOne);
router.put('/:userId', checkAuthToken(), permit('admin', 'superAdmin'), userController.update);
router.delete('/:userId', checkAuthToken(), permit('admin', 'superAdmin'), userController.delete);
router.post('/login', userController.login);

module.exports = router;