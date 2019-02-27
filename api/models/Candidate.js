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
    employmentStatus: Boolean,
    vacancyStatus: [{
        vacancy: { type: schema.Types.ObjectId, ref: 'vacancy' },
        status: String, //initial status: not contacted, then schedule interview', then 'interview scheduled', then 'interviewed', 'rejected', 'hired', 'joined'
        interviewDate: Date //if status is 'interview scheduled', then use this
    }]
});

const candidate = module.exports = mongoose.model('candidate', CandidateSchema);

module.exports.getCandidateByCnic = function (cnic) {
    const query = {
        cnic: cnic
    };

    return candidate.findOne(query);
}
