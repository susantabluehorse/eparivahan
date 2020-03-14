var path = require('path');
var modelsPath = path.join(__dirname, '../../../', 'models');
var models = require(modelsPath);
var jwt = require('jsonwebtoken');
var SECRET = 'nodescratch';
var fs = require('file-system');
var bcrypt = require('bcrypt-nodejs');
var configPath = path.join(__dirname, '../../../', 'config', 'config.json');
var config = require(configPath);
var validationPath = path.join(__dirname, '../../../', 'validations', 'validation.js');
var validation = require(validationPath);
var helperPath = path.join(__dirname, '../../../', 'helpers', 'traking.js');
var helper = require(helperPath);
var Sequelize = require("sequelize");
var https = require("https");
var sequelize = new Sequelize(
    config.development.database, 
    config.development.username,
    config.development.password, {
        host: 'localhost',
        port: '3306',
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
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, organizationId } = req.body;
            var mobileVali = validation.getSearchTracking(req.body);    
            if(mobileVali.passes()===true){   
                var queryQ = '';
                if((trackingId !='' && trackingId!=undefined) && (organizationId !='' && organizationId!=undefined)){
                    queryQ = "WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+"";
                } else if(trackingId !='' && trackingId!=undefined) {
                    queryQ = "WHERE `t`.`tracking_id`="+trackingId+"";
                } else if(organizationId !='' && organizationId!=undefined) {
                    queryQ = "WHERE `e`.`id`="+organizationId+"";
                }
                if(queryQ!=''){
                    var SearchTracking =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `l`.`id` AS loadId, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `b`.`city` AS BranchCity, `b`.`state` AS BranchState, `t`.`from_location`, `t`.`to_location`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `t`.`driver_name` AS driverName, `t`.`driver_mobile_number` AS driverMobileNumber, `t`.`current_tracking_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers`, `t`.`vehicle_number` AS vehicleNumber, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`other_mobile_number`, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude`, `t`.`other_location` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` "+queryQ+"",{ type: Sequelize.QueryTypes.SELECT });
                } else {
                    var SearchTracking =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `l`.`id` AS loadId, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `b`.`city` AS BranchCity, `b`.`state` AS BranchState, `t`.`from_location`, `t`.`to_location`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `t`.`driver_name` AS driverName, `t`.`driver_mobile_number` AS driverMobileNumber, `t`.`current_tracking_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers`, `t`.`vehicle_number` AS vehicleNumber, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`other_mobile_number`, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude`, `t`.`other_location` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id`",{ type: Sequelize.QueryTypes.SELECT });
                }
                if(SearchTracking.length > 0) { //query result length check
                    for (var p = 0; p < SearchTracking.length; p++) {
                        let k = SearchTracking[p];
                        SearchTracking[p]['From'] = JSON.parse(k.from_location);
                        SearchTracking[p]['To'] = JSON.parse(k.to_location);
                        SearchTracking[p]['otherLocation'] = JSON.parse(k.other_location);
                        SearchTracking[p]['trackkedMobileNumbers'] = JSON.parse(k.tracked_mobile_mumbers);                        
                        SearchTracking[p]['trackingDetails'] = [];
                        if(k.time_stamp!='' && k.latitude!='' && k.longitude!=''){
                            let trackingDetails = {};
                            let timeStamp = k.time_stamp.split(',');let latitude = k.latitude.split(',');let longitude = k.longitude.split(',');
                            for (let i = 0; i < timeStamp.length; i++) {
                                let trackingDetails = {"latitude":latitude[i], "longitude":longitude[i],"timeStamp":timeStamp[i]};
                                SearchTracking[p]['trackingDetails'].push(trackingDetails);
                            }
                        }
                        SearchTracking[p]['otherMobileNumber'] = JSON.parse(k.other_mobile_number);
                        delete SearchTracking[p].latitude;delete SearchTracking[p].longitude;delete SearchTracking[p].time_stamp;
                        delete SearchTracking[p].from_location;delete SearchTracking[p].to_location;delete SearchTracking[p].tracked_mobile_mumbers;
                        delete SearchTracking[p].other_mobile_number;delete SearchTracking[p].other_location;
                    }
                    res.status(200).json({success: true,data: SearchTracking}); //Return json with data or empty
                } else {
                    res.status(200).json({ success: false,data: "User not find" });
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data:mobileVali.errors.errors});// Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Search Tracking ends *******************************/

/************************* Complete Tracking List start *******************************/
exports.getCompleteTrackingList = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, fromDate, toDate, fromCount, toCount, status} = req.body;
            var mobileVali = validation.getCompleteTrackingList(req.body);    
            if(mobileVali.passes()===true){
                var statusQ = (status!='' && status!=undefined) ? " AND `t`.`status`='"+status+"'" : "";
                var organizationIdQ = (organizationId!='' && organizationId!=undefined) ? " AND `e`.`id`="+organizationId : "";
                var limit = " LIMIT "+toCount+" OFFSET "+fromCount+""; 
                var CompleteTrackingList =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `l`.`id` AS loadId, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `b`.`city` AS BranchCity, `b`.`state` AS BranchState, `t`.`from_location`, `t`.`to_location`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `t`.`driver_name` AS driverName, `t`.`driver_mobile_number` AS driverMobileNumber, `t`.`current_tracking_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers`, `t`.`vehicle_number` AS vehicleNumber, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`other_mobile_number`, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude`, `t`.`other_location` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE DATE(`t`.`created_at`)>='"+fromDate+"' AND DATE(`t`.`created_at`) <='"+toDate+"'"+organizationIdQ+statusQ+limit+"",{ type: Sequelize.QueryTypes.SELECT });
                if(CompleteTrackingList.length > 0) { //query result length check
                    for (var p = 0; p < CompleteTrackingList.length; p++) {
                        let k = CompleteTrackingList[p];
                        CompleteTrackingList[p]['From'] = JSON.parse(k.from_location);
                        CompleteTrackingList[p]['To'] = JSON.parse(k.to_location);
                        CompleteTrackingList[p]['otherLocation'] = JSON.parse(k.other_location);
                        CompleteTrackingList[p]['trackkedMobileNumbers'] = JSON.parse(k.tracked_mobile_mumbers);                        
                        CompleteTrackingList[p]['trackingDetails'] = [];
                        if(k.time_stamp!='' && k.latitude!='' && k.longitude!=''){
                            let trackingDetails = {};
                            let timeStamp = k.time_stamp.split(',');let latitude = k.latitude.split(',');let longitude = k.longitude.split(',');
                            for (let i = 0; i < timeStamp.length; i++) {
                                let trackingDetails = {"latitude":latitude[i], "longitude":longitude[i],"timeStamp":timeStamp[i]};
                                CompleteTrackingList[p]['trackingDetails'].push(trackingDetails);
                            }
                        }
                        CompleteTrackingList[p]['otherMobileNumber'] = JSON.parse(k.other_mobile_number);
                        delete CompleteTrackingList[p].latitude;delete CompleteTrackingList[p].longitude;delete CompleteTrackingList[p].time_stamp;
                        delete CompleteTrackingList[p].from_location;delete CompleteTrackingList[p].to_location;delete CompleteTrackingList[p].tracked_mobile_mumbers;
                        delete CompleteTrackingList[p].other_mobile_number;delete CompleteTrackingList[p].other_location;
                    }
                    res.status(200).json({success: true,data: CompleteTrackingList}); //Return json with data or empty
                } else {
                    res.status(200).json({ success: false,data: "No data found!"});// Return json with error massage
                }
            }else{
                res.status(200).json({ success: mobileVali.passes(),data:mobileVali.errors.errors});// Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Complete Tracking List ends *******************************/

/************************* Total Tracking Count start *******************************/
exports.getTotalTrackingCount = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, fromDate, toDate, status} = req.body;
            var mobileVali = validation.getTotalTrackingCount(req.body);    
            if(mobileVali.passes()===true){
                var statusQ = (status!='' && status!=undefined) ? " AND `t`.`status`='"+status+"'" : "";
                var organizationIdQ = (organizationId!='' && organizationId!=undefined) ? " AND `e`.`id`="+organizationId : ""; 
                var TotalTrackingCount =await sequelize.query("SELECT count(`t`.`tracking_id`) AS totalCount FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE DATE(`t`.`created_at`)>='"+fromDate+"' AND DATE(`t`.`created_at`) <='"+toDate+"'"+organizationIdQ+statusQ+"",{ type: Sequelize.QueryTypes.SELECT });
                if(TotalTrackingCount.length > 0) { //query result length check                    
                    res.status(200).json({success: true,data:TotalTrackingCount}); //Return json with data or empty
                } else {
                    res.status(200).json({ success: false,data: "No data found!"});// Return json with error massage
                }
            }else{
                res.status(200).json({ success: mobileVali.passes(),data:mobileVali.errors.errors});// Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Total Tracking Count ends *******************************/

/************************* Change Tracking Status start *******************************/
exports.getChangeTrackingStatus = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, status } = req.body;
            var mobileVali = validation.getChangeTrackingStatus(req.body);    
            if(mobileVali.passes()===true){
                var ChangeTrackingStatus =await sequelize.query("UPDATE `tracking_details` SET `status`='"+status+"' WHERE `tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
                if(ChangeTrackingStatus.slice(-1)[0] > 0){ //query result length check
                    res.status(200).send({ success: true}); //Return json with data or empty
                }else{
                    res.status(200).json({ success: false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data:mobileVali.errors.errors});// Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Change Tracking Status ends *******************************/

/************************* Enable Disable Tracking start *******************************/
exports.getEnableDisableTracking = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, active } = req.body;
            var mobileVali = validation.getEnableDisableTracking(req.body);    
            if(mobileVali.passes()===true){
                if(active=='enable'){ // update active
                    var EnableDisableTracking =await sequelize.query("UPDATE `tracking_details` SET `active_status`='active' WHERE `tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
                } else { // update inactive
                    var EnableDisableTracking =await sequelize.query("UPDATE `tracking_details` SET `active_status`='inactive' WHERE `tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
                }
                if(EnableDisableTracking.slice(-1)[0] > 0){ //query result length check
                    res.status(200).send({ success: true}); //Return json with data or empty
                }else{
                    res.status(200).json({ success: false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data:mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Enable Disable Tracking ends *******************************/

/************************* Tracking Details start *******************************/
exports.getTrackingDetails = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId } = req.body;
            var mobileVali = validation.getTrackingDetailss(req.body);    
            if(mobileVali.passes()===true){
                var TrackingDetails =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `l`.`id` AS loadId, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `b`.`city` AS BranchCity, `b`.`state` AS BranchState, `t`.`from_location`, `t`.`to_location`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `t`.`driver_name` AS driverName, `t`.`driver_mobile_number` AS driverMobileNumber, `t`.`current_tracking_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers`, `t`.`vehicle_number` AS vehicleNumber, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`other_mobile_number`, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude`, `t`.`other_location` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(TrackingDetails.length > 0){ //query result length check
                    for (var p = 0; p < TrackingDetails.length; p++) {
                        let k = TrackingDetails[p];
                        TrackingDetails[p]['From'] = JSON.parse(k.from_location);
                        TrackingDetails[p]['To'] = JSON.parse(k.to_location);
                        TrackingDetails[p]['otherLocation'] = JSON.parse(k.other_location);
                        TrackingDetails[p]['trackkedMobileNumbers'] = JSON.parse(k.tracked_mobile_mumbers);                        
                        TrackingDetails[p]['trackingDetails'] = [];
                        if(k.time_stamp!='' && k.latitude!='' && k.longitude!=''){
                            let trackingDetails = {};
                            let timeStamp = k.time_stamp.split(',');let latitude = k.latitude.split(',');let longitude = k.longitude.split(',');
                            for (let i = 0; i < timeStamp.length; i++) {
                                let trackingDetails = {"latitude":latitude[i], "longitude":longitude[i],"timeStamp":timeStamp[i]};
                                TrackingDetails[p]['trackingDetails'].push(trackingDetails);
                            }
                        }
                        TrackingDetails[p]['otherMobileNumber'] = JSON.parse(k.other_mobile_number);
                        delete TrackingDetails[p].latitude;delete TrackingDetails[p].longitude;delete TrackingDetails[p].time_stamp;
                        delete TrackingDetails[p].from_location;delete TrackingDetails[p].to_location;delete TrackingDetails[p].tracked_mobile_mumbers;
                        delete TrackingDetails[p].other_mobile_number;delete TrackingDetails[p].other_location;
                    }
                    res.status(200).json({success: true,data: TrackingDetails}); //Return json with data or empty
                } else {
                    res.status(200).json({ success: false,data: "No data found!"});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data:mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Tracking Details ends *******************************/

/************************* Search Organization start *******************************/
exports.getSearchOrganization = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, organizationName } = req.body;
            var mobileVali = validation.getOrganizationSearch(req.body);
            var SearchOrganization = '';
            var queryQ='';
            if(mobileVali.passes()===true){
                if(organizationName !='' && organizationName!=undefined && organizationId !='' && organizationId!=undefined){
                    queryQ = "WHERE `e`.`id`="+organizationId+" OR `e`.`organisation_name`='%"+organizationName+"%'";
                } else if(organizationId !='' && organizationId!=undefined) {
                    queryQ = "WHERE `e`.`id`="+organizationId+"";
                } else if(organizationName !='' && organizationName!=undefined) {
                    queryQ = "WHERE `e`.`organisation_name`='%"+organizationName+"%'";
                }
                if(queryQ!=''){
                    var SearchOrganization =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `tm`.`load_id` AS loadId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` "+queryQ+"",{ type: Sequelize.QueryTypes.SELECT });
                }
                if(SearchOrganization.length > 0) { //query result length check
                    for (var p = 0; p < SearchOrganization.length; p++) {
                        let k = SearchOrganization[p];
                        SearchOrganization[p]['From'] = JSON.parse(k.from_location);
                        SearchOrganization[p]['To'] = JSON.parse(k.to_location);
                        SearchOrganization[p]['otherLocation'] = JSON.parse(k.other_location);
                        SearchOrganization[p]['trackkedMobileNumbers'] = JSON.parse(k.tracked_mobile_mumbers);
                        SearchOrganization[p]['trackingDetails'] = [];
                        if(k.time_stamp!='' && k.latitude!='' && k.longitude!=''){
                            let trackingDetails = {};
                            let timeStamp = k.time_stamp.split(',');let latitude = k.latitude.split(',');let longitude = k.longitude.split(',');
                            for (let i = 0; i < timeStamp.length; i++) {
                                let trackingDetails = {"latitude":latitude[i], "longitude":longitude[i],"timeStamp":timeStamp[i]};
                                SearchOrganization[p]['trackingDetails'].push(trackingDetails);
                            }
                        }
                        SearchOrganization[p]['otherMobileNumber'] = JSON.parse(k.other_mobile_number);
                        delete SearchOrganization[p].latitude;delete SearchOrganization[p].longitude;delete SearchOrganization[p].time_stamp;
                        delete SearchOrganization[p].from_location;delete SearchOrganization[p].to_location;delete SearchOrganization[p].tracked_mobile_mumbers;
                        delete SearchOrganization[p].other_mobile_number;delete SearchOrganization[p].other_location;
                    }
                    res.status(200).json({success: true,data: SearchOrganization}); //Return json with data or empty
                } else {
                    res.status(200).json({ success: false,data: "No data found!"});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors});// Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Search Organization ends *******************************/

/************************* Get Tracking list start *******************************/
exports.getTracking = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, organizationId } = req.body;
            var mobileVali = validation.getTracking(req.body);
            if(mobileVali.passes()===true){
                var queryQ='';
                if((trackingId !='' && trackingId!=undefined) && (organizationId !='' && organizationId!=undefined)){
                    queryQ = "WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+"";
                } else if(trackingId !='' && trackingId!=undefined) {
                    queryQ = "WHERE `t`.`tracking_id`="+trackingId+"";
                } else if(organizationId !='' && organizationId!=undefined) {
                    queryQ = "WHERE `e`.`id`="+organizationId+"";
                }
                if(queryQ!=''){
                    var TrackingList =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `l`.`id` AS loadId, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `b`.`city` AS BranchCity, `b`.`state` AS BranchState, `t`.`from_location`, `t`.`to_location`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `t`.`driver_name` AS driverName, `t`.`driver_mobile_number` AS driverMobileNumber, `t`.`current_tracking_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers`, `t`.`vehicle_number` AS vehicleNumber, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`other_mobile_number`, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude`, `t`.`other_location` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` "+queryQ+"",{ type: Sequelize.QueryTypes.SELECT });
                } else {
                    var TrackingList =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `l`.`id` AS loadId, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `b`.`city` AS BranchCity, `b`.`state` AS BranchState, `t`.`from_location`, `t`.`to_location`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `t`.`driver_name` AS driverName, `t`.`driver_mobile_number` AS driverMobileNumber, `t`.`current_tracking_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers`, `t`.`vehicle_number` AS vehicleNumber, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`other_mobile_number`, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude`, `t`.`other_location` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id`",{ type: Sequelize.QueryTypes.SELECT });
                }
                if(TrackingList.length > 0) { //query result length check
                    for (var p = 0; p < TrackingList.length; p++) {
                        let k = TrackingList[p];
                        TrackingList[p]['From'] = JSON.parse(k.from_location);
                        TrackingList[p]['To'] = JSON.parse(k.to_location);
                        TrackingList[p]['otherLocation'] = JSON.parse(k.other_location);
                        TrackingList[p]['trackkedMobileNumbers'] = JSON.parse(k.tracked_mobile_mumbers);
                        TrackingList[p]['trackingDetails'] = [];
                        if(k.time_stamp!='' && k.latitude!='' && k.longitude!=''){
                            let trackingDetails = {};
                            let timeStamp = k.time_stamp.split(',');let latitude = k.latitude.split(',');let longitude = k.longitude.split(',');
                            for (let i = 0; i < timeStamp.length; i++) {
                                let trackingDetails = {"latitude":latitude[i], "longitude":longitude[i],"timeStamp":timeStamp[i]};
                                TrackingList[p]['trackingDetails'].push(trackingDetails);
                            }
                        }
                        TrackingList[p]['otherMobileNumber'] = JSON.parse(k.other_mobile_number);
                        delete TrackingList[p].latitude;delete TrackingList[p].longitude;delete TrackingList[p].time_stamp;
                        delete TrackingList[p].from_location;delete TrackingList[p].to_location;delete TrackingList[p].tracked_mobile_mumbers;
                        delete TrackingList[p].other_mobile_number;delete TrackingList[p].other_location;
                    }
                    res.status(200).json({success: true,data: TrackingList}); //Return json with data or empty
                } else {
                    res.status(200).json({ success: false,data: "No data found!"});
                }
            }else{
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors});// Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Get Tracking list ends *******************************/

/************************* Create Tracking start *******************************/
exports.createTracking = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { userId, organizationId, branchId, loadId, startDate, vehicleNumber, driverNumber, driverName, otherMobileNumber, driverMobileOnTrack, from, to, totalTrackCount, comment, otherLocation} = req.body;
            var mobileVali = validation.getTrackingAdd(req.body);
            if(mobileVali.passes()===true){
                var otherMobileNumbers = JSON.stringify(otherMobileNumber);
                var froms = JSON.stringify(from);
                var tos = JSON.stringify(to);
                var otherLocations = JSON.stringify(otherLocation);
                var createTracking = await sequelize.query("INSERT INTO `tracking_details`(`tracking_count`,`max_tracking_count`, `driver_mobile_number`, `comment`, `tracked_by_user_id`, `driver_name`, `vehicle_number`,`other_mobile_number`, `driver_mobile_on_track`, `from_location`, `to_location`, `start_date`, `created_by`,`other_location`) VALUES (0, "+totalTrackCount+", '"+driverNumber+"', '"+comment+"', "+userId+", '"+driverName+"', '"+vehicleNumber+"', '"+otherMobileNumbers+"', "+driverMobileOnTrack+", '"+froms+"', '"+tos+"', '"+startDate+"', "+userId+",'"+otherLocations+"')",{ type: Sequelize.QueryTypes.INSERT });
                var TrId = createTracking.slice(0,1);
                var updateTracking = await sequelize.query("UPDATE tracking_details SET `tracking_id`='"+TrId+"', `status`='in-progress', `active_status`='active' WHERE `id`="+TrId+"",{ type: Sequelize.QueryTypes.UPDATE });
                var createTrackingMapped = await sequelize.query("INSERT INTO `tracking_mappers`(`user_id`, `load_id`, `tracking_id`, `branch_id`) VALUES ("+userId+","+loadId+","+TrId+","+branchId+")",{ type: Sequelize.QueryTypes.INSERT });
                if(createTracking.slice(-1)[0] > 0) {
                    var trakId = createTracking.slice(0,1);
                    res.status(200).send({ success: true,"trackingId":trakId[0]}); //Return json with data or empty
                } else {
                    res.status(200).json({success:false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors});// Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Create Tracking ends *******************************/

/************************* Edit Tracking start *******************************/
exports.editTracking = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, userId, organizationId, branchId, loadId, startDate, vehicleNumber, driverNumber, driverName, otherMobileNumber, driverMobileOnTrack, from, to, totalTrackCount, comment, otherLocation } = req.body;
            var mobileVali = validation.getTrackingEdit(req.body);
            if(mobileVali.passes()===true){
                var otherMobileNumbers = JSON.stringify(otherMobileNumber);
                var froms = JSON.stringify(from);
                var tos = JSON.stringify(to);
                var otherLocations = JSON.stringify(otherLocation);
                var createTracking = await sequelize.query("UPDATE `tracking_details` SET `tracking_count`=0,`max_tracking_count`="+totalTrackCount+", `driver_mobile_number`='"+driverNumber+"', `comment`='"+comment+"', `tracked_by_user_id`='"+userId+"', `driver_name`='"+driverName+"', `vehicle_number`='"+vehicleNumber+"', `other_mobile_number`='"+otherMobileNumbers+"', `driver_mobile_on_track`='"+driverMobileOnTrack+"', `from_location`='"+froms+"', `to_location`='"+tos+"', `start_date`='"+startDate+"', `updated_by`="+userId+", `other_location`='"+otherLocations+"' WHERE id="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
                var createTrackingMapped = await sequelize.query("UPDATE `tracking_mappers` SET `user_id`="+userId+", `load_id`="+loadId+", `tracking_id`="+trackingId+", `branch_id`="+branchId+" WHERE tracking_id="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
                if(createTracking.slice(-1)[0] > 0) {
                    res.status(200).json({success:true}); //Return json with data or empty
                } else {
                    res.status(200).json({success:false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors});// Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Edit Tracking ends *******************************/

/************************* Particular Tracking Details start *******************************/
exports.particularTrackingDetails = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, organizationId } = req.body;
            var mobileVali = validation.particularTrackingDetails(req.body);
            if(mobileVali.passes()===true){
                var SearchOrganization =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `l`.`id` AS loadId, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `b`.`city` AS BranchCity, `b`.`state` AS BranchState, `t`.`from_location`, `t`.`to_location`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `t`.`driver_name` AS driverName, `t`.`driver_mobile_number` AS driverMobileNumber, `t`.`current_tracking_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers`, `t`.`vehicle_number` AS vehicleNumber, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`other_mobile_number`, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude`, `t`.`other_location` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(SearchOrganization.length > 0) { //query result length check
                    for (var p = 0; p < SearchOrganization.length; p++) {
                        let k = SearchOrganization[p];
                        SearchOrganization[p]['From'] = JSON.parse(k.from_location);
                        SearchOrganization[p]['To'] = JSON.parse(k.to_location);
                        SearchOrganization[p]['otherLocation'] = JSON.parse(k.other_location);
                        SearchOrganization[p]['trackkedMobileNumbers'] = JSON.parse(k.tracked_mobile_mumbers);
                        SearchOrganization[p]['trackingDetails'] = [];
                        if(k.time_stamp!='' && k.latitude!='' && k.longitude!=''){
                            let trackingDetails = {};
                            let timeStamp = k.time_stamp.split(',');let latitude = k.latitude.split(',');let longitude = k.longitude.split(',');
                            for (let i = 0; i < timeStamp.length; i++) {
                                let trackingDetails = {"latitude":latitude[i], "longitude":longitude[i],"timeStamp":timeStamp[i]};
                                SearchOrganization[p]['trackingDetails'].push(trackingDetails);
                            }
                        }
                        SearchOrganization[p]['otherMobileNumber'] = JSON.parse(k.other_mobile_number);
                        delete SearchOrganization[p].latitude;delete SearchOrganization[p].longitude;delete SearchOrganization[p].time_stamp;
                        delete SearchOrganization[p].from_location;delete SearchOrganization[p].to_location;delete SearchOrganization[p].tracked_mobile_mumbers;
                        delete SearchOrganization[p].other_mobile_number;delete SearchOrganization[p].other_location;
                    }
                    res.status(200).json({success: true,data: SearchOrganization}); //Return json with data or empty
                } else {
                    res.status(200).json({ success: false,data: "No data found!"}); // Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Particular Tracking Details ends *******************************/

/************************* Update Tracking Status start *******************************/
exports.updateTrackingStatus = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, organizationId, status } = req.body;
            var mobileVali = validation.updateTrackingStatus(req.body);
            if(mobileVali.passes()===true){
                var updateTrackingStatus =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
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
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Update Tracking Status ends *******************************/

/************************* Update Tracking Status start *******************************/
exports.updateTrackingDetails = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, organizationId, trackingDetails } = req.body;
            var mobileVali = validation.updateTrackingDetails(req.body);
            if(mobileVali.passes()===true){
                var updateTrackingDetails =await sequelize.query("SELECT `t`.`id` AS Id, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+" ",{ type: Sequelize.QueryTypes.SELECT });
                if(updateTrackingDetails.length > 0){
                    var timeStamp = (updateTrackingDetails[0].time_stamp!='') ? updateTrackingDetails[0].time_stamp+','+trackingDetails.timeStamp : trackingDetails.timeStamp;
                    var latitude = (updateTrackingDetails[0].latitude!='') ? updateTrackingDetails[0].latitude+','+trackingDetails.latitude : trackingDetails.latitude;
                    var longitude = (updateTrackingDetails[0].longitude!='') ? updateTrackingDetails[0].longitude+','+trackingDetails.longitude : trackingDetails.longitude;
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
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Update Tracking Status ends *******************************/

/************************* Update Tracking Active start *******************************/
exports.updateTrackingActive = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, organizationId, active } = req.body;
            var mobileVali = validation.updateTrackingActive(req.body);
            if(mobileVali.passes()===true){
                var activeR = (active=="true") ? 'active' : 'inactive';
                var updateTrackingActive =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(updateTrackingActive.length > 0){
                    var TrackingActive =await sequelize.query("UPDATE tracking_details SET `active_status`='"+activeR+"' WHERE `id`="+updateTrackingActive[0].Id+"",{ type: Sequelize.QueryTypes.UPDATE });
                    if(TrackingActive.slice(-1)[0] > 0) {
                        res.status(200).json({success:true}); //Return json with data or empty
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
                } else {
                    res.status(200).json({success:false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Update Tracking Active ends *******************************/

/************************* Update Active Mobile Number start *******************************/
exports.updateActiveMobileNumber = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, organizationId, activeMobileNumber } = req.body;
            var mobileVali = validation.updateActiveMobileNumber(req.body);
            if(mobileVali.passes()===true){
                var updateActiveMobileNumber =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(updateActiveMobileNumber.length > 0){
                    var activeMobileNumbers = JSON.stringify(activeMobileNumber);
                    var ActiveMobileNumber =await sequelize.query("UPDATE `tracking_details` SET `tracked_mobile_number`='"+activeMobileNumbers+"', `tracked_mobile_mumbers`='"+activeMobileNumbers+"', `current_tracking_number`='"+activeMobileNumbers+"' WHERE `id`="+updateActiveMobileNumber[0].Id+"",{ type: Sequelize.QueryTypes.UPDATE });
                    if(ActiveMobileNumber.slice(-1)[0] > 0) {
                        res.status(200).json({success:true}); //Return json with data or empty
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
                } else {
                    res.status(200).json({success:false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Update Active Mobile Number ends *******************************/

/************************* add Contact And Mobile Number start *******************************/
exports.addContactandMobileNumber = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, organizationId, addMobileNumber } = req.body;
            var mobileVali = validation.addContactandMobileNumber(req.body);
            if(mobileVali.passes()===true){
                var addContactandMobileNumber =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(addContactandMobileNumber.length > 0){
                    var addMobileNumberT = JSON.stringify(addMobileNumber);
                    var addContactMobileNumber =await sequelize.query("UPDATE `tracking_details` SET `add_mobile_number`='"+addMobileNumberT+"' WHERE `id`="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
                    if(addContactMobileNumber.slice(-1)[0] > 0) {
                        res.status(200).json({success:true}); //Return json with data or empty
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
                } else {
                    res.status(200).json({success:false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Update Active Mobile Number ends *******************************/

/************************* add Contact And Mobile Number start *******************************/
exports.editOtherMobileNumber = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, otherMobileNumber } = req.body;
            var mobileVali = validation.editOtherMobileNumber(req.body);
            if(mobileVali.passes()===true){
                var getOtherMobileNumber =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(getOtherMobileNumber.length > 0){
                    var otherMobileNumberT = JSON.stringify(otherMobileNumber);
                    var editOtherMobileNumber =await sequelize.query("UPDATE `tracking_details` SET `other_mobile_number`='"+otherMobileNumberT+"' WHERE `id`="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
                    if(editOtherMobileNumber.slice(-1)[0] > 0) {
                        res.status(200).json({success:true}); //Return json with data or empty
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
                } else {
                    res.status(200).json({success:false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Update Active Mobile Number ends *******************************/

/************************* add Contact And Mobile Number start *******************************/
exports.editOtherLocation = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, otherLocation } = req.body;
            var mobileVali = validation.editOtherLocation(req.body);
            if(mobileVali.passes()===true){
                var getOtherLocation =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(getOtherLocation.length > 0){
                    var otherLocationT = JSON.stringify(otherLocation);
                    var editOtherLocation =await sequelize.query("UPDATE `tracking_details` SET `other_location`='"+otherLocationT+"' WHERE `id`="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
                    if(editOtherLocation.slice(-1)[0] > 0) {
                        res.status(200).json({success:true}); //Return json with data or empty
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
                } else {
                    res.status(200).json({success:false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Update Active Mobile Number ends *******************************/

/************************* add Contact And Mobile Number start *******************************/
exports.editParticularSection = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, otherLocation, otherMobileNumber, totalTrackCount, comment } = req.body;
            var mobileVali = validation.editParticularSection(req.body);
            if(mobileVali.passes()===true){
                var getOtherLocation =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(getOtherLocation.length > 0){
                    var otherLocationT = JSON.stringify(otherLocation);
                    var otherMobileNumberT = JSON.stringify(otherMobileNumber);
                    var editOtherLocation =await sequelize.query("UPDATE `tracking_details` SET `other_mobile_number`='"+otherMobileNumberT+"', `other_location`='"+otherLocationT+"',`max_tracking_count`="+totalTrackCount+", `comment`='"+comment+"' WHERE `id`="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
                    if(editOtherLocation.slice(-1)[0] > 0) {
                        res.status(200).json({success:true}); //Return json with data or empty
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
                } else {
                    res.status(200).json({success:false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Update Active Mobile Number ends *******************************/

/************************* add Contact And Mobile Number start *******************************/
exports.editToLocation = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, organizationId, to } = req.body;
            var mobileVali = validation.editToLocation(req.body);
            if(mobileVali.passes()===true){
                var getToLocation =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(getToLocation.length > 0){
                    var toT = JSON.stringify(to);
                    var editToLocations =await sequelize.query("UPDATE `tracking_details` SET `to_location`='"+toT+"' WHERE `id`="+getToLocation[0].Id+"",{ type: Sequelize.QueryTypes.UPDATE });
                    if(editToLocations.slice(-1)[0] > 0) {
                        res.status(200).json({success:true}); //Return json with data or empty
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
                } else {
                    res.status(200).json({success:false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Update Active Mobile Number ends *******************************/

/************************* add Contact And Mobile Number start *******************************/
exports.editTrakingCount = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, organizationId, trackingCount } = req.body;
            var mobileVali = validation.editTrakingCount(req.body);
            if(mobileVali.passes()===true){
                var getTrackingCount =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(getTrackingCount.length > 0){
                    var editTrakingCount =await sequelize.query("UPDATE `tracking_details` SET `tracking_count`='"+trackingCount+"' WHERE `id`="+getTrackingCount[0].Id+"",{ type: Sequelize.QueryTypes.UPDATE });
                    if(editTrakingCount.slice(-1)[0] > 0) {
                        res.status(200).json({success:true}); //Return json with data or empty
                    } else {
                        res.status(200).json({success:false});// Return json with error massage
                    }
                } else {
                    res.status(200).json({success:false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Update Active Mobile Number ends *******************************/

/************************* add Contact And Mobile Number start *******************************/
exports.sendSmsForDrop = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, organizationId } = req.body;
            var mobileVali = validation.sendSmsForDrop(req.body);
            if(mobileVali.passes()===true){
                var getContactNumber =await sequelize.query("SELECT `t`.`vehicle_number` AS vehicleNumber, `t`.`driver_mobile_number` AS driverMN, `tm`.`load_id` AS loadId, `t`.`from_location` AS `From`, `t`.`to_location` AS `To`, `t`.`other_location` AS otherLocation, `e`.`contact_mobile_number` AS orgCMN, `e`.`primary_contact_no` AS orgPCN, `b`.`contact_number` AS branchCN, `l`.`pickup_person_mobile` AS loadPPM, `l`.`drop_person_mobile` AS loadDPM, `u`.`mobile` AS userM  FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(getContactNumber.length > 0){
                    let Froms = JSON.parse(getContactNumber[0].From);
                    let Tos = JSON.parse(getContactNumber[0].To);
                    let otherLocations = JSON.parse(getContactNumber[0].otherLocation);
                    //let phoneNumberT = getContactNumber[0].branchCN+','+getContactNumber[0].orgCMN+','+getContactNumber[0].orgPCN+','+getContactNumber[0].loadPPM+','+getContactNumber[0].loadDPM+','+getContactNumber[0].userM+','+getContactNumber[0].driverMN;
                    let phoneNumberT = getContactNumber[0].branchCN+','+getContactNumber[0].orgCMN;
                    var contentT = 'Vehicle '+getContactNumber[0].vehicleNumber;
                    if(getContactNumber[0].loadId>0){
                        contentT +=' (loadId: '+getContactNumber[0].loadId+')';
                    }
                    if(Froms!=''){
                        contentT +=' From '+Froms.city+', '+Froms.state;
                    }                    
                    if(otherLocations!=''){
                        contentT +=' via '
                        for (var p = 0; p < otherLocations.length; p++) {
                            let k = otherLocations[p];
                            if(p == 0){
                                var reacheOther = (k.type=='drop') ? 'reached' : 'on the way';
                                contentT +=k.city+', '+k.state+' ('+reacheOther+')';
                            } else {
                                var reacheOther = (k.type=='drop') ? 'reached' : 'on the way';
                                contentT +=' - '+k.city+', '+k.state+' ('+reacheOther+')';
                            }
                        }
                    }
                    if(Tos!=''){
                        var reacheTo = (Tos.reached=='true') ? 'reached' : 'on the way';
                        contentT +=' To '+Tos.city+', '+Tos.state+' ('+reacheTo+')';
                    }
                    let phoneNumbersT = phoneNumberT.replace('null,', '');
                    let phoneNumbersS = phoneNumbersT.replace(',null', '');
                    let phoneNumbers = phoneNumbersS.replace('null', '');
                    https.get("https://app.indiasms.com/sendsms/bulksms.php?username=saktip&password=anmol123&type=TEXT&sender=EPVHAN&mobile="+phoneNumbers+"&message="+contentT+"", (resp) => {}).on("error", (err) => {});
                    res.status(200).json({success:true});
                } else {
                    res.status(200).json({success:false});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Update Active Mobile Number ends *******************************/

/************************* Bulk traking Upload start *******************************/
exports.bulkTrakingUpload = async function(req, res, next) {
    const readXlsxFile = require('read-excel-file/node');
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { file } = req.body;
            var getFile = helper.uploadXlsx(file);
            var filePath = helper.getFile(getFile);
            readXlsxFile(filePath).then((rows) => {
                let newExcelArray = []; // new array
                let arrkey = rows[0]; // get key
                delete rows[0];// delete 0 position
                rows.forEach(function(k,p){
                    let newArray = {};
                    for(var j = 0; j < k.length; j++){
                        newArray[arrkey[j]]=k[j];
                    }
                    newExcelArray.push(newArray);
                });
                for (var w = 0; w < newExcelArray.length; w++) {
                    var otherLocations=[];
                    newExcelArray[w]['otherLocations'] = [];                    
                    var otherMobileNumbers=[];
                    newExcelArray[y]['otherMobileNumbers'] = [];
                    if((newExcelArray[w].otherlocation_0_lat!=undefined && newExcelArray[w].otherlocation_0_lat!='') 
                        && (newExcelArray[w].otherlocation_0_lang!=undefined && newExcelArray[w].otherlocation_0_lang!='') 
                        && (newExcelArray[w].otherlocation_0_type!=undefined && newExcelArray[w].otherlocation_0_type!='')){
                        let otherLocation = {'lat':newExcelArray[w].otherlocation_0_lat,'lang':newExcelArray[w].otherlocation_0_lang,'type':newExcelArray[w].otherlocation_0_type};
                        otherLocations.push(otherLocation);
                        delete newExcelArray[w]['otherlocation_0_lat'];
                        delete newExcelArray[w]['otherlocation_0_lang'];
                        delete newExcelArray[w]['otherlocation_0_type'];
                    } else if(newExcelArray[w].otherlocation_0_lat!=undefined && newExcelArray[w].otherlocation_0_lang!=undefined &&  newExcelArray[w].otherlocation_0_type!=undefined){                            
                        delete newExcelArray[w]['otherlocation_0_lat'];
                        delete newExcelArray[w]['otherlocation_0_lang'];
                        delete newExcelArray[w]['otherlocation_0_type'];
                    }
                    if((newExcelArray[w].otherlocation_1_lat!=undefined && newExcelArray[w].otherlocation_1_lat!='') 
                        && (newExcelArray[w].otherlocation_1_lang!=undefined && newExcelArray[w].otherlocation_1_lang!='') 
                        && (newExcelArray[w].otherlocation_1_type!=undefined && newExcelArray[w].otherlocation_1_type!='')){
                        let otherLocation = {'lat':newExcelArray[w].otherlocation_1_lat,'lang':newExcelArray[w].otherlocation_1_lang,'type':newExcelArray[w].otherlocation_1_type};
                        otherLocations.push(otherLocation);
                        delete newExcelArray[w]['otherlocation_1_lat'];
                        delete newExcelArray[w]['otherlocation_1_lang'];
                        delete newExcelArray[w]['otherlocation_1_type'];
                    } else if(newExcelArray[w].otherlocation_1_lat!=undefined && newExcelArray[w].otherlocation_1_lang!=undefined &&  newExcelArray[w].otherlocation_1_type!=undefined){                            
                        delete newExcelArray[w]['otherlocation_1_lat'];
                        delete newExcelArray[w]['otherlocation_1_lang'];
                        delete newExcelArray[w]['otherlocation_1_type'];
                    }
                    if((newExcelArray[w].otherlocation_2_lat!=undefined && newExcelArray[w].otherlocation_2_lat!='') 
                        && (newExcelArray[w].otherlocation_2_lang!=undefined && newExcelArray[w].otherlocation_2_lang!='') 
                        && (newExcelArray[w].otherlocation_2_type!=undefined && newExcelArray[w].otherlocation_2_type!='')){
                        let otherLocation = {'lat':newExcelArray[w].otherlocation_2_lat,'lang':newExcelArray[w].otherlocation_2_lang,'type':newExcelArray[w].otherlocation_2_type};
                        otherLocations.push(otherLocation);
                        delete newExcelArray[w]['otherlocation_2_lat'];
                        delete newExcelArray[w]['otherlocation_2_lang'];
                        delete newExcelArray[w]['otherlocation_2_type'];
                    } else if(newExcelArray[w].otherlocation_2_lat!=undefined && newExcelArray[w].otherlocation_2_lang!=undefined &&  newExcelArray[w].otherlocation_2_type!=undefined){                            
                        delete newExcelArray[w]['otherlocation_2_lat'];
                        delete newExcelArray[w]['otherlocation_2_lang'];
                        delete newExcelArray[w]['otherlocation_2_type'];
                    }
                    if((newExcelArray[w].otherlocation_3_lat!=undefined && newExcelArray[w].otherlocation_3_lat!='') 
                        && (newExcelArray[w].otherlocation_3_lang!=undefined && newExcelArray[w].otherlocation_3_lang!='') 
                        && (newExcelArray[w].otherlocation_3_type!=undefined && newExcelArray[w].otherlocation_3_type!='')){
                        let otherLocation = {'lat':newExcelArray[w].otherlocation_3_lat,'lang':newExcelArray[w].otherlocation_3_lang,'type':newExcelArray[w].otherlocation_3_type};
                        otherLocations.push(otherLocation);
                        delete newExcelArray[w]['otherlocation_3_lat'];
                        delete newExcelArray[w]['otherlocation_3_lang'];
                        delete newExcelArray[w]['otherlocation_3_type'];
                    } else if(newExcelArray[w].otherlocation_3_lat!=undefined && newExcelArray[w].otherlocation_3_lang!=undefined &&  newExcelArray[w].otherlocation_3_type!=undefined){                            
                        delete newExcelArray[w]['otherlocation_3_lat'];
                        delete newExcelArray[w]['otherlocation_3_lang'];
                        delete newExcelArray[w]['otherlocation_3_type'];
                    }
                    newExcelArray[w]['otherLocations'] = JSON.stringify(otherLocations);
                    let from = {};
                    let to = {};
                    if((newExcelArray[w].from_lat!=undefined && newExcelArray[w].from_lat!='') && (newExcelArray[w].from_lang!=undefined && newExcelArray[w].from_lang!='') 
                    && (newExcelArray[w].from_city!=undefined && newExcelArray[w].from_city!='') && (newExcelArray[w].from_state!=undefined && newExcelArray[w].from_state!='')){
                        from['lat']=newExcelArray[w].from_lat;
                        from['lang']=newExcelArray[w].from_lang;
                        from['city']=newExcelArray[w].from_city;
                        from['state']=newExcelArray[w].from_state;
                        delete newExcelArray[w]['from_lat'];
                        delete newExcelArray[w]['from_lang'];
                        delete newExcelArray[w]['from_city'];
                        delete newExcelArray[w]['from_state'];
                        newExcelArray[w]['from']=from;
                    } else if(newExcelArray[w].from_lat!=undefined && newExcelArray[w].from_lang!=undefined 
                    && newExcelArray[w].from_city!=undefined && newExcelArray[w].from_state!=undefined) {
                        delete newExcelArray[w]['from_lat'];
                        delete newExcelArray[w]['from_lang'];
                        delete newExcelArray[w]['from_city'];
                        delete newExcelArray[w]['from_state'];
                        newExcelArray[w]['from']=from;
                    }
                    if((newExcelArray[w].to_lat!=undefined && newExcelArray[w].to_lat!='') && (newExcelArray[w].to_lang!=undefined && newExcelArray[w].to_lang!='') && (newExcelArray[w].to_reached!=undefined || newExcelArray[w].to_reached!='')
                    && (newExcelArray[w].to_city!=undefined || newExcelArray[w].to_city!='') && (newExcelArray[w].to_state!=undefined || newExcelArray[w].to_state!='')){
                        to['lat']=newExcelArray[w].to_lat;
                        to['lang']=newExcelArray[w].to_lang;
                        to['reached']=newExcelArray[w].to_reached;
                        to['city']=newExcelArray[w].to_city;
                        to['state']=newExcelArray[w].to_state;
                        delete newExcelArray[w]['to_lat'];
                        delete newExcelArray[w]['to_lang'];
                        delete newExcelArray[w]['to_reached'];
                        delete newExcelArray[w]['to_city'];
                        delete newExcelArray[w]['to_state'];
                        newExcelArray[w]['to']=to;
                    } else if(newExcelArray[w].to_lat!=undefined && newExcelArray[w].to_lang!=undefined && newExcelArray[w].to_reached!=undefined 
                    && newExcelArray[w].to_city!=undefined && newExcelArray[w].to_state!=undefined) {
                        delete newExcelArray[w]['to_lat'];
                        delete newExcelArray[w]['to_lang'];
                        delete newExcelArray[w]['to_reached'];
                        delete newExcelArray[w]['to_city'];
                        delete newExcelArray[w]['to_state'];
                        newExcelArray[w]['to']=to;
                    }
                    if((newExcelArray[w].otherMobileNumber_0_name!=undefined && newExcelArray[w].otherMobileNumber_0_name!='') 
                        && (newExcelArray[w].otherMobileNumber_0_mobileNumber!=undefined && newExcelArray[w].otherMobileNumber_0_mobileNumber!='') 
                        && (newExcelArray[w].otherMobileNumber_0_onTrack!=undefined && newExcelArray[w].otherMobileNumber_0_onTrack!='') 
                        && (newExcelArray[w].otherMobileNumber_0_active!=undefined && newExcelArray[w].otherMobileNumber_0_active!='')){
                        let otherMobileNumber = {'name':newExcelArray[w].otherMobileNumber_0_name,'mobileNumber':newExcelArray[w].otherMobileNumber_0_mobileNumber, 'onTrack':newExcelArray[w].otherMobileNumber_0_onTrack,'active':newExcelArray[w].otherMobileNumber_0_active};
                        otherMobileNumbers.push(otherMobileNumber);
                        delete newExcelArray[w]['otherMobileNumber_0_name'];
                        delete newExcelArray[w]['otherMobileNumber_0_mobileNumber'];
                        delete newExcelArray[w]['otherMobileNumber_0_onTrack'];
                        delete newExcelArray[w]['otherMobileNumber_0_active'];
                    } else if(newExcelArray[w].otherMobileNumber_0_name!=undefined && newExcelArray[w].otherMobileNumber_0_mobileNumber!=undefined 
                        &&  newExcelArray[w].otherMobileNumber_0_onTrack!=undefined &&  newExcelArray[w].otherMobileNumber_0_active!=undefined){
                        delete newExcelArray[w]['otherMobileNumber_0_name'];
                        delete newExcelArray[w]['otherMobileNumber_0_mobileNumber'];
                        delete newExcelArray[w]['otherMobileNumber_0_onTrack'];
                        delete newExcelArray[w]['otherMobileNumber_0_active'];
                    }
                    if((newExcelArray[w].otherMobileNumber_1_name!=undefined && newExcelArray[w].otherMobileNumber_1_name!='') 
                        && (newExcelArray[w].otherMobileNumber_1_mobileNumber!=undefined && newExcelArray[w].otherMobileNumber_1_mobileNumber!='') 
                        && (newExcelArray[w].otherMobileNumber_1_onTrack!=undefined && newExcelArray[w].otherMobileNumber_1_onTrack!='') 
                        && (newExcelArray[w].otherMobileNumber_1_active!=undefined && newExcelArray[w].otherMobileNumber_1_active!='')){
                        let otherMobileNumber = {'name':newExcelArray[w].otherMobileNumber_1_name,'mobileNumber':newExcelArray[w].otherMobileNumber_1_mobileNumber, 'onTrack':newExcelArray[w].otherMobileNumber_1_onTrack,'active':newExcelArray[w].otherMobileNumber_1_active};
                        otherMobileNumbers.push(otherMobileNumber);
                        delete newExcelArray[w]['otherMobileNumber_1_name'];
                        delete newExcelArray[w]['otherMobileNumber_1_mobileNumber'];
                        delete newExcelArray[w]['otherMobileNumber_1_onTrack'];
                        delete newExcelArray[w]['otherMobileNumber_1_active'];
                    } else if(newExcelArray[w].otherMobileNumber_1_name!=undefined && newExcelArray[w].otherMobileNumber_1_mobileNumber!=undefined 
                        &&  newExcelArray[w].otherMobileNumber_1_onTrack!=undefined &&  newExcelArray[w].otherMobileNumber_1_active!=undefined){
                        delete newExcelArray[w]['otherMobileNumber_1_name'];
                        delete newExcelArray[w]['otherMobileNumber_1_mobileNumber'];
                        delete newExcelArray[w]['otherMobileNumber_1_onTrack'];
                        delete newExcelArray[w]['otherMobileNumber_1_active'];
                    }
                    if((newExcelArray[w].otherMobileNumber_2_name!=undefined && newExcelArray[w].otherMobileNumber_2_name!='') 
                        && (newExcelArray[w].otherMobileNumber_2_mobileNumber!=undefined && newExcelArray[w].otherMobileNumber_2_mobileNumber!='') 
                        && (newExcelArray[w].otherMobileNumber_2_onTrack!=undefined && newExcelArray[w].otherMobileNumber_2_onTrack!='') 
                        && (newExcelArray[w].otherMobileNumber_2_active!=undefined && newExcelArray[w].otherMobileNumber_2_active!='')){
                        let otherMobileNumber = {'name':newExcelArray[w].otherMobileNumber_2_name,'mobileNumber':newExcelArray[w].otherMobileNumber_2_mobileNumber, 'onTrack':newExcelArray[w].otherMobileNumber_2_onTrack,'active':newExcelArray[w].otherMobileNumber_2_active};
                        otherMobileNumbers.push(otherMobileNumber);
                        delete newExcelArray[w]['otherMobileNumber_2_name'];
                        delete newExcelArray[w]['otherMobileNumber_2_mobileNumber'];
                        delete newExcelArray[w]['otherMobileNumber_2_onTrack'];
                        delete newExcelArray[w]['otherMobileNumber_2_active'];
                    } else if(newExcelArray[w].otherMobileNumber_2_name!=undefined && newExcelArray[y].otherMobileNumber_2_mobileNumber!=undefined 
                        &&  newExcelArray[y].otherMobileNumber_2_onTrack!=undefined &&  newExcelArray[y].otherMobileNumber_2_active!=undefined){
                        delete newExcelArray[y]['otherMobileNumber_2_name'];
                        delete newExcelArray[y]['otherMobileNumber_2_mobileNumber'];
                        delete newExcelArray[y]['otherMobileNumber_2_onTrack'];
                        delete newExcelArray[y]['otherMobileNumber_2_active'];
                    }
                    if((newExcelArray[y].otherMobileNumber_3_name!=undefined && newExcelArray[y].otherMobileNumber_3_name!='') 
                        && (newExcelArray[y].otherMobileNumber_3_mobileNumber!=undefined && newExcelArray[y].otherMobileNumber_3_mobileNumber!='') 
                        && (newExcelArray[y].otherMobileNumber_3_onTrack!=undefined && newExcelArray[y].otherMobileNumber_3_onTrack!='') 
                        && (newExcelArray[y].otherMobileNumber_3_active!=undefined && newExcelArray[y].otherMobileNumber_3_active!='')){
                        let otherMobileNumber = {'name':newExcelArray[y].otherMobileNumber_3_name,'mobileNumber':newExcelArray[y].otherMobileNumber_3_mobileNumber, 'onTrack':newExcelArray[y].otherMobileNumber_3_onTrack,'active':newExcelArray[y].otherMobileNumber_3_active};
                        otherMobileNumbers.push(otherMobileNumber);
                        delete newExcelArray[y]['otherMobileNumber_3_name'];
                        delete newExcelArray[y]['otherMobileNumber_3_mobileNumber'];
                        delete newExcelArray[y]['otherMobileNumber_3_onTrack'];
                        delete newExcelArray[y]['otherMobileNumber_3_active'];
                    } else if(newExcelArray[y].otherMobileNumber_3_name!=undefined && newExcelArray[y].otherMobileNumber_3_mobileNumber!=undefined 
                        &&  newExcelArray[y].otherMobileNumber_3_onTrack!=undefined &&  newExcelArray[y].otherMobileNumber_3_active!=undefined){
                        delete newExcelArray[y]['otherMobileNumber_3_name'];
                        delete newExcelArray[y]['otherMobileNumber_3_mobileNumber'];
                        delete newExcelArray[y]['otherMobileNumber_3_onTrack'];
                        delete newExcelArray[y]['otherMobileNumber_3_active'];
                    }
                    newExcelArray[y]['otherMobileNumbers'] = JSON.stringify(otherMobileNumbers);
                }
                for (var x = 0; x < newExcelArray.length; x++) {
                    /*newExcelArray[x]['otherLocation'] = JSON.parse(newExcelArray[x].otherLocations);
                    newExcelArray[x]['otherMobileNumbers:'] = JSON.parse(newExcelArray[x].otherMobileNumbers);
                    delete newExcelArray[x].otherLocations;delete newExcelArray[x].otherMobileNumbers;*/
                }
                console.log(newExcelArray);
            });
            helper.deleteFile(filePath);
            res.status(200).json({ success: false,data: 'nodata'});
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Bulk traking Upload ends *******************************/