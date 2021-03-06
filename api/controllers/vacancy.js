'use strict';

const Vacancy = require('../models/Vacancy');
const Employer = require('../models/Employer');
const Criteria = require('../models/CandidateMatchingCriteria');
const Candidate = require('../models/Candidate');

exports.createVacancyForEmployer = async function (req, res) {

    try {
        let employer = await Employer.findById(req.params.employerId);
        if (!employer) {
            return res.status(404).send({
                message: "Employer not found with id " + req.params.employerId
            });
        }
        let newVacancy = new Vacancy(req.body);
        newVacancy.employer = req.params.employerId;
        let savedVacancy = await newVacancy.save();
        res.send(savedVacancy);

    } catch (err) {
        res.send(err);
    }
}

exports.findVacanciesForEmployer = async function (req, res) {

    try {
        let employer = await Employer.findById(req.params.employerId);
        if (!employer) {
            return res.status(404).send({
                message: "Employer not found with id " + req.params.employerId
            });
        }
        let vacancies = await Vacancy.find({ employer: req.params.employerId }).populate('employer');
        if (vacancies.length == 0) {
            return res.status(404).send({
                message: "Vacancies not found for this employer "
            });
        }
        res.send(vacancies);
    } catch (err) {
        res.send(err);
    }
}

exports.createTentativeCandidateShortlist = async function (req, res) {

    try {
        let vacancyId = req.params.vacancyId;
        let vacancy = await Vacancy.findById(vacancyId, {
            gender: 1, location: 1, occupation: 1, city: 1, experience: 1, educationRequirement: 1
        });
        if (!vacancy) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        let shortListQuery = { $and: [] };
        if (vacancy.occupation == 'Any') {
            if (req.query.education == undefined && req.query.gender == undefined &&
                req.query.location == undefined && req.query.experience == undefined
                && req.query.city == undefined) {
                return res.status(400).send({
                    message: "No criteria selected for shortlist; Vacancy occupation is Any"
                });
            }
        }
        else {
            //default matching
            shortListQuery.$and.push({ $or: [{ occupation: vacancy.occupation }, { occupation: "Any job" }] });
        }
        /**
         * Creating Query for Candidate shortlist based on params (req.query)
         */
        let genderQuery = [];

        if (req.query.experience != undefined) {
            shortListQuery.$and.push({ experience: { $gte: vacancy.experience } });
        }
        if (req.query.city != undefined) {
            shortListQuery.$and.push({ 'city': vacancy.city });
        }
        if (req.query.gender != undefined) {
            if (vacancy.gender == "Any") {
                genderQuery.push("Male");
                genderQuery.push("Female");
            }
            else {
                genderQuery.push(vacancy.gender);
            }
            shortListQuery.$and.push({ gender: { $in: genderQuery } });
        }
        if (req.query.education != undefined) {
            shortListQuery.$and.push({ education: { $gte: vacancy.educationRequirement } });
        }
        /**
         * paging 
         */
        var paging = {};

        var page = parseInt(req.query.page);
        var limit = parseInt(req.query.limit);

        if (page < 0 || page === 0)
            page = 1;

        paging.skip = limit * (page - 1);
        paging.limit = limit;

        if (!shortListQuery.$and.length) {
            shortListQuery = {}
        }
        let documentCount = await Criteria.countDocuments(shortListQuery);
        let pageCount = Math.ceil(documentCount / limit);

        /**
         *  Query candidates model:
         *  Don't search for canidates who are already in the shortlist
         *  Don't search for candidates according to employment status
         */

        let excludedCandidatesQuery = { $or: [] };
        if (req.query.employmentStatus != undefined) {
            let employmentStatusVal = req.query.employmentStatus == "true" ? false : true;
            excludedCandidatesQuery.$or.push({ employmentStatus: employmentStatusVal });
        }
        excludedCandidatesQuery.$or.push({ 'vacancyStatus.vacancy': vacancyId });
        let excludedCandidates = await Candidate.find(excludedCandidatesQuery).distinct('_id');
        if (excludedCandidates.length != 0) {
            shortListQuery.$and.push({ candidate: { $nin: excludedCandidates } });
        }

        /**
         * Aggregation: calculating distance from vacancy, 
         * sorting candidates based on weights
         * assigned to education, experience and location
         */

        let aggregateOperation = [];
        if (req.query.location != undefined) {
            aggregateOperation.push({
                $geoNear: {
                    near: { type: "Point", coordinates: vacancy.location.coordinates },
                    distanceMultiplier: 0.001,
                    distanceField: "distanceFromVacancy",
                    query: shortListQuery,
                    spherical: true
                }
            })
        }
        else {
            aggregateOperation.push({ $match: shortListQuery });
        }

        /**
         * sort based on single criteria (can be education, experience, gender)
         */
        if (req.query.sort != undefined) {
            if (req.query.sort != 'location') {
                let sortObj = {
                    $sort: { [req.query.sort]: -1 }
                }
                aggregateOperation.push(sortObj);
            }
        }

        /**
         * Weighted query can only run if sort not defined
         * i.e. you can only do weighted OR sort query
         */
        if (req.query.sort == undefined && req.query.weighted != undefined) {
            let candidateProjection = {
                candidate: 1,
                location: 1,
                education: 1,
                city: 1,
                isTrained: 1,
                employer: 1,
                experience: 1,
                occupation: 1,
                gender: 1,
                distanceFromVacancy: 1
            }
            let projectIndividualScores = {
                ...candidateProjection,
                experienceScore: {},
                educationScore: {},
                locationScore: {}
            };
            let projectCombinedScore = {
                ...candidateProjection,
                score: {
                    $add: []
                }
            }
            if (req.query.experience) {
                let experienceScoreField = {
                    $multiply: ["$experience", parseFloat(req.query.experience)]
                }
                projectIndividualScores.experienceScore = experienceScoreField;
                projectCombinedScore.score.$add.push('$experienceScore');
            }
            else {
                delete projectIndividualScores.experienceScore;
            }
            if (req.query.education) {
                let educationScoreField = {
                    $multiply: ["$education", parseFloat(req.query.education)]
                }
                projectIndividualScores.educationScore = educationScoreField;
                projectCombinedScore.score.$add.push('$educationScore');
            }
            else {
                delete projectIndividualScores.educationScore;
            }
            if (req.query.location) {
                /**
                 * Location is given a score based on y = mx + c
                 * m in our case is -0.025 (considering y intercept, c = 10 
                 * and x intercept = 400). X axis is distance, y is calculated 
                 * (score for location)
                 */
                let locationScoreField = {
                    $multiply: [
                        {
                            $add:
                                [
                                    {
                                        $multiply:
                                            ["$distanceFromVacancy", -0.025]
                                    }, 10]
                        }, parseFloat(req.query.location)]
                }
                projectIndividualScores.locationScore = locationScoreField;
                projectCombinedScore.score.$add.push('$locationScore');
            }
            else {
                delete projectIndividualScores.locationScore;
            }
            aggregateOperation.push({
                $project: projectIndividualScores
            },
                {
                    $project: projectCombinedScore
                },
                {
                    $sort: { 'score': -1 }
                }
            );
        }
        if (req.query.page != undefined && req.query.limit != undefined)
            aggregateOperation.push({ $skip: paging.skip }, { $limit: paging.limit });
        let shortListCriteria = await Criteria.aggregate(aggregateOperation);
        let shortListCandidates = await Criteria.populate(shortListCriteria, { path: "candidate" });
        res.send({
            criteriaToMatch: vacancy, //temporary
            pages: pageCount,
            candidates: shortListCandidates
        });

    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.createCandidateShortlist = async function (req, res) {
    try {
        let candidateIds = req.body.candidateIds;
        let candidateScores = req.body.candidateScores;
        let vacancyId = req.params.vacancyId;
        let vacancy = await Vacancy.findById(vacancyId);
        if (!vacancy) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        candidateIds = await Candidate.find({$and: [{_id: {$in: candidateIds}}, {'vacancyStatus.vacancy': {$ne: vacancyId}}]}).distinct('_id');
        if(candidateIds.length == 0){
            return res.status(400).send({
                message: "Candidates already shortlisted for vacancy"
            });
        }
        if (!candidateScores || candidateScores.length == 0) {
            let candidateVacancyStatus = {
                vacancy: vacancyId,
                status: "Schedule Interview"
            }
            let shortlist = await Candidate.updateMany({ _id: { $in: candidateIds } },
                { $push: { vacancyStatus: candidateVacancyStatus } });
            return res.send(shortlist);
        }

        /**
         * if request has scores, then candidate scores need to be saved 
         * in vacancy status field of candidate model 
         */
        for (let i = 0; i < candidateIds.length; i++) {
            let candidateVacancyStatus = {
                vacancy: vacancyId,
                status: "Schedule Interview",
                score: candidateScores[i]
            }
            await Candidate.updateOne({ _id: candidateIds[i] },
                { $push: { vacancyStatus: candidateVacancyStatus } });
        }

        return res.send({
            success: true
        });

    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.findVacancyShortlist = async function (req, res) {
    try {
        let vacancyId = req.params.vacancyId;
        let occupationName = req.params.occupation.split('$').join('/');
        let vacancy = await Vacancy.findById(vacancyId);
        if (!vacancy) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        let candidateQuery = {
            'vacancyStatus.vacancy': vacancyId
        };
        if (req.query.status) {
            candidateQuery = {
                "vacancyStatus": {
                    $elemMatch: {
                        vacancy: vacancyId,
                        status: req.query.status
                    }
                }
            }
        }
        let candidates = await Candidate.find(candidateQuery, { _id: 1 });
        let findQuery = {
            $and: [{ candidate: { $in: candidates } }]
        }
        let occupationQuery = {
            $or: [{ occupation: occupationName }, { occupation: 'Any job' }]
        }
        findQuery.$and.push(occupationQuery);
        let candidatesWithCriteria = await Criteria.find(findQuery)
            .populate('candidate');
        res.send(candidatesWithCriteria);

    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.updateStatusForCandidatesInAVacancy = async function (req, res) {
    try {
        let status = req.body.status;
        let candidateIds = req.body.ids;
        if (!status) {
            return res.status(400).send({
                message: "Update status not provided"
            });
        }
        let vacancyId = req.params.vacancyId;
        let vacancy = await Vacancy.findById(vacancyId);
        if (!vacancy) {
            return res.status(404).send({
                message: "Vacancy not found with id " + req.params.vacancyId
            });
        }
        if (vacancy.openings == 0) {
            return res.status(400).send({
                message: "Vacancy already filled"
            });
        }
        let checkCandidateQuery = {
             _id: { $in: candidateIds }, vacancyStatus: {
                $elemMatch: {
                    vacancy: vacancyId,
                    status: { $ne: status } }
                }
            
        }
        // because status Interview Scheduled can be updated with date
        if(status == 'Interview Scheduled'){
            delete checkCandidateQuery.vacancyStatus.$elemMatch.status
        }
        let checkCandidates = await Candidate.find(checkCandidateQuery);
        if (checkCandidates.length == 0) {
            return res.send({
                message: "Candidates already have this status"
            });
        }
        if (status == 'Joined' && vacancy.openings < checkCandidates.length) {
            return res.send({
                message: "Not enough openings for vacancy"
            });
        }
        let interviewDate;
        if (req.body.interviewDate) {
            interviewDate = req.body.interviewDate;
        }
        else {
            interviewDate = Date.now();
        }
        let candidates = await Candidate.updateMany({ _id: { $in: candidateIds }, 'vacancyStatus.vacancy': vacancyId },
            {
                '$set': {
                    'vacancyStatus.$.status': status,
                    'vacancyStatus.$.interviewDate': interviewDate
                }
            }, { new: true });

        if (status == "Joined") {
            for (let candidate of checkCandidates) {
                candidate.employmentStatus = true;
                candidate = await candidate.save();
            }
            vacancy.hired += checkCandidates.length;
            vacancy.openings -= checkCandidates.length;

            if (vacancy.openings == 0) {
                vacancy.status = 'Completed';
            }
            let status = vacancy.status;

            await Vacancy.findOneAndUpdate({ _id: vacancy._id }, {  hired: vacancy.hired, openings: vacancy.openings, status: status });
        }
        res.send(candidates);
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.updateStatusForVacancies = async function (req, res) {
    let vacancyIds = req.body.vacancyIds;
    let status = req.params.status;
    try {
        for (let singleVacancyId of vacancyIds) {
            await Vacancy.findOneAndUpdate({ _id: singleVacancyId }, { status: status });
        }
        res.send({
            message: "Status updated"
        })
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.getVacanciesByStatus = async function (req, res) {
    let status = Vacancy.schema.path('status').enumValues[parseInt(req.params.statusId)];
    try {
        let vacancies = await Vacancy.find({ status: status });
        if (vacancies.length == 0) {
            return res.status(404).send({
                message: "Vacancies with status " + status + " not found"
            })
        }
        res.send(vacancies);
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.getVacanciesWithEmployerInfo = async function (req, res) {
    try {
        let vacancies = await Vacancy.find().populate("employer");
        if (vacancies.length == 0) {
            return res.status(404).send({
                message: "No Vacancies found"
            })
        }
        res.send(vacancies);
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}
