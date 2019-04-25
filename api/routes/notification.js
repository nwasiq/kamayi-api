'use strict';

const express = require('express');
const router = express.Router({});

const passport = require('passport');

let notiController = require('../controllers/notification');
let crudController = require('../controllers/crud');

function checkAuthToken() {
    return passport.authenticate('jwt', {
        failureRedirect: '/authfailurejson',
        session: false
    });
}

router.get('', checkAuthToken(), crudController.findAll);
router.get('/admin', checkAuthToken(), notiController.getNotificationsForAdmin);
router.get('/placement/:userId', checkAuthToken(), notiController.getNotificationsForPlacement);
router.put('', checkAuthToken(), notiController.updateReadStatus);

module.exports = router;