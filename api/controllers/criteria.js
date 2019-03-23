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
