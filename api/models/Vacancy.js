'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var VacancySchema = new schema({

    title: String,
    description: String,
    location: {
        lat: Number,
        long: Number,
        city: String //should be enum
    },
    salary: Number,
    openings: Number,
    hired: Number,
    shortlist: [{ //not automated, selection after matching query (people won't removed)
        candidate: { type: schema.Types.ObjectId, ref: 'candidate' },
        status: String, //initial status: not applied, then schedule interview', then 'interview scheduled', then 'interviewed', 'hired', 'rejected'
        interviewDate: Date //if status is 'interview scheduled', then use this
    }],
    jobType: {
        type: String,
        enum: ['fullTime', 'partTime']
    },
    startDate: Date,
    experience: Number, //years
    trainingPeriod: Number, //months
    ageRange: {
        minAge: Number,
        maxAge: Number
    }, //maximum allowed age
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Any']
    },
    benefits: {
        insurance: Boolean,
        transportation: Boolean,
        accomodation: Boolean,
        food: Boolean,
        socialSecurity: Boolean
    },
    employer: {
        type: schema.Types.ObjectId, ref: 'employer'
    }

});

const vacancy = module.exports = mongoose.model('vacancy', VacancySchema);
