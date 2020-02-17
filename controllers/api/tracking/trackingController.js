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
        queryQ = "WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+"";
    } else if(trackingId !='') {
        queryQ = "WHERE `t`.`tracking_id`="+trackingId+"";
    } else if(trackingId !='') {
        queryQ = "WHERE `e`.`id`="+organizationId+"";
    } 
    var SearchTracking =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` "+queryQ+"",{ type: Sequelize.QueryTypes.SELECT });
    if(SearchTracking.length > 0) { //query result length check
        SearchTracking.forEach(function(k,p){
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
        var SearchTracking =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+organizationIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
        if(SearchTracking.length > 0) { //query result length check
            SearchTracking.forEach(function(k,p){
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
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Tracking Details ends *******************************/

/************************* Search Organization start *******************************/
exports.getSearchOrganization = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    var organizationName = req.body.organizationName;
    var queryQ='';
    if(organizationName !='' && organizationId !=''){
        queryQ = "WHERE `e`.`id`="+organizationId+" OR `e`.`organisation_name`='%"+organizationName+"%'";
    } else if(organizationId !='') {
        queryQ = "WHERE `e`.`id`="+organizationId+"";
    } else if(organizationName !='') {
        queryQ = "WHERE `e`.`organisation_name`='%"+organizationName+"%'";
    }
    var SearchOrganization =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `tm`.`load_id` AS loadId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` "+queryQ+"",{ type: Sequelize.QueryTypes.SELECT });
    if(SearchOrganization.length > 0) { //query result length check
        SearchOrganization.forEach(function(k,p){
            SearchOrganization[p]['trackingDetails'] = {};
            SearchOrganization[p]['trackingDetails']['latitude'] = k.latitude;
            SearchOrganization[p]['trackingDetails']['longitude'] = k.longitude;
            SearchOrganization[p]['trackingDetails']['timeStamp'] = k.time_stamp;
            delete SearchOrganization[p].latitude;delete SearchOrganization[p].longitude;delete SearchOrganization[p].time_stamp;
        });            
        res.status(200).json({data:SearchOrganization}); //Return json with data or empty
    } else {
        res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
    }
}
/************************* Search Organization ends *******************************/

