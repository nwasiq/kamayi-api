'use strict';

const BulkCandidate = require('../models/BulkCandidate');
const fileUpload = require('../services/FileUploadService');
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
var fs = require('fs');

exports.importExcel = function (req, res) {
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
                /**
                 * Check if candidates already exist in DB by cnic numbers
                 */
                let cnicNumbers = [];
                for(let candidate of result){
                    cnicNumbers.push(candidate.cnic);
                }
                BulkCandidate.find({cnic: {$in: cnicNumbers}}, (err, candidates) => {
                    let message;
                    if(candidates.length){
                        if(candidates.length == result.length){
                            return res.status(400).send({
                                message: "All candidates in this list are already in the DB",
                            });
                        }
                        message = candidates.length + " candidates in this list are already in the DB";
                    }
                    else{
                        message = "success";
                    }
                    /**
                     * remove candidates that are already in DB
                     */
                    for (var i = 0; i< candidates.length; i++){
                        for(var j = 0; j < result.length; j++){
                            if (candidates[i].cnic == result[j].cnic){
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
        let excelCandidates = await BulkCandidate.find();
        if(!excelCandidates.length){
            res.status(404).send({
                message: "No bulk candidates found"
            })
        }
        res.send(excelCandidates);
    } catch (err) {
        res.status(500).send({
            message: "An error occurred",
            err: err
        })
    }
}