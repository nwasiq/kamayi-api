'use strict';

const Report = require('../models/Report');
const schedule = require('node-schedule');
const moment = require('moment');
const Candidate = require('../models/Candidate');
const BulkCandidate = require('../models/BulkCandidate');

/**
 * Need to schedule job 1 pm every day according to eastern time (us-east-1)
 * which means that the job will run on 10 pm every day according to PK time
 * '13 * * *'
 */
let dailyCCReportSignUpsJob = schedule.scheduleJob('19 03 * * *', async function () {
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

let dailyCCReportCallStatusJobs = schedule.scheduleJob('29 04 * * *', async function () {
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

exports.getCCReportSignupsByDate = async function(req, res){

}

exports.getCCReportCallStatusByDate = async function (req, res) {

}