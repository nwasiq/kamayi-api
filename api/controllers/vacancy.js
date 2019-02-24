'use strict';

const Vacancy = require('../models/Vacancy');
const Employer = require('../models/Employer');

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
