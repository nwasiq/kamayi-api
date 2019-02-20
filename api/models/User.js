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

const user = module.exports = mongoose.model('user', UserSchema)

module.exports.getUserById = function (id, callback) {
    user.findById(id, callback);
}

module.exports.getUserByEmail = function (email, callback) {
    const query = {
        email: email
    };

    user.findOne(query, callback);
}

module.exports.saveUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.updateUser = function (user, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user.save(callback);
        });
    });
};

module.exports.comparePassword = function (user, candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
            // If user password stored as plain text, save it as hash
            if (candidatePassword.trim() === hash.trim()) {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(candidatePassword, salt, (err, hashedPassword) => {
                        if (err) throw err;
                        user.password = hashedPassword;
                        user.save(function (err, user) {
                            if (err) throw err;
                            callback(null, true);
                        });
                    });
                });
            }
            else
                callback(null, isMatch);
        }
        else
            callback(null, isMatch);
    });
};