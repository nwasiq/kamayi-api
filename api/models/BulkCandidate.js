'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var BulkCandidateSchema = new schema({

    status: {
        type: Boolean,
        default: false
    },
    fullName: String,
    cnic: String,
    phone: String,
    dob: Date,
    education: String, //should be enum
    training: String, //should be enum
    experience: Number, //years of expereince
    city: String, //should be enum
    email: String,
    primarySkill: String
});

const Candidate = module.exports = mongoose.model('bulkcandidate', BulkCandidateSchema);
