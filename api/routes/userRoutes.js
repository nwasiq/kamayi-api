'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let userController = require('../controllers/userController');

function denyAccessUnlessGranted() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.post('', userController.create);
router.get('', userController.findAll);
router.get('/:userId', userController.findOne);
router.put('/:userId', userController.update);
router.delete('/:userId', userController.delete);
router.post('/login', userController.login);

module.exports = router;