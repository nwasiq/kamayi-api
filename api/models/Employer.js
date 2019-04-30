'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var industryList = require('../enums/industry');

var EmployerSchema = new schema({

    fullName: String,
    email: String,
    pocPhone: String,
    pocDesignation: String,
    pocAddress: String,
    pocCity: String,
    companyName: String,
    companyPhone: String,
    industry: {
        type: String,
        enum: industryList
    },
    website: String,
    location: {
        lat: Number,
        long: Number,
        city: String
    },
    isAssigned: {
        type: String,
        default: "Unassigned"
    },
    placementOfficer: {
        type: schema.Types.ObjectId, ref: 'user'
    }
});

EmployerSchema.pre('save', async function(){
    let employer = await this.constructor.findOne({companyName: this.companyName});
    if (employer) {
        throw new Error('This company already exists');
    }
});

EmployerSchema.pre('remove', async function(){
    const VacancyModel = mongoose.model("vacancy");
    await VacancyModel.deleteMany({employer: this._id});
});

EmployerSchema.pre('findOneAndUpdate', async function () {
    if(this._update.placementOfficer != undefined){
        const UserModel = mongoose.model('user');
        let user = await UserModel.findOne({ role: 'placement', _id: this._update.placementOfficer });
        if (!user) {
            throw new Error('No placement officer found with id: ' + this._update.placementOfficer);
        }
        this._update.isAssigned = "Assigned";
        const NotiModel = mongoose.model('notification');
        const Employer = mongoose.model('employer');
        let employerCompany = await Employer.findOne({_id: this._conditions._id}, {companyName: 1});
        let newNotification = new NotiModel({
            notiType: 'Employer Assigned (' + employerCompany.companyName + ')',
            role: 'placement',
            placementUser: this._update.placementOfficer,
            employer: this._conditions._id
        })
        await newNotification.save();
    }
});

const employer = module.exports = mongoose.model('employer', EmployerSchema);
