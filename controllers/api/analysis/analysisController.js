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
    var trackingId = req.body.trackingId;
    var organizationId = req.body.organizationId;    
    var queryQ = '';
    if(trackingId !='' && organizationId !=''){
        var queryQ = "WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+"";
    } else if(trackingId !='') {
        var queryQ = "WHERE `t`.`tracking_id`="+trackingId+"";
    } else if(trackingId !='') {
        var queryQ = "WHERE `e`.`id`="+organizationId+"";
    } 
    var SearchTracking =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`status` AS status, `t`.`active_status` AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` "+queryQ+"",{ type: Sequelize.QueryTypes.SELECT });
    if(SearchTracking.length > 0) { //query result length check
        SearchTracking.forEach(function(k,p){
            SearchTracking[p]['BranchId'] = '';
            SearchTracking[p]['BranckName'] = '';
            SearchTracking[p]['BranchContactNumber'] = '';
            SearchTracking[p]['BranchContactName'] = '';
            SearchTracking[p]['trackingDetails'] = {};
            SearchTracking[p]['trackingDetails']['latitude'] = k.latitude;
            SearchTracking[p]['trackingDetails']['longitude'] = k.longitude;
            SearchTracking[p]['trackingDetails']['timeStamp'] = k.time_stamp;
            delete SearchTracking[p].latitude;delete SearchTracking[p].longitude;delete SearchTracking[p].time_stamp;
        });            
        res.status(200).json({data:SearchTracking}); //Return json with data or empty
        
    }else{
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Search Tracking ends *******************************/

/************************* Complete Tracking List start *******************************/
exports.getCompleteTrackingList = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var organizationIdQ = organizationId!='' ? " AND `e`.`id`="+organizationId : "";
    if(fromDate !='' && toDate !=''){
        var SearchTracking =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`status` AS status, `t`.`active_status` AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+organizationIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
        if(SearchTracking.length > 0) { //query result length check
            SearchTracking.forEach(function(k,p){
                SearchTracking[p]['BranchId'] = '';
                SearchTracking[p]['BranckName'] = '';
                SearchTracking[p]['BranchContactNumber'] = '';
                SearchTracking[p]['BranchContactName'] = '';
                SearchTracking[p]['trackingDetails'] = {};
                SearchTracking[p]['trackingDetails']['latitude'] = k.latitude;
                SearchTracking[p]['trackingDetails']['longitude'] = k.longitude;
                SearchTracking[p]['trackingDetails']['timeStamp'] = k.time_stamp;
                delete SearchTracking[p].latitude;delete SearchTracking[p].longitude;delete SearchTracking[p].time_stamp;
            });            
            res.status(200).json({data:SearchTracking}); //Return json with data or empty
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