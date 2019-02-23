'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var CandidateSchema = new schema({

    fullName: String,
    cnic: Number,
    phone: String,
    dob: Date,
    training: [String],
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
