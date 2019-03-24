'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var EmployerSchema = new schema({

    fullName: String,
    email: String,
    pocPhone: String,
    pocDesignation: String,
    pocAddress: String,
    companyName: String,
    companyPhone: String,
    industry: String, //should be enum
    website: String,
    location: [{
        lat: Number,
        long: Number,
        city: String
    }],
    placementOfficer: {
        type: schema.Types.ObjectId, ref: 'user'
    }
});

/**
 * @todo: if employer is deleted, remove all his vacancies
 * @todo: before update, check if placementOfficer is actually placement
 */

const employer = module.exports = mongoose.model('employer', EmployerSchema);

module.exports.getEmployerByCompanyName = function (company) {
    const query = {
        companyName: company
    };

    return employer.findOne(query);
}
