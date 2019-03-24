'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var VacancySchema = new schema({

    title: String,
    occupation: String, //should be enum
    description: String,
    city: String, //should be enum
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    salary: Number,
    openings: {
        type: Number,
        required: true
    },
    hired: {
        type: Number,
        default: 0
    },
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

// VacancySchema.pre('remove', async function(){
//     const CandidateModel = mongoose.model('candidate');
//     await CandidateModel.updateMany({ 'vacancyStatus.vacancy': req.params.vacancyId },
//         { $set: { vacancyStatus: { status: "Status TBD" } } })
// });

/**
 * @todo: if vacancy deleted, remove vacancy reference from candidates ()
 * This is already being done in delete vacancy function
 */

VacancySchema.index({ location: '2dsphere' });

const vacancy = module.exports = mongoose.model('vacancy', VacancySchema);
