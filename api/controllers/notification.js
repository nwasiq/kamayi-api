'use strict';

const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getNotificationsForAdmin = async function(req, res){
    try{
        let notifications = await Notification.find({ role: 'admin'}).sort({createdAt: -1});
        let unreadCount = await Notification.countDocuments({ role: 'admin', isRead: false});
        res.send({unreadCount, notifications});
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
        let notifications = await Notification.find({role: 'placement', placementUser: placementId }).sort({createdAt: -1});
        let unreadCount = await Notification.countDocuments({ role: 'placement', placementUser: placementId, isRead: false });
        res.send({unreadCount, notifications});
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}

exports.updateReadStatus = async function (req, res) {
    let notiIds = req.body.notificationIds;
    try {
        await Notification.updateMany({_id: {$in: notiIds}}, {$set: {isRead: true}});
        res.send({
            message: "Notifications read"
        });
    } catch (err) {
        res.status(500).send({
            message: "A server error occurred",
            err: err
        })
    }
}