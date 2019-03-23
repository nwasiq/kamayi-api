'use strict';

const Employer = require('../models/Employer');

/**
 * @todo: add this for employer create in crud controller:
 *  let employer = await Employer.getEmployerByCompanyName(newEmployer.companyName);
        if (employer) {
            return res.status(400).send({
                message: "Employer with this company name already exists"
            });
        }
 */

/**
 * @todo: add this to update of employer in crud controller:
 * if (req.user.role != 'admin' && updatedEmployerFields.placementOfficer != undefined) {
        delete updatedEmployerFields.placementOfficer;
        updateMessage = "Placement officer not updated, only an Admin can do that. Other fields, if entered, updated";
    }
 */
