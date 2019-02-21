'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var CandidateSchema = new schema({

    fullName: String,
    cnic: Number,
    phone: String,
    dob: Date,
    skills: [String], //should be enum
    education: Number, //should be enum
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

const candidate = module.exports = mongoose.model('candidate', CandidateSchema);

module.exports.getCandidateByCnic = function (cnic, callback) {
    const query = {
        cnic: cnic
    };

    candidate.findOne(query, callback);
}
