'use strict';

const Criteria = require('../models/CandidateMatchingCriteria');

exports.createCriteriaForCandidate = async function (req, res) {

    let newCriteria = new Criteria(req.body);
    newCriteria.candidate = req.params.candidateId;
    try {
        let savedCriteria = await newCriteria.save();
        res.send(savedCriteria);
    } catch (err) {
        res.send(err);
    }
}

exports.update = async function (req, res) {

    let updatedCriteriaFields = { ...req.body };
    try {
        let updatedCriteria = await Criteria.findByIdAndUpdate(req.params.criteriaId, updatedCriteriaFields, { new: true, upsert: true, setDefaultsOnInsert: true });
        res.send(updatedCriteria);
    } catch (err) {
        res.send(err);
    }
}

exports.delete = async function (req, res) {

    try {
        let deletedCriteria = await Criteria.findByIdAndDelete(req.params.criteriaId);
        if (!deletedCriteria) {
            return res.status(404).send({
                message: "Criteria not found with id " + req.params.criteriaId
            });
        }
        res.send({ message: "Criteria deleted successfully!" });
    } catch (err) {
        res.send(err);
    }
}

exports.findOne = async function (req, res) {

    try {
        let criteria = await Criteria.findById(req.params.criteriaId);
        if (!criteria) {
            return res.status(404).send({
                message: "Criteria not found with id " + req.params.criteriaId
            });
        }
        res.send(criteria);
    } catch (err) {
        res.send(err);
    }
}

exports.findAll = async function (req, res) {

    try {
        let criterias = await Criteria.find();
        res.send(criterias);
    } catch (err) {
        res.send(err);
    }
}
