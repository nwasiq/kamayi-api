'use strict';

const Candidate = require('../models/Candidate');
const Criteria = require('../models/CandidateMatchingCriteria');

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
