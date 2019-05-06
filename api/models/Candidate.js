'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var CandidateSchema = new schema({

    fullName: String,
    cnic: String,
    phone: String,
    dob: Date,
    age: Number,
    training: [String],
    email: String,
    primarySkill: String,
    area: String,
    employmentStatus: Boolean,
    vacancyStatus: [{
        vacancy: { type: schema.Types.ObjectId, ref: 'vacancy' },
        status: String, //initial status: not contacted, then schedule interview', then 'interview scheduled', then 'interviewed', 'rejected', 'hired', 'joined'
        score: Number,
        interviewDate: Date //if status is 'interview scheduled', then use this
    }],
    hasOtherSkill: Boolean, // If skill not in occupation list
    comment: String,
    createdBy: {
        type: schema.Types.ObjectId,
        ref: 'user' 
    }
});

 CandidateSchema.pre('remove', async function() {
     const CriteriaModel = mongoose.model("criteria");
     await CriteriaModel.deleteMany({ candidate: this._id });
 })

CandidateSchema.pre('save', async function () {
    /**
     * If cnic is present in bulk candidate IDs, his status will be set to true
     * This means that candidate being created was retrieved from bulk cand model 
     */
    const BulkCandModel = mongoose.model('bulkcandidate');
    await BulkCandModel.findOneAndUpdate({ cnic: this.cnic }, { status: true, callCenterInfo: { user: this.createdBy, dateOfEntry: Date.now()}});
    if(this.hasOtherSkill){
        const NotiModel = mongoose.model('notification');

        let newNotification = new NotiModel({
            notiType: 'Candidate with Other skill added',
            role: 'admin'
        })
        await newNotification.save();
    }
})

const candidate = module.exports = mongoose.model('candidate', CandidateSchema);

module.exports.getCandidateByCnic = function (cnic) {
    const query = {
        cnic: cnic
    };

    return candidate.findOne(query);
}

module.exports.getCandidateByPhoneNumber = function (phNumber) {
    const query = {
        phone: phNumber
    };

    return candidate.findOne(query);
}
