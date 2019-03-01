'use strict';
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: String,
    username: String,
    phone: Number,
    role: {
        type: String,
        required: true,
        enum: ['superAdmin', 'admin', 'placement', 'callCenter']
    },
})

/**
 *  @todo: when a user deleted, if his role is placement,
 * remove his reference from employer, placementOfficer: ""
 */

 /**
  * @todo: create endpoint to get employers assigned to placement officer
  */
const user = module.exports = mongoose.model('user', UserSchema)

module.exports.getUserById = function (id, callback) {
    user.findById(id, callback);
}

module.exports.getUserByEmail = function (email) {
    const query = {
        email: email
    };
    return user.findOne(query);
}

module.exports.saveUser = function (newUser) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) reject(err);
                newUser.password = hash;
                newUser.save((err, user) => {
                    resolve(user);
                });
            });
        });
    })
    
};

module.exports.updateUser = function (user) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) reject(err);
                user.password = hash;
                user.save((err, user) => {
                    resolve(user);
                });
            });
        });
    })
};

module.exports.comparePassword = function (user, candidatePassword, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
            if (err) reject(err);
            if (!isMatch) {
                // If user password stored as plain text, save it as hash
                if (candidatePassword.trim() === hash.trim()) {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(candidatePassword, salt, (err, hashedPassword) => {
                            if (err) reject(err);
                            user.password = hashedPassword;
                            user.save(function (err, user) {
                                if (err) reject(err);
                                resolve(true);
                            });
                        });
                    });
                }
                else
                    resolve(isMatch);
            }
            else
                resolve(isMatch);
        });
    })
};