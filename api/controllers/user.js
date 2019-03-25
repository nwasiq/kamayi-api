'use strict';

const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');
const Employer = require('../models/Employer');
const Vacancy = require('../models/Vacancy');

exports.login = async function(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    try {
        let user = await User.findOne({email: email});
        if(!user){
            return res.status(404).send({
                message: "User not found with email " + email
            });
        }
        let isMatch = await User.comparePassword(user, password, user.password);
        if (isMatch) {
            const token = jwt.sign(user.toJSON(), config.secret, {
                expiresIn: 604800 // 1 week
            });
            res.send({
                success: true,
                token: 'Bearer ' + token,
                user
            });
        }
        else {
            res.status(401).send({
                message: "Incorrect password"
            });
        }
    } catch (err) {
        res.send(err);
    }
}

exports.getEmployersAssignedForPlacementOfficer = async function(req, res) {

    let placementId = req.params.placementId;
    try{
        let placementUser = await User.findOne({role: 'placement', _id: placementId});
        if(!placementUser){
            return res.status(400).send({
                message: "Placement user not found with id: " + placementId
            });
        }
        let employers = await Employer.find({placementOfficer: placementId});
        res.send(employers)
    } catch(err){
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.getOpenVacanciesForPlacementOfficer = async function (req, res) {

    let placementId = req.params.placementId;
    try {
        let placementUser = await User.findOne({ role: 'placement', _id: placementId });
        if (!placementUser) {
            return res.status(400).send({
                message: "Placement user not found with id: " + placementId
            });
        }
        let employers = await Employer.find({ placementOfficer: placementId }).distinct('_id');
        let vacancies = await Vacancy.find({ employer: { $in: employers }, status: 'Active'});
        res.send(vacancies)
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}