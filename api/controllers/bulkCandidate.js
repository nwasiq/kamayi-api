'use strict';

const BulkCandidate = require('../models/BulkCandidate');
const fileUpload = require('../services/FileUploadService');
const Candidate = require('../models/Candidate');
const Criteria = require('../models/CandidateMatchingCriteria'); 
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
const util = require('util');
const allowedEducations = require('../enums/education');
const allowedOccupations = require('../enums/occupation');
var fs = require('fs');

var NodeGeocoder = require('node-geocoder');
var geoCodeOptions = {
    provider: 'google',
    httpAdapter: 'https', 
    apiKey: '', 
    formatter: null        
};

exports.importExcel = async function (req, res) {
    req.setTimeout(0);
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
                return res.status(400).send({ msg: "API key required" })
            }
            geoCodeOptions.apiKey = req.query.key;
            var geocoder = NodeGeocoder(geoCodeOptions);
            /**
             *  get candidate excel data in order
             */
            let iterator = 1;
            let unknownCoordsLocation = [];
            for (let candidate of result) {
                if (candidate.phone == null || candidate.phone == "") {
                    continue;
                }

                if(candidate.occupationOne == 'Fitter General'){
                    candidate.occupationOne = 'General Fitter'
                }
                else if (candidate.occupationOne == 'Teacher/Principal') {
                    candidate.occupationOne = 'Teacher'
                }
                else if (candidate.occupationOne == 'Management/HR Field' || candidate.occupationOne == 'Management/HR Feild') {
                    candidate.occupationOne = 'HR Officer'
                }
                else if (candidate.occupationOne == 'Fitter') {
                    candidate.occupationOne = 'General Fitter'
                }
                else if (candidate.occupationOne == 'Any Job') {
                    candidate.occupationOne = 'Any job'
                }
                else if (candidate.occupationOne == 'Heating Ventilation air conditioning and Refrigeration (HVACR)') {
                    candidate.occupationOne = 'Heating Ventilation air conditioning and Refrigeration(HVACR)'
                }
                else if (candidate.occupationOne == 'electrician') {
                    candidate.occupationOne = 'Electrician'
                }
                else if (candidate.occupationOne == 'sales/Marketing') {
                    candidate.occupationOne = 'Sales/Marketing'
                }
                else if (candidate.occupationOne == 'fabricator') {
                    candidate.occupationOne = 'Fabricator'
                }

                if (candidate.occupationTwo == 'Fitter General') {
                    candidate.occupationTwo = 'General Fitter'
                }
                else if (candidate.occupationTwo == 'Teacher/Principal') {
                    candidate.occupationTwo = 'Teacher'
                }
                else if (candidate.occupationTwo == 'Management/HR Field') {
                    candidate.occupationTwo = 'HR Officer'
                }
                else if (candidate.occupationTwo == 'Fitter') {
                    candidate.occupationTwo = 'General Fitter'
                }
                else if (candidate.occupationTwo == 'Any Job') {
                    candidate.occupationTwo = 'Any job'
                }
                else if (candidate.occupationTwo == 'Heating Ventilation air conditioning and Refrigeration (HVACR)') {
                    candidate.occupationTwo = 'Heating Ventilation air conditioning and Refrigeration(HVACR)'
                }
                else if (candidate.occupationTwo == 'electrician') {
                    candidate.occupationTwo = 'Electrician'
                }
                else if (candidate.occupationTwo == 'sales/Marketing') {
                    candidate.occupationTwo = 'Sales/Marketing'
                }
                else if (candidate.occupationTwo == 'fabricator') {
                    candidate.occupationTwo = 'Fabricator'
                }
                

                candidate.phone = candidate.phone.split('-').join('');

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

                let hasOtherSkill = false;
                if (allowedOccupations.indexOf(candidate.occupationOne) == -1) {
                    if ((candidate.occupationTwo != null && candidate.occupationTwo != "") &&
                        allowedOccupations.indexOf(candidate.occupationTwo) != -1) {
                        candidate.occupationOne = candidate.occupationTwo; //occupation not in required list of occupations
                        candidate.experienceOne = candidate.experienceTwo;
                        candidate.occupationTwo = 'Other';
                    }
                    else {
                        continue;
                    }
                }
                if ((allowedOccupations.indexOf(candidate.occupationOne) != -1) &&
                    (candidate.occupationTwo != null && candidate.occupationTwo != "") &&
                    (allowedOccupations.indexOf(candidate.occupationTwo) == -1)) {
                    candidate.occupationTwo = 'Other';
                }

                let findCoordinatesFor;
                let area; 
                if(candidate.location != null && candidate.location != ''){
                    findCoordinatesFor = candidate.location + ", " + candidate.city;
                    area = candidate.location
                }
                else{
                    findCoordinatesFor = candidate.city;
                }
                let coords = await geocoder.geocode(findCoordinatesFor);
                if (!coords[0]){
                    unknownCoordsLocation.push(candidate.location + ', ' + candidate.city);
                    continue;
                }
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
                    primarySkill: candidate.occupationOne,
                    employmentStatus: candidate.employmentStatus,
                    hasOtherSkill: hasOtherSkill,
                    area: area
                });
                let savedCandidate = await newCandidate.save();

                let newCriteria = new Criteria({
                    occupation: candidate.occupationOne, 
                    experience: candidate.experienceOne,
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

                if (candidate.occupationTwo != null && candidate.occupationTwo != "" && candidate.occupationTwo != 'Other'){
                    let secondCriteria = new Criteria({
                        occupation: candidate.occupationTwo,
                        experience: candidate.experienceTwo,
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
                    await secondCriteria.save();

                }
                console.log("Candidate " + iterator++ + " saved");
            }
            res.send({
                msg: "Candidates saved!",
                unknownCoordsLocation: unknownCoordsLocation.length,
                unknownCoordsLocation
            })
        }
        else {
            
            /**
             * remove empty excel cells, remove eduction if not in list
             */
            let phNumbers = [];
            for (var n = 0; n < result.length; n++) {
                if (result[n].phone == null || result[n].phone == ""){
                    result.splice(n, 1);
                    n--;
                    continue;
                }
                else{
                    /**
                     * possible phone number validation
                     */
                    result[n].phone = result[n].phone.split('-').join('');
                    // if (result[n].phone.length != 13)
                    // {
                    //     result.splice(n, 1);
                    //     n--;
                    //     continue;
                    // }
                }
                if (allowedEducations.indexOf(result[n].education) == -1) {
                    delete result[n].education; //education not in required list of educations
                }
                phNumbers.push(result[n].phone);
            }

            /**
             * Check if candidates already exist in DB by phone numbers
             */
            let candidates = await BulkCandidate.find({ phone: { $in: phNumbers }});
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
                    if (candidates[i].phone == result[j].phone) {
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

exports.getBulkCandiesByStatus = async function(req, res) {
    let status = req.params.statusType == "true" ? true : false;
    try{
        let bulkCandies = await BulkCandidate.find({status: status});
        if (bulkCandies.length == 0) {
            return res.status(404).send({
                message: "Bulk Candidates with status " + status + " not found"
            })
        }
        res.send({
            bulkcandidates :bulkCandies
        });
    } catch (err) {
        return res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.filterCandidates = async function (req, res) {
    let query = req.body.query;
    try {
        let candyQquery = { $and: [] };
        if (query.phone) {
            candyQquery.$and.push({ phone: query.phone })
        }
        if (query.cnic) {
            candyQquery.$and.push({ cnic: query.cnic })
        }
        if (query.callStatus) {
            candyQquery.$and.push({ callStatus: query.callStatus })
        }
        if (query.fullName) {
            let fullName = query.fullName;
            candyQquery.$and.push({ fullName: { $regex: new RegExp("^" + fullName + '$', "i") } });
        }
        let candidates = await BulkCandidate.find(candyQquery);
        if (candidates.length == 0) {
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