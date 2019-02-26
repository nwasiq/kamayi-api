'use strict';

const Candidate = require('../models/Candidate');
const BulkCandidate = require('../models/BulkCandidate');
const fileUpload = require('../services/FileUploadService');
const Criteria = require('../models/CandidateMatchingCriteria');
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
var fs = require('fs');

exports.create = async function (req, res) {

    try{
        let newCandidate = new Candidate(req.body);
        let candidateCriteria = req.body.criteria;
        delete newCandidate.criteria;
        let candidate = await Candidate.getCandidateByCnic(newCandidate.cnic);
        if (candidate) {
            return res.status(400).send({
                message: "Candidate with this cnic already exists"
            });
        }
        let savedCandidate = await newCandidate.save();
        for (let singleCriteria of candidateCriteria) {
            singleCriteria['candidate'] = savedCandidate._id;
        }
        let savedCriteria = await Criteria.insertMany(candidateCriteria);
        res.json({
            candidate: savedCandidate,
            criteria: savedCriteria
        })
    } catch(err) {
        res.send(err);
    }
}

exports.delete = async function (req, res) {
    try{
        let candidate = await Candidate.findByIdAndDelete(req.params.candidateId);
        if (!candidate) {
            return res.status(404).send({
                message: "Candidate not found with id " + req.params.candidateId
            });
        }
        await Criteria.deleteMany({candidate: candidate._id});
        res.send({ message: "Candidate deleted successfully!" });
    } catch(err){
        res.send(err);
    }
}

exports.findCriteriaForCandidate = async function (req, res) {
    try{
        let candidate = await Candidate.findById(req.params.candidateId);
        if(!candidate){
            return res.status(404).send({
                message: "Candidate not found with id " + req.params.candidateId
            });
        }
        let criteria = await Criteria.find({ candidate: req.params.candidateId });
        if (criteria.length == 0 ) {
            return res.status(404).send({
                message: "No criteria found for candidate " + candidateId
            });
        }
        res.send(criteria);
    } catch(err) {
        res.send(err);
    }
}

exports.update = async function (req, res) {

    let updatedCandidateFields = { ...req.body };
    try {
        let updatedCandidate = await Candidate.findByIdAndUpdate(req.params.candidateId, updatedCandidateFields, { new: true, upsert: true, setDefaultsOnInsert: true });
        res.send(updatedCandidate);
    } catch (err) {
        res.send(err);
    }
}

exports.findOne = async function (req, res) {

    try {
        let candidate = await Candidate.findById(req.params.candidateId);
        if (!candidate) {
            return res.status(404).send({
                message: "Candidate not found with id " + req.params.candidateId
            });
        }
        res.send(candidate);
    } catch (err) {
        res.send(err);
    }
}

exports.findAll = async function (req, res) {

    try {
        /**
         * paging 
         */
        var paging = {};

        var page = parseInt(req.query.page);
        var limit = parseInt(req.query.limit);

        if (page < 0 || page === 0)
            page = 1;

        paging.skip = limit * (page - 1);
        paging.limit = limit;

        let documentCount = await Candidate.countDocuments({});
        let pageCount = Math.ceil(documentCount / limit);

        ////////////////////////////////////
        let candidates = await Candidate.find({}, {}, paging);
        res.send({
            pages: pageCount,
            candidates: candidates
        });
    } catch (err) {
        res.send(err);
    }
}
