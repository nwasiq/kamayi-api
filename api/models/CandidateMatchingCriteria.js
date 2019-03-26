'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var occupationList = require('../enums/occupation');

var MatchingCriteriaSchema = new schema({

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Any']
    },
    occupation: {
        type: String,
        enum: occupationList
    },
    experience: Number,
    employer: String,
    isTrained: Boolean,
    city: String, //should be enum
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        }
    },
    education: Number, //should be enum
    candidate: {
        type: schema.Types.ObjectId, ref: 'candidate'
    } 
});

MatchingCriteriaSchema.index({ location: '2dsphere' });
const criteria = module.exports = mongoose.model('criteria', MatchingCriteriaSchema);

