'use strict';

const Report = require('../models/Report');
const schedule = require('node-schedule');
const moment = require('moment');
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const BulkCandidate = require('../models/BulkCandidate');

/**
 * Need to schedule job 1 pm every day according to eastern time (us-east-1)
 * which means that the job will run on 10 pm every day according to PK time
 * '13 * * *'
 */
let dailyCCReportSignUpsJob = schedule.scheduleJob('35 06 * * *', async function () {
    console.log('Executing Signups report');
    try {
        let signupReport = await Candidate.aggregate([
            {
                $match: {
                    'createdBy.dateCreated': { $gte: moment().subtract(24, 'h').toDate() } // the number indicates the hours
                },
            },
            {
                $group: { _id: "$createdBy.user", count: { $sum: 1 } }
            }
        ])
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
    } catch (err) {
        console.log(err);
    }
});

let dailyCCReportCallStatusJobs = schedule.scheduleJob('35 06 * * *', async function () {
    console.log('Executing Call status Report');
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

exports.getCCReportByDate = async function(req, res){
    let reportType = req.body.reportType;
    let start = new Date(parseInt(req.body.year), parseInt(req.body.month), parseInt(req.body.day));
    let end = new Date(parseInt(req.body.year), parseInt(req.body.month), parseInt(req.body.day) + 1);
    try{
        let projection = reportType == 'signups' ? { 'callCenter.signups': 1 } : { 'callCenter.callStatus': 1 };
        let reports = await Report.find(
            { 
                role: 'callCenter', 
                'callCenter.reportType': reportType, 
                date: { $gte: start, $lt: end } 
            }, 
            projection
        );
        if(reports.length == 0){
            return res.send({
                msg: "No report for the date found"
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