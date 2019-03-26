'use strict';

const Employer = require('../models/Employer');

exports.getUnassignedEmployers = async function(req, res){
    try{
        let employers = await Employer.find({ placementOfficer: { $exists: false } });
        res.send(employers);
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}