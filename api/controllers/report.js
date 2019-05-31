'use strict';

const Report = require('../models/Report');
const schedule = require('node-schedule');
const moment = require('moment');
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const BulkCandidate = require('../models/BulkCandidate');
const Vacancy = require('../models/Vacancy');

/**
 * Need to schedule job 5pm every day according to eastern time (us-east-1)
 * which means that the job will run on 10pm every day according to PK time
 * '17 * * *'
 */
let dailyCCReportSignUpsJob = schedule.scheduleJob('17 * * *', async function () {
    console.log('Executing CC Signups report');
    try {
        let signupReport = await Candidate.aggregate([
            {
                $match: {
                    'createdBy.dateCreated': { $gte: moment().subtract(48, 'h').toDate() } // the number indicates the hours
                },
            },
            {
                $group: { _id: "$createdBy.user", count: { $sum: 1 } }
            }
        ])
        if(signupReport.length != 0){
            let ccUsers = await Candidate.populate(signupReport, { path: "_id", model: User })
            let reportObjs = [];
            for (let user of ccUsers) {
                reportObjs.push({
                    name: user._id.fullName,
                    email: user._id.email,
                    candidatesCreated: user.count
                });
            }
            let newReport = new Report({
                role: 'callCenter',
                date: new Date(),
                callCenter: {
                    reportType: 'signups',
                    signups: reportObjs
                }
            })
            await newReport.save()
        }
    } catch (err) {
        console.log(err);
    }
});

let dailyCCReportCallStatusJobs = schedule.scheduleJob('17 * * *', async function () {
    console.log('Executing CC Call status Report');
    try {
        let currentCallStatusCounts = await BulkCandidate.aggregate([
            {
                $group: { _id: '$callStatus', count: { $sum: 1 } }
            }
        ])
        let callStatusObj = {}
        for (let i = 0; i < currentCallStatusCounts.length; i++) {
            callStatusObj[currentCallStatusCounts[i]._id] = currentCallStatusCounts[i].count;
        }
        let newReport = new Report({
            role: 'callCenter',
            date: new Date(),
            callCenter: {
                reportType: 'callStatus',
                callStatus: callStatusObj
            }
        })
        await newReport.save()
    } catch (err) {
        console.log(err);
    }
});

let dailyPlacementReport = schedule.scheduleJob('41 04 * * *', async function () {
    console.log('Executing Placement status Report');
    try {
        let vacancyIdList = await Vacancy.find().distinct('_id');
        for (let j = 0; j < vacancyIdList.length; j++) {
            let vacancy = await Vacancy.findById(vacancyIdList[j]);
            let vacancyStatusReport = await Candidate.aggregate([
                {
                    $unwind: '$vacancyStatus'
                },
                {
                    $match: { 'vacancyStatus.vacancy': vacancy._id }
                },
                {
                    $group: { _id: '$vacancyStatus.status', count: { $sum: 1 } }
                }
            ]);
            if (vacancyStatusReport.length != 0) {
                let vacancyStatusObj = {};
                for (let i = 0; i < vacancyStatusReport.length; i++) {
                    vacancyStatusObj[vacancyStatusReport[i]._id] = vacancyStatusReport[i].count;
                }
                let newReport = new Report({
                    role: 'placement',
                    date: new Date(),
                    placement: {
                        vacancyId: vacancy._id,
                        vacancyStatus: vacancyStatusObj
                    }
                })
                await newReport.save()
            }
        }
    } catch (err) {
        console.log(err);
    }
});

exports.getCCReportByDate = async function(req, res){
    let reportType = req.params.reportType;
    let start = new Date(parseInt(req.body.year), parseInt(req.body.month), parseInt(req.body.day));
    let end = new Date(parseInt(req.body.year), parseInt(req.body.month), parseInt(req.body.day) + 1);
    try{
        let projection = reportType == 'signups' ? { 'callCenter.signups': 1 } : { 'callCenter.callStatus': 1 };
        let reports = await Report.findOne(
            { 
                role: 'callCenter', 
                'callCenter.reportType': reportType, 
                date: { $gte: start, $lt: end } 
            }, 
            projection
        );
        if(!reports){
            return res.send({
                message: "No report for the date found"
            })
        }
        res.send(reports)
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.getPlacementReportByDate = async function(req, res){
    let vacancyId = req.params.vacancyId;
    let start = new Date(parseInt(req.body.year), parseInt(req.body.month), parseInt(req.body.day));
    let end = new Date(parseInt(req.body.year), parseInt(req.body.month), parseInt(req.body.day) + 1);
    try{
        let vacancy = await Vacancy.findById(vacancyId);
        if(!vacancy){
            return res.status(404).send({
                message: "No vacancy found for provided ID"
            })
        }
        let reports = await Report.findOne(
            {
                role: 'placement',
                'placement.vacancyId': vacancy._id,
                date: { $gte: start, $lt: end }
            },
            {
                'placement.vacancyStatus': 1
            }
        );
        if (!reports) {
            return res.send({
                message: "No report for the date found"
            })
        }
        res.send(reports)
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}