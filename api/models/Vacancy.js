'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var VacancySchema = new schema({

    //pending verification status for when placement user archives vacancy (removes vacancy from his list)
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Pending Verification', 'Archived'],
        default: 'Active'
    },
    title: String,
    occupation: String,
    description: String,
    city: String, //should be enum
    area: String,
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
    totalSlots: Number,
    jobType: {
        type: String,
        enum: ['fullTime', 'partTime']
    },
    dateCreated: Date,
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
    },
    pocNumber: String,
    designation: String

});

// VacancySchema.pre('remove', async function(){
//     const CandidateModel = mongoose.model('candidate');
//     await CandidateModel.updateMany({ 'vacancyStatus.vacancy': req.params.vacancyId },
//         { $set: { vacancyStatus: { status: "Status TBD" } } })
// });

VacancySchema.pre('save', async function(){
    this.dateCreated = Date.now();
});

/**
 * @todo: if vacancy deleted, remove vacancy reference from candidates ()
 * This is already being done in delete vacancy function
 */

VacancySchema.index({ location: '2dsphere' });

const vacancy = module.exports = mongoose.model('vacancy', VacancySchema);
