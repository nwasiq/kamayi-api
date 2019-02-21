'use strict';

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../../config/database')

exports.create = function (req, res) {

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
    User.getUserByEmail(newUser.email, (err, user) => {
        if(user){
            return res.status(400).send({
                message: "User with this email already exists"
            });
        }
        User.saveUser(newUser, (err, user) => {
            if(err) {
                return res.status(500).send({
                    message: err.message || "Some error occurred while creating the User."
                });
            }
            res.send(user);
        })
    })
}

exports.update = function (req, res) {

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


    let updatedUser = {
        email: req.body.email,
        password: req.body.password,
        fullName: req.body.fullName,
        username: req.body.username,
        phone: req.body.phone,
        role: req.body.role
    };
    User.findByIdAndUpdate(req.params.userId, updatedUser, { new: true, upsert: true, setDefaultsOnInsert: true }, (err, user) => {
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
        User.updateUser(user, (err, updatedUser) => {
            if (err) {
                return res.status(500).send({
                    message: "Error updating user with id " + req.params.userId
                });
            }
            res.send(user);
        })
    })

}

exports.delete = function (req, res) {

    if (req.user.role != 'superAdmin' && req.user.role != 'admin') {
        return res.status(401).send({
            messages: "Only a Super Admin or an Admin can delete a user"
        });
    }

    User.findByIdAndDelete(req.params.userId, (err, user) => {
        
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

exports.login = function(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
        if (!user || (err && err.kind === 'ObjectId')) {
            return res.status(404).send({
                message: "User not found with email " + email
            });
        }
        if (err) {
            return res.status(500).send({
                message: "Error retrieving user with email " + email
            });
        }
        User.comparePassword(user, password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send({
                    message: "Error occured during password compare " + email
                });
            }
            
            if(isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // 1 week
                });
                res.send({
                    success: true,
                    token: 'Bearer ' + token,
                    user
                });
            }
            else{
                res.status(401).send({
                    message: "Incorrect password"
                });
            }
        })
    })

}