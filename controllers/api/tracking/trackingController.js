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
var Sequelize = require("sequelize");
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
                    var SearchTracking =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` "+queryQ+"",{ type: Sequelize.QueryTypes.SELECT });
                } else {
                    var SearchTracking ='';
                }
                if(SearchTracking.length > 0) { //query result length check
                    SearchTracking.forEach(function(k,p){
                        SearchTracking[p]['trackingDetails'] = {};
                        SearchTracking[p]['trackingDetails']['latitude'] = k.latitude;
                        SearchTracking[p]['trackingDetails']['longitude'] = k.longitude;
                        SearchTracking[p]['trackingDetails']['timeStamp'] = k.time_stamp;
                        delete SearchTracking[p].latitude;delete SearchTracking[p].longitude;delete SearchTracking[p].time_stamp;
                    });            
                    res.status(200).json({success: true,data:SearchTracking}); //Return json with data or empty
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
            const { organizationId, fromDate, toDate } = req.body;
            var mobileVali = validation.getCompleteTrackingList(req.body);    
            if(mobileVali.passes()===true){
                var organizationIdQ = (organizationId!='' && organizationId!=undefined) ? " AND `e`.`id`="+organizationId : "";
                var SearchTracking =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+organizationIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
                if(SearchTracking.length > 0) { //query result length check
                    SearchTracking.forEach(function(k,p){
                        SearchTracking[p]['trackingDetails'] = {};
                        SearchTracking[p]['trackingDetails']['latitude'] = k.latitude;
                        SearchTracking[p]['trackingDetails']['longitude'] = k.longitude;
                        SearchTracking[p]['trackingDetails']['timeStamp'] = k.time_stamp;
                        delete SearchTracking[p].latitude;delete SearchTracking[p].longitude;delete SearchTracking[p].time_stamp;
                    });            
                    res.status(200).json({success: true,data:SearchTracking}); //Return json with data or empty
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
                res.status(200).json({data:{success: true,"data":"success"}}); //Return json with data or empty
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
                res.status(200).json({data:{success: true,"data":"success"}}); //Return json with data or empty
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
            var mobileVali = validation.getTrackingDetails(req.body);    
            if(mobileVali.passes()===true){
                var TrackingDetails =await sequelize.query("SELECT `latitude` AS latitude, `longitude` AS longitude, `time_stamp` AS timeStamp FROM `tracking_details` WHERE `tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(TrackingDetails.length > 0){ //query result length check
                    res.status(200).json({success: true,data:TrackingDetails}); //Return json with data or empty
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
                    var SearchOrganization =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `tm`.`load_id` AS loadId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` "+queryQ+"",{ type: Sequelize.QueryTypes.SELECT });
                }
                if(SearchOrganization.length > 0) { //query result length check
                    SearchOrganization.forEach(function(k,p){
                        SearchOrganization[p]['trackingDetails'] = {};
                        SearchOrganization[p]['trackingDetails']['latitude'] = k.latitude;
                        SearchOrganization[p]['trackingDetails']['longitude'] = k.longitude;
                        SearchOrganization[p]['trackingDetails']['timeStamp'] = k.time_stamp;
                        delete SearchOrganization[p].latitude;delete SearchOrganization[p].longitude;delete SearchOrganization[p].time_stamp;
                    });            
                    res.status(200).json({success: true,data:SearchOrganization}); //Return json with data or empty        
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
            const { trackingId } = req.body;
            var mobileVali = validation.getTracking(req.body);
            if(mobileVali.passes()===true){
                var trackingIdQ = (trackingId!='' && trackingId!=undefined) ? "WHERE `t`.`tracking_id`="+trackingId : "";
                var TrackingList =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `tm`.`load_id` AS loadId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` "+trackingIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
                if(TrackingList.length > 0) { //query result length check
                    TrackingList.forEach(function(k,p){
                        TrackingList[p]['trackingDetails'] = {};
                        TrackingList[p]['trackingDetails']['latitude'] = k.latitude;
                        TrackingList[p]['trackingDetails']['longitude'] = k.longitude;
                        TrackingList[p]['trackingDetails']['timeStamp'] = k.time_stamp;
                        delete TrackingList[p].latitude;delete TrackingList[p].longitude;delete TrackingList[p].time_stamp;
                    });
                    res.status(200).json({success: true,data:TrackingList}); //Return json with data or empty
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
            const { userId, organizationId, branchId, loadId, startDate, vehicleNumber, driverNumber, driverName, driverMobileOnTrack, totalTrackCount } = req.body;
            var mobileVali = validation.getTrackingAdd(req.body);
            var otherMobileNumber = JSON.stringify(req.body.otherMobileNumber);
            var from = JSON.stringify(req.body.from);
            var to = JSON.stringify(req.body.to);
            if(mobileVali.passes()===true){
                var createTracking = await sequelize.query("INSERT INTO `tracking_details`(`driver_mobile_number`, `tracked_mobile_mumbers`, `tracked_by_user_id`, `tracked_mobile_number`, `vehicle_number`,`tracking_count`,`start_date`,`from_location`,`to_location`) VALUES ('"+driverNumber+"','"+otherMobileNumber+"',"+userId+",'"+driverMobileOnTrack+"','"+vehicleNumber+"',"+totalTrackCount+",'"+startDate+"','"+from+"','"+to+"')",{ type: Sequelize.QueryTypes.INSERT });
                var TrId = createTracking.slice(0,1);
                var updateTracking = await sequelize.query("UPDATE tracking_details SET `tracking_id`='"+TrId+"' WHERE `id`="+TrId+"",{ type: Sequelize.QueryTypes.UPDATE });
                var createTrackingMapped = await sequelize.query("INSERT INTO `tracking_mappers`(`user_id`, `load_id`, `tracking_id`, `branch_id`) VALUES ("+userId+","+loadId+","+TrId+","+branchId+")",{ type: Sequelize.QueryTypes.INSERT });
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
/************************* Create Tracking ends *******************************/

/************************* Edit Tracking start *******************************/
exports.editTracking = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, userId, organizationId, branchId, loadId, startDate, vehicleNumber, driverNumber, driverName, driverMobileOnTrack, totalTrackCount } = req.body;
            var mobileVali = validation.getTrackingEdit(req.body);
            var otherMobileNumber = JSON.stringify(req.body.otherMobileNumber);
            var from = JSON.stringify(req.body.from);
            var to = JSON.stringify(req.body.to);
            if(mobileVali.passes()===true){
                var createTracking = await sequelize.query("UPDATE `tracking_details` SET `driver_mobile_number`='"+driverNumber+"', `tracking_id`='"+trackingId+"', `tracked_mobile_mumbers`='"+otherMobileNumber+"', `tracked_by_user_id`="+userId+", `tracked_mobile_number`='"+driverMobileOnTrack+"', `vehicle_number`='"+vehicleNumber+"', `tracking_count`="+totalTrackCount+", `start_date`='"+startDate+"', `from_location`='"+from+"', `to_location`='"+to+"' WHERE id="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
                var createTrackingMapped = await sequelize.query("UPDATE `tracking_mappers``user_id`="+userId+", `load_id`="+loadId+", `tracking_id`="+trackingId+", `branch_id`="+branchId+" WHERE tracking_id="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
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
            const { trackingId, userId, organizationId } = req.body;
            var mobileVali = validation.particularTrackingDetails(req.body);
            if(mobileVali.passes()===true){
                var SearchOrganization =await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`email` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `v`.`driver_name` AS driverName, `v`.`driver_mobile` AS driverMobileNumber, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`vehicle_number` AS vehicleNumber, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude` FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+" AND `u`.`id`="+userId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(SearchOrganization.length > 0) { //query result length check
                    SearchOrganization.forEach(function(k,p){
                        SearchOrganization[p]['trackingDetails'] = {};
                        SearchOrganization[p]['trackingDetails']['latitude'] = k.latitude;
                        SearchOrganization[p]['trackingDetails']['longitude'] = k.longitude;
                        SearchOrganization[p]['trackingDetails']['timeStamp'] = k.time_stamp;
                        delete SearchOrganization[p].latitude;delete SearchOrganization[p].longitude;delete SearchOrganization[p].time_stamp;
                    });            
                    res.status(200).json({success: true,data:SearchOrganization}); //Return json with data or empty
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
            const { trackingId, userId, organizationId, status } = req.body;
            var mobileVali = validation.updateTrackingStatus(req.body);
            if(mobileVali.passes()===true){
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
            const { trackingId, userId, organizationId, latitude, longitude, timeStamp } = req.body;
            var mobileVali = validation.updateTrackingDetails(req.body);
            if(mobileVali.passes()===true){
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
            const { trackingId, userId, organizationId, active } = req.body;
            var mobileVali = validation.updateTrackingActive(req.body);
            if(mobileVali.passes()===true){
                var activeR = (activeRaw=="true") ? 'active' : 'inactive';
                var updateTrackingActive =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+" AND `u`.`id`="+userId+"",{ type: Sequelize.QueryTypes.SELECT });
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
            const { trackingId, userId, organizationId, activeMobileNumber } = req.body;
            var mobileVali = validation.updateActiveMobileNumber(req.body);
            if(mobileVali.passes()===true){
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
            const { trackingId, userId, organizationId, addMobileNumber } = req.body;
            var mobileVali = validation.addContactandMobileNumber(req.body);
            if(mobileVali.passes()===true){
                var addContactandMobileNumber =await sequelize.query("SELECT `t`.`id` AS Id FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` LEFT JOIN `vehicle_details` AS v ON `v`.`enterprise_id`=`e`.`id` WHERE `t`.`tracking_id`="+trackingId+" AND `e`.`id`="+organizationId+" AND `u`.`id`="+userId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(addContactandMobileNumber.length > 0){
                    var addMobileNumberT = JSON.stringify(req.body.addMobileNumber);
                    var addContactMobileNumber =await sequelize.query("UPDATE tracking_details SET `add_mobile_number`='"+addMobileNumberT+"' WHERE `id`="+addContactandMobileNumber[0].Id+"",{ type: Sequelize.QueryTypes.UPDATE });
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