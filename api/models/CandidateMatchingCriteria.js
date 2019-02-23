'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var MatchingCriteriaSchema = new schema({

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Any']
    },
    occupation: String, //should be enum
    experience: Number,
    employer: String,
    isTrained: Boolean,
    location: { 
        lat: Number,
        long: Number,
        city: String //should be enum
    },
    education: String, //should be enum
    candidate: {
        type: schema.Types.ObjectId, ref: 'candidate'
    } 
});

const criteria = module.exports = mongoose.model('criteria', MatchingCriteriaSchema);

