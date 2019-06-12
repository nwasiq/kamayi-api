'use strict';

const Candidate = require('../models/Candidate');
const Criteria = require('../models/CandidateMatchingCriteria');

exports.create = async function (req, res) {

    try{
        let newCandidate = new Candidate(req.body);
        let candidateCriteria = req.body.criteria;
        delete newCandidate.criteria;
        let candidate = await Candidate.getCandidateByPhoneNumber(newCandidate.phone);
        if (candidate) {
            return res.status(400).send({
                message: "Candidate with this phone number already exists"
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

/**
 * showing safi shit
 */

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

exports.filterCandidates = async function(req, res) {
    let query = req.body.query;
    try{
        let candyQquery = {$and: []};
        if(query.primarySkill){
            candyQquery.$and.push({ primarySkill: { $regex: new RegExp(query.primarySkill, "i") }})
        }
        if(query.phone){
            candyQquery.$and.push({ phone: query.phone})
        }
        if (query.hasOtherSkill){
            candyQquery.$and.push({ hasOtherSkill: query.hasOtherSkill})
        }
        if (query.cnic) {
            candyQquery.$and.push({ cnic: query.cnic })
        }
        if (query.fullName) {
            let fullName = query.fullName;
            candyQquery.$and.push({ fullName: { $regex: new RegExp("^" + fullName + '$', "i") } });
        }
        let candidates = await Candidate.find(candyQquery);
        if(candidates.length == 0){
            return res.send({
                message: "No candidates found",
                candidates
            })
        }
        res.send(candidates);
    } catch (err) {
        res.send(err);
    }
}

exports.getCandiesWithinArea = async function (req, res) {
    let coords = req.body.coords;
    let maxDistance = req.body.distance;

    try{
        
    } catch (err) {
        res.send(err);
    }
}
