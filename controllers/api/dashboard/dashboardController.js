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
/*************************TrackingCount / TrackingSnapshot start *******************************/
exports.getTrackingCount = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, fromDate, toDate } = req.body;
            var mobileVali = validation.getTrackingCount(req.body);
            var TrackingCount='';// Create return Object
            if(mobileVali.passes()===true){
                var shipperIdQ = (organizationId!='' && organizationId!=undefined) ? " AND `e`.`id`="+organizationId : "";
                var TrackingCount =await sequelize.query("SELECT COALESCE(SUM(IF(`t`.`status` = 'in-progress', 1, 0)),0) AS 'in-progress', COALESCE(SUM(IF(`t`.`status` = 'canceled', 1, 0)),0) AS canceled, COALESCE(SUM(IF(`t`.`status` = 'awaited', 1, 0)),0) AS awaited, COALESCE(SUM(IF(`t`.`status` = 'tracked', 1, 0)),0) AS tracked, COALESCE(SUM(IF(`t`.`status` = 'delay', 1, 0)),0) AS 'delay', COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS completed, COALESCE(SUM(IF(`t`.`status` = 'failed', 1, 0)),0) AS failed,  COALESCE(SUM(IF(`t`.`active_status` = 'active', 1, 0)),0) AS active,  COALESCE(SUM(IF(`t`.`active_status` = 'inactive', 1, 0)),0) AS inactive FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
                if(TrackingCount.length > 0) { //query result length check
                    res.status(200).json({success: true,data:TrackingCount[0]}); //Return json with data or empty
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
/*************************TrackingCount / TrackingSnapshot ends *******************************/

/*************************Tracking History start *******************************/
exports.getTrackingHistory = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const {organizationId, fromDate, toDate } = req.body;
            var mobileVali = validation.getTrackingHistory(req.body);
            var TrackingHistory=''; // Create return Object
            if(mobileVali.passes()===true){
                var shipperIdQ = (organizationId!='' && organizationId!=undefined) ? " AND `e`.`id`="+organizationId : "";
                var TrackingHistory =await sequelize.query("SELECT COUNT(DISTINCT `e`.`id`) AS totalShipper, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS totalcompleted, COUNT(DISTINCT `t`.`vehicle_number`) AS totalVehicleTracked FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
                if(TrackingHistory.length > 0) { //query result length check
                    res.status(200).json({success: true,data:TrackingHistory[0]}); //Return json with data or empty
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
/*************************Tracking History ends *******************************/

/************************* Tracking Analysis start *******************************/
exports.getTrackingAnalysis = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, fromDate, toDate, type } = req.body;
            var mobileVali = validation.getTrackingAnalysis(req.body);
            if(mobileVali.passes()===true){
                var shipperIdQ = (organizationId!='' && organizationId!=undefined) ? " AND `e`.`id`="+organizationId : "";
                if(type=='month'){
                    var TrackingAnalysis =await sequelize.query("SELECT {fn MONTHNAME(`t`.`start_date`)} AS month, DATE_FORMAT(`t`.`start_date`,'%Y') AS year, COUNT(`t`.`id`) AS totalTrakingPosted, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS trackingCompleted, COALESCE(SUM(IF(`t`.`status` = 'in-progress', 1, 0)),0) AS trackingInitiated, count(`t`.`comment`) AS complaintsLogged, count(`t`.`tracked_by_user_id`) AS shipperOnboarded, COALESCE(SUM(IF(`e`.`status` = 'active', 1, 0)),0) AS activeShipper, COALESCE(SUM(IF(`e`.`status` = 'inactive', 1, 0)),0) AS inactiveShipper FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY MONTH(`t`.`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
                } else {
                    var TrackingAnalysis =await sequelize.query("SELECT DATE_FORMAT(`t`.`start_date`,'%d-%m-%Y') AS date, COUNT(`t`.`id`) AS totalTrakingPosted, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS trackingCompleted, COALESCE(SUM(IF(`t`.`status` = 'in-progress', 1, 0)),0) AS trackingInitiated, count(`t`.`comment`) AS complaintsLogged, count(`t`.`tracked_by_user_id`) AS shipperOnboarded, COALESCE(SUM(IF(`e`.`status` = 'active', 1, 0)),0) AS activeShipper, COALESCE(SUM(IF(`e`.`status` = 'inactive', 1, 0)),0) AS inactiveShipper FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY `t`.`start_date`",{ type: Sequelize.QueryTypes.SELECT });
                }
                if(TrackingAnalysis.length > 0){
                    res.status(200).send({ success: true, data: TrackingAnalysis}); //Return json with data or empty
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
/************************* Tracking Analysis ends *******************************/

/************************* Tracking Analysis start *******************************/
exports.getFailedAnalysis = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, fromDate, toDate, type } = req.body;    
            var mobileVali = validation.getFailedAnalysis(req.body);
            var FailedAnalysis={}; // Create return Object
            if(mobileVali.passes()===true){
                var shipperIdQ = (organizationId!='' && organizationId!=undefined) ? " AND `e`.`id`="+organizationId : "";
                if(type=='month'){ // Fetch Data Month Wise
                    var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, {fn MONTHNAME(`t`.`start_date`)} AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='failed'  AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY MONTH(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
                } else { // Fetch Data Date Wise
                    var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, DATE_FORMAT(`t`.`start_date`,'%d-%m-%Y') AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='failed'  AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY DATE(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
                }
                if(Failed.length > 0){ //query result length check
                    FailedAnalysis['totalFailed']=0; //total failure array key declared
                    var totalFailed = 0; //total failure variable declared
                    Failed.forEach(function(k,p){
                        totalFailed = totalFailed + k.totalFailed; //total failure sum
                        FailedAnalysis[k.month]=k.count; //total failure month or date push in array
                    });
                    FailedAnalysis['totalFailed']=totalFailed; //total failure sum assign to array
                    res.status(200).json({success: true,data:FailedAnalysis}); //Return json with data or empty
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
/************************* Tracking Analysis ends *******************************/

/************************* Create tracking start *******************************/
exports.getTrackingAdd = async function(req, res, next) {
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
                var getBillingLicense = await sequelize.query("SELECT `id`, `remaining_license_count`, `total_used_license`, `total_purchase_license_count` FROM `billing_license` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(getBillingLicense.length > 0){
                    if(getBillingLicense[0].remaining_license_count > 0){
                        var createTracking = await sequelize.query("INSERT INTO `tracking_details`(`tracking_count`,`max_tracking_count`, `driver_mobile_number`, `comment`, `tracked_by_user_id`, `driver_name`, `vehicle_number`,`other_mobile_number`, `driver_mobile_on_track`, `from_location`, `to_location`, `start_date`, `created_by`,`other_location`) VALUES (0, "+totalTrackCount+", '"+driverNumber+"', '"+comment+"', "+userId+", '"+driverName+"', '"+vehicleNumber+"', '"+otherMobileNumbers+"', "+driverMobileOnTrack+", '"+froms+"', '"+tos+"', '"+startDate+"', "+userId+",'"+otherLocations+"')",{ type: Sequelize.QueryTypes.INSERT });
                        var TrId = createTracking.slice(0,1);
                        var updateTracking = await sequelize.query("UPDATE `tracking_details` SET `tracking_id`='"+TrId+"', `status`='in-progress', `active_status`='active' WHERE `id`="+TrId+"",{ type: Sequelize.QueryTypes.UPDATE });
                        var createTrackingMapped = await sequelize.query("INSERT INTO `tracking_mappers`(`user_id`, `load_id`, `tracking_id`, `branch_id`) VALUES ("+userId+","+loadId+","+TrId+","+branchId+")",{ type: Sequelize.QueryTypes.INSERT });
                        if(createTracking.slice(-1)[0] > 0) {
                            var trakId = createTracking.slice(0,1);
                            var totalUsedLicense = getBillingLicense[0].total_used_license + 1;
                            var remainingLicenseCount = getBillingLicense[0].total_purchase_license_count - totalUsedLicense;
                            var updateTracking = await sequelize.query("UPDATE `billing_license` SET `remaining_license_count`="+remainingLicenseCount+", `total_used_license`="+totalUsedLicense+" WHERE `id`="+getBillingLicense[0].id+"",{ type: Sequelize.QueryTypes.UPDATE });
                            res.status(200).send({ success: true,"trackingId":trakId[0]}); //Return json with data or empty
                        } else {
                            res.status(200).json({success:false});// Return json with error massage
                        }
                    } else {
                        res.status(200).json({success:false, data:'Your remaining license count is zero'});// Return json with error massage
                    }
                } else {
                    res.status(200).json({success:false, data:'Your License is expired'});// Return json with error massage
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
/************************* Create tracking ends *******************************/

/************************* search organization start *******************************/
exports.getOrganizationSearch = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, organizationName } = req.body;
            var mobileVali = validation.getOrganizationSearch(req.body);
            var OrganizationSearch = '';
            if(mobileVali.passes()===true){
                if(organizationId !='' && organizationId!=undefined){
                    OrganizationSearch = await sequelize.query("SELECT `id` AS organizationId, `organisation_name` AS OrganizationName, `address` AS OrganizationAddress,`country` AS OrganizationCountry, `state` AS OrganizationState, `city` AS OrganizationCity, `pincode` AS OrganizationPin, `email` AS OrganizationEmail, `contact_name` AS OrganizationContact, `contact_mobile_number` AS OrganizationMobile, `contact_primary_name` AS primaryContactName, `primary_contact_no` AS primaryContactMobileNumber, if(`bidding_client`=1,'true','false') AS biddingClient, if(`status`='active','true','false') AS active FROM `enterprises` WHERE `id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                } else if(organizationName!='' && organizationName!=undefined){        
                    OrganizationSearch = await sequelize.query("SELECT `id` AS organizationId, `organisation_name` AS OrganizationName, `address` AS OrganizationAddress,`country` AS OrganizationCountry, `state` AS OrganizationState, `city` AS OrganizationCity, `pincode` AS OrganizationPin, `email` AS OrganizationEmail, `contact_name` AS OrganizationContact, `contact_mobile_number` AS OrganizationMobile, `contact_primary_name` AS primaryContactName, `primary_contact_no` AS primaryContactMobileNumber, if(`bidding_client`=1,'true','false') AS biddingClient, if(`status`='active','true','false') AS active FROM `enterprises` WHERE `organisation_name` LIKE '%"+organizationName+"%'",{ type: Sequelize.QueryTypes.SELECT });
                } 
                if(OrganizationSearch.length > 0){ //query result length check
                    for (var p = 0; p < OrganizationSearch.length; p++) {
                        OrganizationSearch[p]['branchArr'] = []; //create ListOfLoad array
                        var LoadBy = await sequelize.query("SELECT `id` AS BranchId, `name` AS BranchName, `contact_name` AS BranchContactName, `contact_number` AS BranchContactNumber, `latitude` AS BranchLat, `longitude` AS BranchLang, `state` AS BranchState, `city` AS BranchCity, `pin` AS BranchPin  FROM `branchs` WHERE `enterprise_id`="+OrganizationSearch[p].organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                        OrganizationSearch[p]['branchArr']=LoadBy;
                        var LoadTrakingByOrgId = await sequelize.query("SELECT count(`t`.`id`) AS TotalTracking, COALESCE(SUM(IF(`t`.`status` = 'in-progress', 1, 0)),0) AS inprogressTracking, COALESCE(SUM(IF(`t`.`status` = 'canceled', 1, 0)),0) AS calcelledTracking, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS completedTracking, COALESCE(SUM(IF(`t`.`status` = 'awaited', 1, 0)),0) AS awaitedTracking FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `e`.`id`="+OrganizationSearch[0].organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                        if(LoadTrakingByOrgId.length > 0){
                            OrganizationSearch[p]['TotalTracking'] = LoadTrakingByOrgId[0]['TotalTracking'];
                            OrganizationSearch[p]['inprogressTracking'] = LoadTrakingByOrgId[0]['inprogressTracking'];
                            OrganizationSearch[p]['calcelledTracking'] = LoadTrakingByOrgId[0]['calcelledTracking'];
                            OrganizationSearch[p]['completedTracking'] = LoadTrakingByOrgId[0]['completedTracking'];
                            OrganizationSearch[p]['awaitedTracking'] = LoadTrakingByOrgId[0]['awaitedTracking'];
                        }
                    };
                    res.status(200).send({ success: true, data: OrganizationSearch}); //Return json with data or empty
                }else{
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
/************************* search organization ends *******************************/

/************************* search tracking start *******************************/
exports.getTrackingSearch = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { trackingId, vehicleNnumber, organizationId, mobileNumber } = req.body;    
            var mobileVali = validation.getTrackingSearch(req.body);
            var Tracking_Search='';
            if(mobileVali.passes()===true){
                if(trackingId!='' && trackingId!=undefined){
                    Tracking_Search = await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `l`.`id` AS loadId, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `b`.`city` AS BranchCity, `b`.`state` AS BranchState, `t`.`from_location`, `t`.`to_location`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `t`.`driver_name` AS driverName, `t`.`driver_mobile_number` AS driverMobileNumber, `t`.`current_tracking_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers`, `t`.`vehicle_number` AS vehicleNumber, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`other_mobile_number`, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude`, `t`.`other_location`, `t`.`city`, `t`.`state` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`id`='"+trackingId+"'",{ type: Sequelize.QueryTypes.SELECT });
                } else if(vehicleNnumber!='' && vehicleNnumber!=undefined){
                    Tracking_Search = await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `l`.`id` AS loadId, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `b`.`city` AS BranchCity, `b`.`state` AS BranchState, `t`.`from_location`, `t`.`to_location`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `t`.`driver_name` AS driverName, `t`.`driver_mobile_number` AS driverMobileNumber, `t`.`current_tracking_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers`, `t`.`vehicle_number` AS vehicleNumber, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`other_mobile_number`, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude`, `t`.`other_location`, `t`.`city`, `t`.`state` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`vehicle_number`='"+vehicleNnumber+"'",{ type: Sequelize.QueryTypes.SELECT });
                } else if(organizationId!='' && organizationId!=undefined){
                    Tracking_Search = await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `l`.`id` AS loadId, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `b`.`city` AS BranchCity, `b`.`state` AS BranchState, `t`.`from_location`, `t`.`to_location`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `t`.`driver_name` AS driverName, `t`.`driver_mobile_number` AS driverMobileNumber, `t`.`current_tracking_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers`, `t`.`vehicle_number` AS vehicleNumber, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`other_mobile_number`, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude`, `t`.`other_location`, `t`.`city`, `t`.`state` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `e`.`id`='"+organizationId+"'",{ type: Sequelize.QueryTypes.SELECT });
                } else if(mobileNumber!='' && mobileNumber!=undefined){
                    Tracking_Search = await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `l`.`id` AS loadId, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `b`.`city` AS BranchCity, `b`.`state` AS BranchState, `t`.`from_location`, `t`.`to_location`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `t`.`driver_name` AS driverName, `t`.`driver_mobile_number` AS driverMobileNumber, `t`.`current_tracking_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers`, `t`.`vehicle_number` AS vehicleNumber, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`other_mobile_number`, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude`, `t`.`other_location`, `t`.`city`, `t`.`state` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `t`.`driver_mobile_number`='"+mobileNumber+"'",{ type: Sequelize.QueryTypes.SELECT });
                }
                if(Tracking_Search.length > 0){
                    for (var p = 0; p < Tracking_Search.length; p++) {
                        let k = Tracking_Search[p];
                        Tracking_Search[p]['From'] = JSON.parse(k.from_location);
                        Tracking_Search[p]['To'] = JSON.parse(k.to_location);
                        Tracking_Search[p]['otherLocation'] = JSON.parse(k.other_location);
                        Tracking_Search[p]['trackkedMobileNumbers'] = JSON.parse(k.tracked_mobile_mumbers);                        
                        Tracking_Search[p]['trackingDetails'] = [];
                        if(k.time_stamp!='' && k.latitude!='' && k.longitude!=''){
                            let trackingDetails = {};
                            let timeStamp = k.time_stamp.split(',');let latitude = k.latitude.split(',');let longitude = k.longitude.split(',');
                            let city = k.city.split(',');let state = k.state.split(',');
                            for (let i = 0; i < timeStamp.length; i++) {
                                let trackingDetails = {"latitude":latitude[i],"longitude":longitude[i],"timeStamp":timeStamp[i],"city":city[i],"state":state[i]};
                                Tracking_Search[p]['trackingDetails'].push(trackingDetails);
                            }
                        }
                        Tracking_Search[p]['otherMobileNumber'] = JSON.parse(k.other_mobile_number);
                        delete Tracking_Search[p].latitude;delete Tracking_Search[p].longitude;delete Tracking_Search[p].time_stamp;
                        delete Tracking_Search[p].from_location;delete Tracking_Search[p].to_location;delete Tracking_Search[p].tracked_mobile_mumbers;
                        delete Tracking_Search[p].other_mobile_number;delete Tracking_Search[p].other_location;
                        delete Tracking_Search[p].city;delete Tracking_Search[p].state;
                    }
                    res.status(200).json({ success: true,data: Tracking_Search});// Return json with error massage
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
/************************* search tracking ends *******************************/

/************************* active Inactive Shipper start *******************************/
exports.getActiveInactiveShipper = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { fromDate, toDate, type, count } = req.body;   
            var mobileVali = validation.getActiveInactiveShipper(req.body);
            if(mobileVali.passes()===true){
                var ActiveInactiveShipper = await sequelize.query("SELECT `e`.`id` AS OrganizationId, `e`.`primary_contact_no` AS OrganizationNumber, COUNT(`t`.`id`) AS totalTracking, COALESCE(SUM(IF(`t`.`active_status` = 'active', 1, 0)),0) AS activeTracking, COALESCE(SUM(IF(`t`.`active_status` = 'inactive', 1, 0)),0) AS inactiveTracking FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `e`.`status`='"+type+"' AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"' LIMIT "+count+"",{ type: Sequelize.QueryTypes.SELECT });
                if(ActiveInactiveShipper.length > 0){  //query result length check
                    res.status(200).send({ success: true, data: ActiveInactiveShipper}); //Return json with data or empty
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
/************************* active Inactive Shipper ends *******************************/