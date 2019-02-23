'use strict';

const Criteria = require('../models/CandidateMatchingCriteria');

exports.createCriteriaForCandidate = function (req, res) {

    let newCriteria = new Criteria(req.body);
    newCriteria.candidate = req.params.candidateId;
    newCriteria.save((err, criteria) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Criteria."
            });
        }
        res.send(criteria);
    })
}

exports.update = function (req, res) {

    let updatedCriteria = { ...req.body };
    Criteria.findByIdAndUpdate(req.params.criteriaId, updatedCriteria, { new: true, upsert: true, setDefaultsOnInsert: true }, (err, criteria) => {
        if (!criteria || (err && err.kind === 'ObjectId')) {
            return res.status(404).send({
                message: "Criteria not found with id " + req.params.criteriaId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error updating Criteria with id " + req.params.criteriaId
            });
        }
        res.send(criteria);
    })

}

exports.delete = function (req, res) {
    Criteria.findByIdAndDelete(req.params.criteriaId, (err, criteria) => {
        if (!criteria || (err && (err.kind === 'ObjectId' || err.name === 'NotFound'))) {
            return res.status(404).send({
                message: "Criteria not found with id " + req.params.criteriaId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error retrieving Criteria with id " + req.params.criteriaId
            });
        }
        res.send({ message: "Criteria deleted successfully!" });
    })
}

exports.findOne = function (req, res) {
    Criteria.findById(req.params.criteriaId, (err, criteria) => {

        if (!criteria || (err && err.kind === 'ObjectId')) {
            return res.status(404).send({
                message: "Criteria not found with id " + req.params.criteriaId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error retrieving Criteria with id " + req.params.criteriaId
            });
        }
        res.send(criteria);
    })
}

exports.findAll = function (req, res) {
    Criteria.find({}, (err, criterias) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving criterias."
            });
        }
        res.send(criterias);
    })
}
