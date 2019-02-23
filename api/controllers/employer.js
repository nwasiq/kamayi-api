'use strict';

const Employer = require('../models/Employer');

exports.create = function (req, res) {

    let newEmployer = new Employer(req.body);
    Employer.getEmployerByCompanyName(newEmployer.companyName, (err, user) => {
        if (user) {
            return res.status(400).send({
                message: "Employer with this company name already exists"
            });
        }
        newEmployer.save((err, user) => {
            if (err) {
                return res.status(500).send({
                    message: err.message || "Some error occurred while creating the Employer."
                });
            }
            res.send(user);
        })
    })
}

exports.update = function (req, res) {

    let updatedEmployer = {
        fullName: req.body.fullName,
        email: req.body.email,
        pocPhone: req.body.pocPhone,
        pocDesignation: req.body.pocDesignation,
        pocAddress: req.body.pocAddress,
        companyName: req.body.companyName,
        companyPhone: req.body.companyPhone,
        industry: req.body.industry, 
        website: req.body.website,
        location: req.body.location
    };
    Employer.findByIdAndUpdate(req.params.employerId, updatedEmployer, { new: true, upsert: true, setDefaultsOnInsert: true }, (err, user) => {
        if (!user || (err && err.kind === 'ObjectId')) {
            return res.status(404).send({
                message: "Employer not found with id " + req.params.employerId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error updating Employer with id " + req.params.employerId
            });
        }
        res.send(user);
    })

}

exports.delete = function (req, res) {
    Employer.findByIdAndDelete(req.params.employerId, (err, user) => {
        if (!user || (err && (err.kind === 'ObjectId' || err.name === 'NotFound'))) {
            return res.status(404).send({
                message: "Employer not found with id " + req.params.employerId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error retrieving Employer with id " + req.params.employerId
            });
        }
        res.send({ message: "Employer deleted successfully!" });
    })
}

exports.findOne = function (req, res) {
    Employer.findById(req.params.employerId, (err, user) => {

        if (!user || (err && err.kind === 'ObjectId')) {
            return res.status(404).send({
                message: "Employer not found with id " + req.params.employerId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error retrieving Employer with id " + req.params.employerId
            });
        }
        res.send(user);
    })
}

exports.findAll = function (req, res) {
    Employer.find({}, (err, users) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        }
        res.send(users);
    })
}
