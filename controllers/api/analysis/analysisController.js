var models = require('../../../models');
var jwt = require('jsonwebtoken');
var SECRET = 'nodescratch';
var fs = require('file-system');
var bcrypt = require('bcrypt-nodejs');
var config = require('../../../config/config.json');
var Sequelize = require("sequelize");
var sequelize = new Sequelize(
    config.development.database, 
    config.development.username,
    config.development.password, {
        host: 'localhost',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        // SQLite only
        //storage: 'path/to/database.sqlite'
    }
);

/************************* Search Tracking start *******************************/
exports.getSearchTracking = async function(req, res, next) {
    //console.log(req.body);
    var userId = req.body.userId;
    var role = req.body.role;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var TrackingCount='';// Create return Object
    if(userId !='' && role !='' && fromDate !='' && toDate !=''){
        if(role=='admin'){ // Admin get all data
            var TrackingCount =await sequelize.query("SELECT COALESCE(SUM(IF(`t`.`status` = 'active', 1, 0)),0) AS active, COALESCE(SUM(IF(`t`.`status` = 'tracked', 1, 0)),0) AS tracked, COALESCE(SUM(IF(`t`.`status` = 'not-tracked', 1, 0)),0) AS 'not-tracked', COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS completed FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'",{ type: Sequelize.QueryTypes.SELECT });
        } else { // Shipper get particular thair data
            var TrackingCount =await sequelize.query("SELECT COALESCE(SUM(IF(`t`.`status` = 'active', 1, 0)),0) AS active, COALESCE(SUM(IF(`t`.`status` = 'tracked', 1, 0)),0) AS tracked, COALESCE(SUM(IF(`t`.`status` = 'not-tracked', 1, 0)),0) AS 'not-tracked', COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS completed FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` WHERE `t`.`tracked_by_user_id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'",{ type: Sequelize.QueryTypes.SELECT });
        }
        if(TrackingCount.length > 0) { //query result length check
            res.status(200).json({data:TrackingCount[0]}); //Return json with data or empty
        } else {
            res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
        }
    }else{
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Search Tracking ends *******************************/

/************************* Complete Tracking List start *******************************/
exports.getCompleteTrackingList = async function(req, res, next) {
    //console.log(req.body);
    var userId = req.body.userId;
    var role = req.body.role;
    var shipperId = req.body.shipperId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var TrackingHistory=''; // Create return Object
    var shipperIdQ = shipperId!='' ? " AND `e`.`id`="+shipperId : "";
    if(userId !='' && role !='' && fromDate !='' && toDate !=''){
        if(role=='admin'){ // Admin get all data
            var TrackingHistory =await sequelize.query("SELECT COUNT(`t`.`id`) AS TotalRows, COUNT(DISTINCT `e`.`id`) AS totalShipper, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS totalcompleted, COUNT(DISTINCT `t`.`tracked_mobile_number`) AS totalNumberTracked, COUNT(DISTINCT `t`.`vehicle_number`) AS totalVehicleTracked FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
        } else { // Shipper get particular thair data
            var TrackingHistory =await sequelize.query("SELECT COUNT(`t`.`id`) AS TotalRows, COUNT(DISTINCT `e`.`id`) AS totalShipper, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS totalcompleted, COUNT(DISTINCT `t`.`tracked_mobile_number`) AS totalNumberTracked, COUNT(DISTINCT `t`.`vehicle_number`) AS totalVehicleTracked FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`tracked_by_user_id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
        }
        if(TrackingHistory.length > 0) { //query result length check
            res.status(200).json({data:TrackingHistory[0]}); //Return json with data or empty
        } else {
            res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
        }
    }else{
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Complete Tracking List ends *******************************/

/************************* Change Tracking Status start *******************************/
exports.getChangeTrackingStatus = async function(req, res, next) {
    var trackingId = req.body.trackingId;
    var status = req.body.status;
    if(trackingId !='' && status !=''){
        var ChangeTrackingStatus =await sequelize.query("UPDATE `tracking_details` SET `status`='"+status+"' WHERE `tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
        res.status(200).json({data:{"status":"success"}}); //Return json with data or empty
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Change Tracking Status ends *******************************/

/************************* Enable Disable Tracking start *******************************/
exports.getEnableDisableTracking = async function(req, res, next) {
    //console.log(req.body);
    var trackingId = req.body.trackingId;
    var active = req.body.active;
    if(trackingId !='' && active !=''){
        if(active=='enable'){ // update active
            var EnableDisableTracking =await sequelize.query("UPDATE `tracking_details` SET `active_status`='active' WHERE `tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
        } else { // update inactive
            var EnableDisableTracking =await sequelize.query("UPDATE `tracking_details` SET `active_status`='inactive' WHERE `tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
        }
        res.status(200).json({data:{"status":"success"}}); //Return json with data or empty
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Enable Disable Tracking ends *******************************/

/************************* Tracking Details start *******************************/
exports.getTrackingDetails = async function(req, res, next) {
    var trackingId = req.body.trackingId;
    if(trackingId !=''){
        var TrackingDetails =await sequelize.query("SELECT `latitude` AS latitude, `longitude` AS longitude, `time_stamp` AS timeStamp FROM `tracking_details` WHERE `tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.SELECT });
        if(TrackingDetails.length > 0){ //query result length check
            res.status(200).json({data:TrackingDetails}); //Return json with data or empty
        } else {
            res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
        }
    }else{
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }  
}
/************************* Tracking Details ends *******************************/