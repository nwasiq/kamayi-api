'use strict';

const Occupation = require('../models/Occupation');

exports.bulkInsert = async function(req, res) {
    let occupations = req.body.occupations;
    let occupationObjs = [];
    for(let occupation of occupations){
        occupationObjs.push({
            name: occupation
        });
    }
    try{
        let insertedOccupations = await Occupation.insertMany(occupationObjs);
        res.send(insertedOccupations);
    } catch (err) {
        return res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}