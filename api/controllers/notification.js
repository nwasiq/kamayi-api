'use strict';

const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getNotificationsForAdmin = async function(req, res){
    try{
        let notifications = await Notification.find({role: 'admin'}).populate('vacancy');
        res.send(notifications);
    } catch(err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.getNotificationsForPlacement = async function (req, res) {
    let placementId = req.params.userId;
    try {
        let user = await User.findOne({_id: placementId, role: 'placement'});
        if(!user){
            return res.status(404).send({
                message: "User not found with id " + placementId
            });
        }
        let notifications = await Notification.find({role: 'placement', placementUser: placementId}).populate('employer');
        res.send(notifications);
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}