/************************* Get Tracking list start *******************************/
exports.getTracking = async function(req, res, next) {
    var trackingId = req.body.trackingId;
    var trackingIdQ = trackingId!='' ? "WHERE `t`.`tracking_id`="+trackingId : "";
    var TrackingList =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `tm`.`load_id` AS loadId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` "+trackingIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
    if(TrackingList.length > 0) { //query result length check
        TrackingList.forEach(function(k,p){
            TrackingList[p]['trackingDetails'] = {};
            TrackingList[p]['trackingDetails']['latitude'] = k.latitude;
            TrackingList[p]['trackingDetails']['longitude'] = k.longitude;
            TrackingList[p]['trackingDetails']['timeStamp'] = k.time_stamp;
            delete TrackingList[p].latitude;delete TrackingList[p].longitude;delete TrackingList[p].time_stamp;
        });
        res.status(200).json({data:TrackingList}); //Return json with data or empty
    }else{
        res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
    }
}
/************************* Get Tracking list ends *******************************/

/************************* Create Tracking start *******************************/
exports.createTracking = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
}
/************************* Create Tracking ends *******************************/

/************************* Edit Tracking start *******************************/
exports.editTracking = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
}
/************************* Edit Tracking ends *******************************/

/************************* Particular Tracking Details start *******************************/
exports.particularTrackingDetails = async function(req, res, next) {
    var trackingId = req.body.trackingId;
    var organizationId = req.body.organizationId;
    var userId = req.body.userId;
    if(trackingId !='' && organizationId !='' && userId !=''){
        var SearchOrganization =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+" AND `u`.`id`="+userId+"",{ type: Sequelize.QueryTypes.SELECT });
        if(SearchOrganization.length > 0) { //query result length check
            SearchOrganization.forEach(function(k,p){
                SearchOrganization[p]['trackingDetails'] = {};
                SearchOrganization[p]['trackingDetails']['latitude'] = k.latitude;
                SearchOrganization[p]['trackingDetails']['longitude'] = k.longitude;
                SearchOrganization[p]['trackingDetails']['timeStamp'] = k.time_stamp;
                delete SearchOrganization[p].latitude;delete SearchOrganization[p].longitude;delete SearchOrganization[p].time_stamp;
            });            
            res.status(200).json({data:SearchOrganization}); //Return json with data or empty
        } else {
            res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Particular Tracking Details ends *******************************/

/************************* Update Tracking Status start *******************************/
exports.updateTrackingStatus = async function(req, res, next) {
    var trackingId = req.body.trackingId;
    var organizationId = req.body.organizationId;
    var userId = req.body.userId;
    var status = req.body.status;
    if(trackingId !='' && organizationId !='' && userId !=''){
        var updateTrackingStatus =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+" AND `u`.`id`="+userId+"",{ type: Sequelize.QueryTypes.SELECT });
        if(updateTrackingStatus.length > 0){
            var TrackingStatus =await sequelize.query("UPDATE tracking_details SET `status`='"+status+"' WHERE `id`="+updateTrackingStatus[0].Id+"",{ type: Sequelize.QueryTypes.UPDATE });
            if(TrackingStatus.slice(-1)[0] > 0) {
                res.status(200).json({success:true}); //Return json with data or empty
            } else {
                res.status(200).json({success:false});// Return json with error massage
            }
        } else {
            res.status(200).json({success:false});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Update Tracking Status ends *******************************/

/************************* Update Tracking Status start *******************************/
exports.updateTrackingDetails = async function(req, res, next) {
    var trackingId = req.body.trackingId;
    var organizationId = req.body.organizationId;
    var userId = req.body.userId;
    var latitude = req.body.trackingDetails.latitude;
    var longitude = req.body.trackingDetails.longitude;
    var timeStamp = req.body.trackingDetails.timeStamp;
    if(trackingId !='' && organizationId !='' && userId !='' && latitude !='' && longitude !='' && timeStamp !=''){
        var updateTrackingDetails =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+" AND `u`.`id`="+userId+"",{ type: Sequelize.QueryTypes.SELECT });
        if(updateTrackingDetails.length > 0){
            var TrackingDetails =await sequelize.query("UPDATE tracking_details SET `time_stamp`='"+timeStamp+"', `latitude`='"+latitude+"', `longitude`='"+longitude+"' WHERE `id`="+updateTrackingDetails[0].Id+"",{ type: Sequelize.QueryTypes.UPDATE });
            if(TrackingDetails.slice(-1)[0] > 0) {
                res.status(200).json({success:true}); //Return json with data or empty
            } else {
                res.status(200).json({success:false});// Return json with error massage
            }
        } else {
            res.status(200).json({success:false});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Update Tracking Status ends *******************************/

/************************* Update Tracking Active start *******************************/
exports.updateTrackingActive = async function(req, res, next) {
    var trackingId = req.body.trackingId;
    var organizationId = req.body.organizationId;
    var userId = req.body.userId;
    var activeRaw = req.body.active;
    if(trackingId !='' && organizationId !='' && userId !='' && activeRaw!=''){
        var active = (activeRaw=="true") ? 'active' : 'inactive';
        var updateTrackingActive =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+" AND `u`.`id`="+userId+"",{ type: Sequelize.QueryTypes.SELECT });
        if(updateTrackingActive.length > 0){
            var TrackingActive =await sequelize.query("UPDATE tracking_details SET `active_status`='"+active+"' WHERE `id`="+updateTrackingActive[0].Id+"",{ type: Sequelize.QueryTypes.UPDATE });
            if(TrackingActive.slice(-1)[0] > 0) {
                res.status(200).json({success:true}); //Return json with data or empty
            } else {
                res.status(200).json({success:false});// Return json with error massage
            }
        } else {
            res.status(200).json({success:false});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Update Tracking Active ends *******************************/

/************************* Update Active Mobile Number start *******************************/
exports.updateActiveMobileNumber = async function(req, res, next) {
    var trackingId = req.body.trackingId;
    var organizationId = req.body.organizationId;
    var userId = req.body.userId;
    var activeMobileNumber = req.body.activeMobileNumber;
    if(trackingId !='' && organizationId !='' && userId !='' && activeMobileNumber!=''){
        var updateActiveMobileNumber =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+" AND `u`.`id`="+userId+"",{ type: Sequelize.QueryTypes.SELECT });
        if(updateActiveMobileNumber.length > 0){
            var ActiveMobileNumber =await sequelize.query("UPDATE tracking_details SET `client_contact_mobile`='"+activeMobileNumber+"' WHERE `id`="+updateActiveMobileNumber[0].Id+"",{ type: Sequelize.QueryTypes.UPDATE });
            if(ActiveMobileNumber.slice(-1)[0] > 0) {
                res.status(200).json({success:true}); //Return json with data or empty
            } else {
                res.status(200).json({success:false});// Return json with error massage
            }
        } else {
            res.status(200).json({success:false});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Update Active Mobile Number ends *******************************/

/************************* add Contact And Mobile Number start *******************************/
exports.addContactandMobileNumber = async function(req, res, next) {
    var trackingId = req.body.trackingId;
    var organizationId = req.body.organizationId;
    var userId = req.body.userId;
    var contactName = req.body.addMobileNumber.ContactName;
    var contactMobileNumber = req.body.addMobileNumber.contactMobileNumber;
    var trackables = req.body.addMobileNumber.trackable;
    if(trackingId !='' && organizationId !='' && userId !='' && contactName!='' && contactMobileNumber!='' && trackables!=''){
        var addContactandMobileNumber =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+" AND `u`.`id`="+userId+"",{ type: Sequelize.QueryTypes.SELECT });
        if(addContactandMobileNumber.length > 0){
            var trackable = (trackables=="true") ? 1 : 0;
            var addContactMobileNumber =await sequelize.query("UPDATE tracking_details SET `tracked_mobile_number`='"+contactMobileNumber+"', `client_contact_mobile`='"+contactMobileNumber+"', `tracking_count`='"+trackable+"' WHERE `id`="+addContactandMobileNumber[0].Id+"",{ type: Sequelize.QueryTypes.UPDATE });
            if(addContactMobileNumber.slice(-1)[0] > 0) {
                res.status(200).json({success:true}); //Return json with data or empty
            } else {
                res.status(200).json({success:false});// Return json with error massage
            }
        } else {
            res.status(200).json({success:false});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Update Active Mobile Number ends *******************************/