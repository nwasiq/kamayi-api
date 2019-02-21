'use strict';

const Vacancy = require('../models/Vacancy');
const Employer = require('../models/Employer');

exports.createVacancyForEmployer = function (req, res) {

    Employer.findById(req.params.employerId, (err, employer) => {
        if(!employer){
            return res.status(404).send({
                message: "Employer not found with id " + req.params.employerId
            });
        }
        let newVacancy = new Vacancy(req.body);
        let employerId = req.params.employerId;
        newVacancy.employer = employerId;
        newVacancy.save((err, vacancy) => {
            if (err) {
                return res.status(500).send({
                    message: err.message || "Some error occurred while creating the Vacancy."
                });
            }
            res.send(vacancy);
        })
    })
}

exports.findVacanciesForEmployer = function (req, res) {

    Employer.findById(req.params.employerId, (err, employer) => {
        if (!employer) {
            return res.status(404).send({
                message: "Employer not found with id " + req.params.employerId
            });
        }
        Vacancy.find({ employer: req.params.employerId}, (err, vacancies) => {
            if (vacancies.length == 0) {
                return res.status(404).send({
                    message: "Vacancies not found for this employer "
                });
            }
            res.send(vacancies);
        });
    })
}

exports.update = function (req, res) {
    
    let updatedVacancy = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        salary: req.body.salary,
        openings: req.body.openings,
        jobType: req.body.jobType,
        startDate: req.body.startDate,
        experience: req.body.experience,
        trainingPeriod: req.body.trainingPeriod, 
        ageRange: req.body.ageRange,
        gender: req.body.gender,
        benefits: req.body.benefits
    };
    Vacancy.findByIdAndUpdate(req.params.vacancyId, updatedVacancy, { new: true, upsert: true, setDefaultsOnInsert: true }, (err, vacancy) => {

        if (!vacancy || (err && err.kind === 'ObjectId')) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error updating Vacancy with id " + req.params.vacancyId
            });
        }
        res.send(vacancy);
    })

}

exports.delete = function (req, res) {
    Vacancy.findByIdAndDelete(req.params.vacancyId, (err, vacancy) => {
        if (!vacancy || (err && (err.kind === 'ObjectId' || err.name === 'NotFound'))) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error retrieving Vacancy with id " + req.params.vacancyId
            });
        }
        res.send({ message: "Vacancy deleted successfully!" });
    })
}

exports.findOne = function (req, res) {
    Vacancy.findById(req.params.vacancyId, (err, vacancy) => {

        if (!vacancy || (err && err.kind === 'ObjectId')) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error retrieving Vacancy with id " + req.params.vacancyId
            });
        }
        res.send(vacancy);
    })
}

exports.findAll = function (req, res) {
    Vacancy.find({}, (err, vacancys) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving vacancys."
            });
        }
        res.send(vacancys);
    })
}
