'use strict';

const Employer = require('../models/Employer');

exports.create = async function (req, res) {

    let newEmployer = new Employer(req.body);
    try {
        let employer = await Employer.getEmployerByCompanyName(newEmployer.companyName);
        if (employer) {
            return res.status(400).send({
                message: "Employer with this company name already exists"
            });
        }
        let savedEmployer = await newEmployer.save();
        res.send(savedEmployer);
    } catch (err) {
        res.send(err);
    }
}

exports.update = async function (req, res) {

    let updatedEmployerFields = { ...req.body };
    try {
        let updatedEmployer = await Employer.findByIdAndUpdate(req.params.employerId, updatedEmployerFields, { new: true, upsert: true, setDefaultsOnInsert: true });
        res.send(updatedEmployer);
    } catch (err) {
        res.send(err);
    }
}

exports.delete = async function (req, res) {

    try {
        let deletedEmployer = await Employer.findByIdAndDelete(req.params.employerId);
        if (!deletedEmployer) {
            return res.status(404).send({
                message: "Employer not found with id " + req.params.employerId
            });
        }
        res.send({ message: "Employer deleted successfully!" });
    } catch (err) {
        res.send(err);
    }
}

exports.findOne = async function (req, res) {

    try {
        let employer = await Employer.findById(req.params.employerId);
        if (!employer) {
            return res.status(404).send({
                message: "Employer not found with id " + req.params.employerId
            });
        }
        res.send(employer);
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

        let documentCount = await Employer.countDocuments({});
        let pageCount = Math.ceil(documentCount / limit);

        ////////////////////////////////////
        let employers = await Employer.find({}, {}, paging);
        res.send({
            pages: pageCount,
            employers: employers
        });
    } catch (err) {
        res.send(err);
    }
}
