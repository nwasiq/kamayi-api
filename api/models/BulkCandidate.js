'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var BulkCandidateSchema = new schema({

    status: { //false if not inserted to candidate model, true otherwise
        type: Boolean,
        default: false
    },
    callStatus: {
        type: String,
        enum: ['Not Called', 'Not Answered', 'Wrong Number', 'Call Back', 'Not Interested', 'Switched Off'],
        default: 'Not Called'
    },
    callCenterInfo: {
        user: {
            type: schema.Types.ObjectId, 
            ref: 'user' 
        },
        dateOfEntry: Date,
    },
    createdAt: Date,
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
