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

exports.createCandidateShortlist = async function(req, res) {
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
        res.send({ message: "Vacancy deleted successfully!" });
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
        let vacancies = await Vacancy.find();
        res.send(vacancies);
    } catch (err) {
        res.send(err);
    }
}
