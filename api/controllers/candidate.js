'use strict';

const Candidate = require('../models/Candidate');
const Criteria = require('../models/CandidateMatchingCriteria');

exports.create = function (req, res) {

    let newCandidate = new Candidate(req.body);
    let candidateCriteria = req.body.criteria;
    delete newCandidate.criteria;
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
            for(let singleCriteria of candidateCriteria){
                singleCriteria['candidate'] = candidate._id;
            }
            Criteria.insertMany(candidateCriteria, (err, criteria) => {
                if (err) {
                    return res.status(500).send({
                        message: err.message || "Some error occurred while creating multiple criteria."
                    });
                }

                res.json({
                    candidate: candidate,
                    criteria: criteria
                })
            });
        })
    })
}

exports.update = function (req, res) {

    let updatedCandidate = {...req.body};
    Candidate.findByIdAndUpdate(req.params.candidateId, updatedCandidate, { new: true, upsert: true, setDefaultsOnInsert: true }, (err, candidate) => {
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
    Candidate.findByIdAndDelete(req.params.candidateId, (err, candidate) => {
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

exports.findCriteriaForCandidate = function(req, res) {
    let candidateId = req.params.candidateId;
    Criteria.find({candidate: candidateId}, (err, criteria) => {
        if(criteria.length == 0){
            return res.status(404).send({
                message: "No criteria found for candidate " + candidateId
            });
        }
        res.send(criteria);
    })
}
