'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var VacancySchema = new schema({

    //pending verification status for when placement user archives vacancy (removes vacancy from his list)
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Archived', 'Pending Archived', 'Pending Completed'],
        default: 'Active'
    },
    title: String,
    occupation: String,
    description: String,
    city: String, //should be enum
    area: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    salary: Number,
    openings: {
        type: Number,
        required: true
    },
    hired: {
        type: Number,
        default: 0
    },
    totalSlots: Number,
    jobType: {
        type: String,
        enum: ['fullTime', 'partTime']
    },
    dateCreated: Date,
    experience: Number, //years
    educationRequirement: Number, //should be enum,
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Any']
    },
    benefits: {
        insurance: Boolean,
        transportation: Boolean,
        accomodation: Boolean,
        food: Boolean,
        socialSecurity: Boolean
    },
    employer: {
        type: schema.Types.ObjectId, ref: 'employer'
    },
    pocNumber: String,
    designation: String

});

VacancySchema.pre('save', async function(){
    this.dateCreated = Date.now();
});

VacancySchema.pre('findOneAndUpdate', async function () {
    if (this._update.status != undefined && (this._update.status == 'Completed' || 
        this._update.status == 'Pending Archived' || this._update.status == 'Pending Completed')) {

        let notification;
        if (this._update.status == 'Completed')
            notification = 'Vacancy Completed';
        else if (this._update.status == 'Pending Completed')
            notification = 'Vacancy Completion Approval';
        else if (this._update.status == 'Pending Archived')
            notification = 'Vacancy Archival Approval';

        const NotiModel = mongoose.model('notification');
        let newNotification = new NotiModel({
            notiType: notification,
            role: 'admin',
            vacancy:  this._conditions._id
        })
        await newNotification.save();
    }
});


VacancySchema.index({ location: '2dsphere' });

const vacancy = module.exports = mongoose.model('vacancy', VacancySchema);
