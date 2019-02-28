'use strict';

const Vacancy = require('../models/Vacancy');
const Employer = require('../models/Employer');
const Criteria = require('../models/CandidateMatchingCriteria');
const Candidate = require('../models/Candidate');

exports.createVacancyForEmployer = async function (req, res) {

    try{
        let employer = await Employer.findById(req.params.employerId);
        if (!employer) {
            return res.status(404).send({
                message: "Employer not found with id " + req.params.employerId
            });
        }
        let newVacancy = new Vacancy(req.body);
        newVacancy.employer = req.params.employerId;
        let savedVacancy = await newVacancy.save();
        res.send(savedVacancy);

    } catch(err) {
        res.send(err);
    }
}

exports.findVacanciesForEmployer = async function (req, res) {

    try {
        let employer = await Employer.findById(req.params.employerId);
        if (!employer) {
            return res.status(404).send({
                message: "Employer not found with id " + req.params.employerId
            });
        }
        let vacancies = await Vacancy.find({employer: req.params.employerId });
        if (vacancies.length == 0) {
            return res.status(404).send({
                message: "Vacancies not found for this employer "
            });
        }
        res.send(vacancies);
    } catch(err) {
        res.send(err);
    }
}

exports.createTentativeCandidateShortlist = async function(req, res) {
    try{
        let vacancyId = req.params.vacancyId;
        let vacancy = await Vacancy.findById(vacancyId);
        if (!vacancy) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        if (req.query.education == undefined && req.query.gender == undefined && 
            req.query.location == undefined && req.query.experience == undefined 
            && req.query.occupation == undefined) {
            return res.status(400).send({
                message: "No criteria selected for shortlist"
            }); 
        }
        let shortListQuery = {$and: []};
        let genderQuery = [];
        if(req.query.occupation != undefined){
            shortListQuery.$and.push({ occupation: vacancy.occupation});
        }
        if(req.query.experience != undefined){
            shortListQuery.$and.push({experience: { $gte: vacancy.experience }});
        }
        if(req.query.location != undefined){
            shortListQuery.$and.push({ 'location.city': vacancy.location.city});
        }
        if(req.query.gender != undefined){
            if (vacancy.gender == "Any") {
                genderQuery.push("Male");
                genderQuery.push("Female");
            }
            else {
                genderQuery.push(vacancy.gender);
            }
            shortListQuery.$and.push({ gender: { $in: genderQuery }});
        }
        if(req.query.education != undefined){
            shortListQuery.$and.push({ education: { $gte: vacancy.educationRequirement }});
        }
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

        let documentCount = await Criteria.countDocuments(shortListQuery);
        let pageCount = Math.ceil(documentCount / limit);

        ////////////////////////////////////
        let previousVacancyCandidates = await Candidate.find({ 'vacancyStatus.vacancy': vacancyId }, { _id: 1 });
        if(previousVacancyCandidates.length != 0){
            shortListQuery.$and.push({ candidate: { $nin: previousVacancyCandidates}});
        }
        
        let shortListCandidates = await Criteria.find(shortListQuery, {}, paging)
                                                .populate('candidate');
        res.send({
            pages: pageCount, 
            candidates: shortListCandidates
        });

    } catch(err){
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.createCandidateShortlist = async function(req, res) {
    try{
        let candidateIds = req.body.candidateIds;
        let vacancyId = req.params.vacancyId;
        let vacancy = await Vacancy.findById(vacancyId);
        if (!vacancy) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        let candidateVacancyStatus = {
            vacancy: vacancyId,
            status: "Schedule Interview"
        }
        let shortlist = await Candidate.updateMany({ _id: { $in: candidateIds } },
                                                   { $push: { vacancyStatus: candidateVacancyStatus } });
        res.send(shortlist);

    }catch(err){
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.findVacancyShortlist = async function(req, res) {
    try{
        let vacancyId = req.params.vacancyId;
        let vacancy = await Vacancy.findById(vacancyId);
        if (!vacancy) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        let candidateQuery = {
            'vacancyStatus.vacancy': vacancyId
        };
        if (req.query.status) {
            candidateQuery = {
                "vacancyStatus": {
                    $elemMatch: {
                        vacancy: vacancyId,
                        status: req.query.status
                    }
                }
            }
        }
        let candidates = await Candidate.find(candidateQuery, {_id: 1});
        let candidatesWithCriteria = await Criteria.find({candidate: {$in: candidates}})
                                                   .populate('candidate');
        res.send(candidatesWithCriteria);

    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.updateStatusForCandidateInAVacancy = async function(req, res) {
    try{
        let status = req.body.status;
        if (!status) {
            return res.status(400).send({
                message: "Update status not provided"
            });
        }
        let vacancyId = req.params.vacancyId;
        let vacancy = await Vacancy.findById(vacancyId);
        if (!vacancy) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        let candidateId = req.params.candidateId;
        let checkCandidate = await Candidate.findById(candidateId);
        if (!checkCandidate) {
            return res.status(404).send({
                message: "Candidate not found with id " + req.params.candidateId
            });
        }
        let interviewDate;
        if(req.body.interviewDate){
            interviewDate = req.body.interviewDate;
        }
        else{
            interviewDate = Date.now();
        }
        let candidate = await Candidate.findOneAndUpdate({ _id: candidateId , 'vacancyStatus.vacancy': vacancyId}, 
                                            {'$set': {
                                                'vacancyStatus.$.status': status,
                                                'vacancyStatus.$.interviewDate': interviewDate
                                            }}, {new: true});

        if(status == "Joined") {
            candidate.employmentStatus = true;
            candidate = await candidate.save();
            vacancy.hired += 1;
            vacancy = await vacancy.save();
        }
        res.send(candidate);

    } catch(err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.update = async function (req, res) {

    let updatedVacancyFields = { ...req.body };
    try {
        let updatedVacancy = await Vacancy.findByIdAndUpdate(req.params.vacancyId, updatedVacancyFields, { new: true, upsert: true, setDefaultsOnInsert: true });
        res.send(updatedVacancy);
    } catch (err) {
        res.send(err);
    }
}

exports.delete = async function (req, res) {

    try {
        let deletedVacancy = await Vacancy.findByIdAndDelete(req.params.vacancyId);
        if (!deletedVacancy) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        let update = await Candidate.updateMany({ 'vacancyStatus.vacancy': req.params.vacancyId},
                                   { $pull: { vacancyStatus: { vacancy: req.params.vacancyId} } })       
        res.send({ 
            message: "Vacancy deleted successfully!",
            update 
        });
    } catch (err) {
        res.send(err);
    }
}

exports.findOne = async function (req, res) {

    try {
        let vacancy = await Vacancy.findById(req.params.vacancyId);
        if (!vacancy) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        res.send(vacancy);
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

        let documentCount = await Vacancy.countDocuments({});
        let pageCount = Math.ceil(documentCount / limit);

        ////////////////////////////////////
        let vacancies = await Vacancy.find({}, {}, paging);
        res.send({
            vacancies: vacancies,
            pages: pageCount
        });
    } catch (err) {
        res.send(err);
    }
}
