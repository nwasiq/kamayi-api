'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var CandidateSchema = new schema({

    fullName: String,
    cnic: String,
    phone: String,
    dob: Date,
    skills: [String], //should be enum
    education: [Number], //should be enum
    training: String, //should be enum
    experience: Number, //years of expereince
    location: {
        lat: Number,
        long: Number,
        city: String //should be enum
    },
    email: String,
    employmentStatus: Boolean
});

const Candidate = module.exports = mongoose.model('candidate', CandidateSchema);
