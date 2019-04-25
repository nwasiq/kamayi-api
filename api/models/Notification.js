'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var NotificationSchema = new schema({
    notiType: {
        type: String,
        enum: [
            'Employer Assigned',
            'Vacancy Completion Approval',
            'Vacancy Archival Approval',
            'Vacancy Completed'
        ]
    },
    placementUser: {
        type: schema.Types.ObjectId, ref: 'user'
    },
    vacancy: {
        type: schema.Types.ObjectId, ref: 'vacancy'
    },
    employer: {
        type: schema.Types.ObjectId, ref: 'employer'
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'placement']
    },
    createdAt: Date
});

NotificationSchema.pre('save', async function () {
    this.createdAt = Date.now();
});

module.exports = mongoose.model('notification', NotificationSchema);