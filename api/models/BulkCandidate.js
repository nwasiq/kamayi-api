'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var BulkCandidateSchema = new schema({

    fullName: String,
    cnic: String,
    phone: String,
    dob: Date,
    education: String, //should be enum
    training: String, //should be enum
    experience: Number, //years of expereince
    city: String, //should be enum
    email: String,
    inSystem: String //in system or not
});

const Candidate = module.exports = mongoose.model('bulkcandidate', BulkCandidateSchema);
