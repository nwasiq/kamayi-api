'use strict';

const mongoose = require('mongoose');

function extractModelFromEndpoint(endPoint, hasId){
    if(!hasId){
        /**
         * remove first '/' and last 's'
         * e.g: /users returns user
         * if end point contains params, remove string after '?'
         * /users?role='role' will return user
         */
        if(endPoint.indexOf('?') >= 0){
            return endPoint.substr(1, endPoint.slice(1).indexOf('?')).slice(0, -1).trim();
        }
        return endPoint.slice(1, -1).trim();
    }
    /**
     * remove first '/' then extract model after removing everthing after second '/' and 's'
     * e.g: /users/ID returns user
     */
    return endPoint.substr(1, endPoint.slice(1).indexOf('/')).slice(0, -1).trim();
}

exports.create = async function (req, res) {

    const modelName = extractModelFromEndpoint(req.originalUrl, false);
    const Model = mongoose.model(modelName);
    let newEntity = new Model(req.body);
    try {
        let savedEntity = await newEntity.save();
        res.send(savedEntity);
    } catch (err) {
        if (err.message) {
            return res.send({
                message: err.message
            });
        }
        res.send(err);
    }
}

exports.findAll = async function (req, res) {

    const modelName = extractModelFromEndpoint(req.originalUrl, false);
    const Model = mongoose.model(modelName);
    try {
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

        let documentCount = await Model.countDocuments({});
        let pageCount = Math.ceil(documentCount / limit);

        ////////////////////////////////////
        let modelEntities;
        if(modelName != 'bulkcandidate')
            modelEntities = await Model.find({}, {}, paging);
        else
            modelEntities = await Model.find({}, {}, paging).sort('-createdAt');
        res.send({
            pages: pageCount,
            [modelName + 's']: modelEntities
        });
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.findOne = async function (req, res) {
    const modelName = extractModelFromEndpoint(req.originalUrl, true);
    const Model = mongoose.model(modelName);
    try {
        let modelEntity = await Model.findById(req.params.entityId);
        if (!modelEntity) {
            return res.status(404).send({
                message: modelName + " not found with id " + req.params.entityId
            });
        }
        res.send(modelEntity);
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.update = async function (req, res) {
    const modelName = extractModelFromEndpoint(req.originalUrl, true);
    const Model = mongoose.model(modelName);
    let updatedModelFields = { ...req.body };
    try {
        let model = await Model.findById(req.params.entityId);
        if(!model){
            return res.status(404).send({
                message: modelName + " not found with id " + req.params.entityId
            }); 
        }
        let updatedModel = await Model.findOneAndUpdate({ _id: req.params.entityId }, updatedModelFields, { new: true});
        res.send(updatedModel);
    } catch (err) {
        if(err.message){
            return res.send({
                message: err.message
            });
        }
        res.send(err);
    }
}

exports.delete = async function (req, res) {
    const modelName = extractModelFromEndpoint(req.originalUrl, true);
    const Model = mongoose.model(modelName);
    try {
        let deletedModel = await Model.findById(req.params.entityId);
        if (!deletedModel) {
            return res.status(404).send({
                message: modelName + " not found with id " + req.params.entityId
            });
        }
        await deletedModel.remove(); //so that pre remove middleware gets called
        res.send({ message: modelName + " deleted successfully!" });
    } catch (err) {
        if (err.message) {
            return res.status(500).send({
                message: err.message
            });
        }
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}