'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var ReportSchema = new schema({
    role: {
        type: String,
        enum: ['callCenter', 'placement']
    },
    date: Date,
    callCenter: {
        reportType: {
            type: String,
            enum: ['signups', 'callStatus']
        },
        signups: [Object],
        callStatus: Object
    },
    placement: {
        vacancyId: {
            type: schema.Types.ObjectId,
            ref: 'vacancy'
        },
        vacancyStatus: Object
    }
});

module.exports = mongoose.model('report', ReportSchema);