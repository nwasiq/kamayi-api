'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let userController = require('../controllers/user');

function denyAccessUnlessGranted() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', denyAccessUnlessGranted(), userController.create);
router.get('', denyAccessUnlessGranted(), userController.findAll);
router.get('/:userId', denyAccessUnlessGranted(), userController.findOne);
router.put('/:userId', denyAccessUnlessGranted(), userController.update);
router.delete('/:userId', denyAccessUnlessGranted(), userController.delete);
router.post('/login', userController.login);

module.exports = router;