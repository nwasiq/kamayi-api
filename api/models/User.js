'use strict';
const mongoose = require('mongoose');
const schema = mongoose.Schema;

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