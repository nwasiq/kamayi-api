'use strict';

const Candidate = require('../models/Candidate');
const mongoose = require('mongoose');

exports.create = function (req, res) {

    let newCandidate = new Candidate(req.body);
    Candidate.getCandidateByCnic(newCandidate.cnic, (err, candidate) => {
        if (candidate) {
            return res.status(400).send({
                message: "Candidate with this cnic already exists"
            });
        }
        newCandidate.save((err, candidate) => {
            if (err) {
                return res.status(500).send({
                    message: err.message || "Some error occurred while creating the Candidate."
                });
            }
            res.send(candidate);
        })
    })
}

exports.update = function (req, res) {

    let updatedCandidate = {
        fullName: req.body.fullName,
        cnic: req.body.cnic,
        phone: req.body.phone,
        dob: req.body.dob,
        skills: req.body.skills, 
        education: req.body.education, 
        training: req.body.training, 
        experience: req.body.experience, 
        location: req.body.location,
        employmentStatus: req.body.employmentStatus
    };
    Candidate.findOneAndUpdate(req.params.candidateId, updatedCandidate, { new: true, upsert: true, setDefaultsOnInsert: true }, (err, candidate) => {
        if (!candidate || (err && err.kind === 'ObjectId')) {
            return res.status(404).send({
                message: "Candidate not found with id " + req.params.candidateId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error updating Candidate with id " + req.params.candidateId
            });
        }
        res.send(candidate);
    })

}

exports.delete = function (req, res) {
    Candidate.findOneAndDelete(req.params.candidateId, (err, candidate) => {
        if (!candidate || (err && (err.kind === 'ObjectId' || err.name === 'NotFound'))) {
            return res.status(404).send({
                message: "Candidate not found with id " + req.params.candidateId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error retrieving Candidate with id " + req.params.candidateId
            });
        }
        res.send({ message: "Candidate deleted successfully!" });
    })
}

exports.findOne = function (req, res) {
    Candidate.findById(req.params.candidateId, (err, candidate) => {

        if (!candidate || (err && err.kind === 'ObjectId')) {
            return res.status(404).send({
                message: "Candidate not found with id " + req.params.candidateId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error retrieving Candidate with id " + req.params.candidateId
            });
        }
        res.send(candidate);
    })
}

exports.findAll = function (req, res) {
    Candidate.find({}, (err, candidates) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving candidates."
            });
        }
        res.send(candidates);
    })
}
