'use strict';

const BulkCandidate = require('../models/BulkCandidate');
const fileUpload = require('../services/FileUploadService');
const Candidate = require('../models/Candidate');
const Criteria = require('../models/CandidateMatchingCriteria'); 
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
const util = require('util');
var fs = require('fs');

var NodeGeocoder = require('node-geocoder');
var geoCodeOptions = {
    provider: 'google',
    httpAdapter: 'https', 
    apiKey: '', 
    formatter: null        
};

exports.importExcel = async function (req, res) {
    const uploadExcel = util.promisify(fileUpload.uploadExcelFile);
    try{
        await uploadExcel(req, res);
        if (!req.file) {
            return res.status(400).send({
                message: "no file selected"
            });
        }
        let exceltojson;
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        const convertExcel = util.promisify(exceltojson);
        let result = await convertExcel({
            input: req.file.path,
            output: null, //since we don't need output.json
            lowerCaseHeaders: false
        });
        fs.unlinkSync(req.file.path);
        if (req.query.candidate != undefined) {
            if (req.query.key == undefined) {
                res.status(400).send({ msg: "API key required" })
            }
            geoCodeOptions.apiKey = req.query.key;
            var geocoder = NodeGeocoder(geoCodeOptions);
            /**
             *  get candidate excel data in order
             */
            let iterator = 1;
            for (let candidate of result) {

                if (candidate.employmentStatus == "Unemployed")
                    candidate.employmentStatus = false;
                else
                    candidate.employmentStatus = true

                if (candidate.isTrained == "No")
                    candidate.isTrained = false;
                else
                    candidate.isTrained = true

                if (candidate.education == "Bachelors" || candidate.education == "DAE") {
                    candidate.education = 7
                }
                else if (candidate.education == "Middle") {
                    candidate.education = 4
                }
                else if (candidate.education == "Matric") {
                    candidate.education = 5
                }
                else if (candidate.education == "Intermediate") {
                    candidate.education = 6
                }
                else if (candidate.education == "Masters") {
                    candidate.education = 8
                }
                else {
                    candidate.education = 3
                }
                let findCoordinatesFor = candidate.location + ", " + candidate.city;
                let coords = await geocoder.geocode(findCoordinatesFor);
                let coordsArray = [];
                coordsArray.push(coords[0].longitude);
                coordsArray.push(coords[0].latitude);
                candidate.location = coordsArray;
                let newCandidate = new Candidate({
                    fullName: candidate.fullName,
                    cnic: candidate.cnic,
                    phone: candidate.phone,
                    dob: candidate.dob,
                    training: candidate.training,
                    employmentStatus: candidate.employmentStatus
                });
                let savedCandidate = await newCandidate.save();

                let newCriteria = new Criteria({
                    occupation: candidate.occupation, 
                    experience: candidate.experience,
                    employer: candidate.employer,
                    isTrained: candidate.isTrained,
                    city: candidate.city,
                    location: {
                        type: "Point",
                        coordinates: candidate.location
                    },
                    gender: candidate.gender,
                    education: candidate.education,
                    candidate: savedCandidate._id
                });

                await newCriteria.save();
                console.log("Candidate " + iterator++ + " saved");
            }
            res.send({msg: "Candidates saved!"})
        }
        else {
            /**
             * Check if candidates already exist in DB by cnic numbers
             */
            let cnicNumbers = [];
            for (let candidate of result) {
                cnicNumbers.push(candidate.cnic);
            }
            let candidates = await BulkCandidate.find({ cnic: { $in: cnicNumbers }});
            let message;
            if (candidates.length) {
                if (candidates.length == result.length) {
                    return res.status(400).send({
                        message: "All candidates in this list are already in the DB",
                    });
                }
                message = candidates.length + " candidates in this list are already in the DB";
            }
            else {
                message = "success";
            }
            for (var i = 0; i < candidates.length; i++) {
                for (var j = 0; j < result.length; j++) {
                    if (candidates[i].cnic == result[j].cnic) {
                        result.splice(j, 1);
                        break;
                    }
                }
            }
            let bulkInsertedCandidates = await BulkCandidate.insertMany(result);
            res.send({
                message: message,
                excelCandidates: bulkInsertedCandidates
            });
        }
    } catch(err) {
        return res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.findExcelCandidates = async function (req, res) {
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

        let documentCount = await BulkCandidate.countDocuments({});
        let pageCount = Math.ceil(documentCount / limit);

        ////////////////////////////////////
        let excelCandidates = await BulkCandidate.find({}, {}, paging);
        if(!excelCandidates.length){
            res.status(404).send({
                message: "No bulk candidates found"
            })
        }
        res.send({
            excelCandidates: excelCandidates,
            pages: pageCount
        });
    } catch (err) {
        res.status(500).send({
            message: "An error occurred",
            err: err
        })
    }
}