'use strict';
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const util = require('util');
const genSalt = util.promisify(bcrypt.genSalt);
const hashFunction = util.promisify(bcrypt.hash);

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

UserSchema.pre('save', async function() {
    let user = await this.constructor.findOne({email: this.email});
    if(user){
        throw new Error('User with this email already exists');
    }
    const salt = await genSalt(10);
    const hash = await hashFunction(this.password, salt);
    this.password = hash;
});

UserSchema.pre('findOneAndUpdate', async function() {
    if(this._update.password != undefined){
        const salt = await genSalt(10);
        const hash = await hashFunction(this._update.password, salt);
        this._update.password = hash;
    }
});

UserSchema.pre('remove', async function(){
    if(this.role == 'placement'){
        const EmployerModel = mongoose.model("employer");
        await EmployerModel.updateMany({ placementOfficer: this._id }, { $unset: { placementOfficer: 1 }, $set: { isAssigned: "Unassigned"}});
    }
    else if(this.role == 'superAdmin'){
        throw new Error('super admin cannot be deleted');
    }
})

const user = module.exports = mongoose.model('user', UserSchema)

module.exports.getUserById = function (id, callback) {
    user.findById(id, callback);
}

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