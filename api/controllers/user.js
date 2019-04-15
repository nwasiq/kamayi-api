'use strict';

const User = require('../models/User');
const jwt = require('jsonwebtoken');
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
            let userPayload = {
                _id: user._id,
                password: user.password
            };
            const token = jwt.sign(userPayload, process.env.SECRET, {
                expiresIn: 604800 // 1 week
            });
            /**
             * For admin and placement, retrieve dashboard fields
             * For admin: employers who have no officer assigned, payments? and job archive approvals
             * For placement: assigned employers, open vacancies
             */
            let dashboard = {};
            if(user.role == "admin"){
                dashboard['employerAssignments'] = await Employer.find({placementOfficer: {$exists: false}}).count();
                dashboard['vacancyArchiveApprovals'] = await Vacancy.find({status: 'Pending Verification'}).count();
            }
            else if(user.role == "placement"){
                let employers = await Employer.find({ placementOfficer: user._id }).distinct('_id');
                dashboard['assignedEmployers'] = employers.length;
                dashboard['openVacancies'] = await Vacancy.find({ employer: { $in: employers }, status: 'Active' }).count();
            }
            res.send({
                success: true,
                token: 'Bearer ' + token,
                user,
                dashboard
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

exports.getDashboardFields = async function(req, res){
    let role = req.user.role;
    let dashboard = {};
    try{
        if (role == "admin") {
            dashboard['employerAssignments'] = await Employer.find({ placementOfficer: { $exists: false } }).count();
            dashboard['vacancyArchiveApprovals'] = await Vacancy.find({ status: 'Pending Verification' }).count();
        }
        else if (role == "placement") {
            let employers = await Employer.find({ placementOfficer: req.user._id }).distinct('_id');
            dashboard['assignedEmployers'] = employers.length;
            dashboard['openVacancies'] = await Vacancy.find({ employer: { $in: employers }, status: 'Active' }).count();
        }
        res.send(dashboard);
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.getDashboardFieldsById = async function(req, res){
    let id = req.params.userId;
    let dashboard = {};
    try{
        let user = await User.findOne({role: 'placement', _id: id});
        if(!user){
            return res.status(404).send({
                message: "Placement user with ID " + id + " not found"
            });
        }
        let employers = await Employer.find({ placementOfficer: id }).distinct('_id');
        dashboard['assignedEmployers'] = employers.length;
        dashboard['openVacancies'] = await Vacancy.find({ employer: { $in: employers }, status: 'Active' }).count();
        res.send(dashboard);
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
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
        res.send({employers:employers})
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
        let vacancies = await Vacancy.find({ employer: { $in: employers }, status: 'Active'}).populate('employer');
        res.send(vacancies)
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.getUsersByRole = async function(req, res){
    let role = req.params.role;
    try{
        let users = await User.find({role: role});
        if (users.length == 0) {
            return res.send({
                message: "Users not found with role: " + role
            });
        }
        res.send(users);
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}