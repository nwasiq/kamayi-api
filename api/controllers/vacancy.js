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
        let vacancy = await Vacancy.findById(vacancyId, {
            gender: 1, location: 1, occupation: 1, city: 1, experience: 1, educationRequirement: 1
        });
        if (!vacancy) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        if (req.query.education == undefined && req.query.gender == undefined && 
            req.query.location == undefined && req.query.experience == undefined 
            && req.query.occupation == undefined && req.query.city == undefined) {
            return res.status(400).send({
                message: "No criteria selected for shortlist"
            }); 
        }
        /**
         * Creating Query for Candidate shortlist based on params (req.query)
         */
        let shortListQuery = {$and: []};
        let genderQuery = [];
        if(req.query.occupation != undefined){
            shortListQuery.$and.push({ occupation: vacancy.occupation});
        }
        if(req.query.experience != undefined){
            shortListQuery.$and.push({experience: { $gte: vacancy.experience }});
        }
        if(req.query.city != undefined){
            shortListQuery.$and.push({ 'city': vacancy.city});
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

        if (!shortListQuery.$and.length) {
            shortListQuery = {}
        }
        let documentCount = await Criteria.countDocuments(shortListQuery);
        let pageCount = Math.ceil(documentCount / limit);

        /**
         *  Don't search for canidates who are already in the shortlist
         */
        let previousVacancyCandidates = await Candidate.find({ 'vacancyStatus.vacancy': vacancyId }, { _id: 1 });
        if(previousVacancyCandidates.length != 0){
            shortListQuery.$and.push({ candidate: { $nin: previousVacancyCandidates}});
        }
        
        /**
         * Aggregation: sorting candidates based on weights
         * assigned to education, experience and location
         */

        let aggregateOperation = [];
        if (req.query.location != undefined){
            aggregateOperation.push({
                $geoNear: {
                    near: { type: "Point", coordinates: vacancy.location.coordinates },
                    distanceMultiplier: 0.001,
                    distanceField: "distanceFromVacancy",
                    query: shortListQuery,
                    spherical: true
                }
            })
        }
        else{
            aggregateOperation.push({ $match: shortListQuery });
        }

        /**
         * sort based on single criteria (can be education, experience, gender)
         */
        if(req.query.sort != undefined){
            if(req.query.sort != 'location'){
                let sortObj = {
                    $sort: { [req.query.sort]: -1 }
                }
                aggregateOperation.push(sortObj);
            }
        }

        /**
         * Weighted query can only run if sort not defined
         * i.e. you can only do weighted OR sort query
         */
        if (req.query.sort == undefined && req.query.weighted != undefined){
            let candidateProjection = {
                candidate: 1,
                location: 1,
                education: 1,
                city: 1,
                isTrained: 1,
                employer: 1,
                experience: 1,
                occupation: 1,
                gender: 1,
                distanceFromVacancy: 1
            }
            let projectIndividualScores = {
                ...candidateProjection,
                experienceScore: {},
                educationScore: {},
                locationScore: {}
            };
            let projectCombinedScore = {
                ...candidateProjection,
                score: {
                    $add: []
                }
            }
            if(req.query.experience) {
                let experienceScoreField = {
                    $multiply: ["$experience", parseInt(req.query.experience) || 1]
                }
                projectIndividualScores.experienceScore = experienceScoreField;
                projectCombinedScore.score.$add.push('$experienceScore');
            }
            else{
                delete projectIndividualScores.experienceScore;
            }
            if (req.query.education) {
                let educationScoreField = {
                    $multiply: ["$education", parseInt(req.query.education) || 1]
                }
                projectIndividualScores.educationScore = educationScoreField;
                projectCombinedScore.score.$add.push('$educationScore');
            }
            else {
                delete projectIndividualScores.educationScore;
            }
            if (req.query.location) {
                let locationScoreField = {
                    $multiply: ["$distanceFromVacancy", parseFloat(req.query.location) || 1]
                }
                projectIndividualScores.locationScore = locationScoreField;
                projectCombinedScore.score.$add.push('$locationScore');
            }
            else {
                delete projectIndividualScores.locationScore;
            }
            aggregateOperation.push({
                    $project: projectIndividualScores
                },
                {
                    $project: projectCombinedScore
                },
                {
                    $sort: { 'score': -1 }
                }
            );
        }
        aggregateOperation.push({$skip: paging.skip}, {$limit: paging.limit});
        let locationCandidates = await Criteria.aggregate(aggregateOperation);
        let shortListCandidates = await Criteria.populate(locationCandidates, {path: "candidate"});
        res.send({
            criteriaToMatch: vacancy, //temporary
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
