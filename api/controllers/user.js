'use strict';

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../../config/database')

exports.create = async function (req, res) {

    if (req.user.role != 'superAdmin' && req.user.role != 'admin'){
        return res.status(401).send({
            messages: "Only a Super Admin or an Admin can create a user"
        });
    }

    if(req.user.role != 'superAdmin' && req.body.role == 'admin'){
        return res.status(401).send({
            messages: "Only a Super Admin can create an Admin"
        });
    }

    if (req.user.role == 'superAdmin' && req.body.role == 'superAdmin') {
        return res.status(401).send({
            messages: "Only one super admin allowed"
        });
    }

    let newUser = new User(req.body);
    try{
        let user = await User.getUserByEmail(newUser.email);
        if (user) {
            return res.status(400).send({
                message: "User with this email already exists"
            });
        }
        let savedUser = await User.saveUser(newUser);
        res.send(savedUser);
    } catch(err) {
        res.send(err);
    }
}

exports.update = async function (req, res) {

    if (req.user.role != 'superAdmin' && req.user.role != 'admin') {
        return res.status(401).send({
            messages: "Only a Super Admin or an Admin can update a user"
        });
    }

    if (req.user.role == 'admin' && req.body.role == 'superAdmin') {
        return res.status(401).send({
            messages: "An Admin cannot update anyone to Super Admin"
        });
    }

    let updatedUserFields = {...req.body};
    try{
        let user = await User.findByIdAndUpdate(req.params.userId, updatedUserFields, { new: true, upsert: true, setDefaultsOnInsert: true });
        let updatedUser = await User.updateUser(user);
        res.send(updatedUser);
    } catch(err){
       res.send(err); 
    }
}

exports.delete = async function (req, res) {

    if (req.user.role != 'superAdmin' && req.user.role != 'admin') {
        return res.status(401).send({
            messages: "Only a Super Admin or an Admin can delete a user"
        });
    }
    try {
        let deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send({ message: "User deleted successfully!" });
    } catch (err) {
        res.send(err);
    }
}

exports.findOne = async function (req, res) {

    try {
        let user = await User.findById(req.params.userId);
        if(!user){
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(user);
    } catch (err) {
        res.send(err);
    }
}

exports.findAll = async function (req, res) {

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

        let documentCount = await User.countDocuments({});
        let pageCount = Math.ceil(documentCount / limit);

        ////////////////////////////////////
        let users = await User.find({}, {}, paging);
        res.send({
            pages: pageCount,
            users: users
        });
    } catch (err) {
        res.send(err);
    }
}

exports.login = async function(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    try {
        let user = await User.getUserByEmail(email);
        if(!user){
            return res.status(404).send({
                message: "User not found with email " + email
            });
        }
        let isMatch = await User.comparePassword(user, password, user.password);
        if (isMatch) {
            const token = jwt.sign(user.toJSON(), config.secret, {
                expiresIn: 604800 // 1 week
            });
            res.send({
                success: true,
                token: 'Bearer ' + token,
                user
            });
        }
        else {
            res.status(401).send({
                message: "Incorrect password"
            });
        }
    } catch (err) {
        res.send(err);
    }
}