'use strict';

const User = require('../models/User');
const baseURL = "http://localhost:3000";
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.create = function (req, res) {

    let newUser = new User(req.body);
    User.getUserByEmail(newUser.email, (err, user) => {
        if(user){
            return res.status(400).send({
                message: "User with this email already exists"
            });
        }
        newUser.save((err, user) => {
            if(err){
                return res.status(500).send({
                    message: err.message || "Some error occurred while creating the User."
                });
            }
            res.send(user);
        })
    })
}

exports.update = function (req, res) {

    let updatedUser = {
        email: req.body.email,
        password: req.body.password,
        fullName: req.body.fullName,
        username: req.body.username,
        phone: req.body.phone,
        role: req.body.role
    };
    User.findOneAndUpdate(req.params.userId, updatedUser, { new: true, upsert: true, setDefaultsOnInsert: true }, (err, user) => {
        if (!user || (err && err.kind === 'ObjectId')) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error updating user with id " + req.params.userId
            });
        }
        res.send(user);
    })

}

exports.delete = function (req, res) {
    User.findOneAndDelete(req.params.userId, (err, user) => {
        if (!user || (err && (err.kind === 'ObjectId' || err.name === 'NotFound'))) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.userId
            });
        }
        res.send({ message: "User deleted successfully!" });
    })
}

exports.findOne = function (req, res) {
    User.findById(req.params.userId, (err, user) => {

        if (!user || (err && err.kind === 'ObjectId')) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            }); 
        }
        if (err) {
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.userId
            });
        }
        res.send(user);
    })
}

exports.findAll = function (req, res) {
    User.find({}, (err, users) => {
        if(err){
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        }
        res.send(users);
    })
}