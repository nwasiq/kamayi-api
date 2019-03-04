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
    fileUpload.uploadExcelFile(req, res, (err) => {
        if (err) {
            return res.status(500).send({
                message: "Upload failed",
                err: err
            })
        }
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
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders: false
            }, function (err, result) {
                if (err) {
                    return res.status(500).send({
                        message: "an error occured while converting excel",
                        err: err
                    });
                }
                fs.unlinkSync(req.file.path);
                let geoCodePromises = [];
                if(req.query.candidate != undefined){
                    if(req.query.key == undefined) {
                        res.status(400).send({msg: "API key required"})
                    }
                    geoCodeOptions.apiKey = req.query.key;
                    var geocoder = NodeGeocoder(geoCodeOptions);
                    for(let candidate of result){
                        if (candidate.education == "Bachelors" || candidate.education == "DAE"){
                            candidate.education = 7
                        }
                        else if (candidate.education == "Middle"){
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
                        else{
                            candidate.education = 3
                        }
                        let findCoordinatesFor = candidate.location + ", " + candidate.city;
                        geoCodePromises.push(geocoder.geocode(findCoordinatesFor));
                    }
                    Promise.all(geoCodePromises)
                        .then(function(coords){
                            let candidatesToInsert = [];
                            for(var i = 0; i < result.length; i++){
                                let locCoords = [];
                                locCoords.push(coords[i][0].longitude)
                                locCoords.push(coords[i][0].latitude)
                                result[i].location = locCoords;
                            //     let newCandidate = {
                            //         fullName: result[i].fullName,
                            //         cnic: result[i].cnic,
                            //         phone: result[i].phone,
                            //         dob: result[i].dob,
                            //         training: result[i].training,
                            //         employmentStatus: result[i].employmentStatus,
                            //     }
                            //     let newCriteria = {
                            //         occupation: String, //should be enum
                            //         experience: Number,
                            //         employer: String,
                            //         isTrained: Boolean,
                            //         city: String,
                            //         location: {
                            //             type: ,
                            //             coordinates: 
                            //         },
                            //         gender: 
                            //         education: 
                            //     }
                            }
                            res.send({ msg: "console log complete" });
                        }).catch(function(err){console.log(err)});
                }
                else{
                    /**
                     * Check if candidates already exist in DB by cnic numbers
                     */
                    let cnicNumbers = [];
                    for (let candidate of result) {
                        cnicNumbers.push(candidate.cnic);
                    }
                    BulkCandidate.find({ cnic: { $in: cnicNumbers } }, (err, candidates) => {
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
                        /**
                         * remove candidates that are already in DB
                         */
                        for (var i = 0; i < candidates.length; i++) {
                            for (var j = 0; j < result.length; j++) {
                                if (candidates[i].cnic == result[j].cnic) {
                                    result.splice(j, 1);
                                    break;
                                }
                            }
                        }
                        BulkCandidate.insertMany(result, (err, bulkInsertedCandidates) => {
                            if (err) {
                                return res.status(500).send({
                                    message: "an error occured while inserting bulk candidates",
                                    err: err
                                });
                            }
                            res.send({
                                message: message,
                                excelCandidates: bulkInsertedCandidates
                            });
                        })
                    })
                }  
            });
        } catch (e) {
            return res.status(500).send({
                message: "an error occured while converting excel",
                err: e
            });
        }
    })
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