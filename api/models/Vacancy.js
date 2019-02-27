'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var VacancySchema = new schema({

    title: String,
    occupation: String, //should be enum
    description: String,
    location: {
        lat: Number,
        long: Number,
        city: String //should be enum
    },
    salary: Number,
    openings: Number,
    hired: Number,
    jobType: {
        type: String,
        enum: ['fullTime', 'partTime']
    },
    startDate: Date,
    experience: Number, //years
    educationRequirement: Number, //should be enum,
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
