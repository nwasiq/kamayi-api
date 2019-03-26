'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var OccupationSchema = new schema({
    name: String
});

module.exports = mongoose.model('occupation', OccupationSchema);