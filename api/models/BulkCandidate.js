'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var BulkCandidateSchema = new schema({

    fullName: String,
    cnic: String,
    phone: String,
    dob: Date,
    skills: [String], //should be enum
    education: [Number], //should be enum
    training: String, //should be enum
    experience: Number, //years of expereince
    city: String, //should be enum
    email: String,
    status: Boolean //in system or not
});

const Candidate = module.exports = mongoose.model('bulkcandidate', BulkCandidateSchema);
