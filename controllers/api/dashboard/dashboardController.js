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
            const { userId, role, fromDate, toDate } = req.body;
            var mobileVali = validation.getTrackingCount(req.body);
            var TrackingCount='';// Create return Object
            if(mobileVali.passes()===true){
                if(role=='admin'){ // Admin get all data
                    var TrackingCount =await sequelize.query("SELECT COALESCE(SUM(IF(`t`.`status` = 'in-progress', 1, 0)),0) AS 'in-progress', COALESCE(SUM(IF(`t`.`status` = 'canceled', 1, 0)),0) AS canceled, COALESCE(SUM(IF(`t`.`status` = 'awaited', 1, 0)),0) AS awaited, COALESCE(SUM(IF(`t`.`status` = 'tracked', 1, 0)),0) AS tracked, COALESCE(SUM(IF(`t`.`status` = 'delay', 1, 0)),0) AS 'delay', COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS completed, COALESCE(SUM(IF(`t`.`status` = 'failed', 1, 0)),0) AS failed FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'",{ type: Sequelize.QueryTypes.SELECT });
                } else { // Shipper get particular thair data
                    var TrackingCount =await sequelize.query("SELECT COALESCE(SUM(IF(`t`.`status` = 'in-progress', 1, 0)),0) AS 'in-progress', COALESCE(SUM(IF(`t`.`status` = 'canceled', 1, 0)),0) AS canceled, COALESCE(SUM(IF(`t`.`status` = 'awaited', 1, 0)),0) AS awaited, COALESCE(SUM(IF(`t`.`status` = 'tracked', 1, 0)),0) AS tracked, COALESCE(SUM(IF(`t`.`status` = 'delay', 1, 0)),0) AS 'delay', COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS completed, COALESCE(SUM(IF(`t`.`status` = 'failed', 1, 0)),0) AS failed FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` WHERE `u`.`id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'",{ type: Sequelize.QueryTypes.SELECT });
                }
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
            const { userId, role, shipperId, fromDate, toDate } = req.body;
            var mobileVali = validation.getTrackingHistory(req.body);
            var TrackingHistory=''; // Create return Object
            var shipperIdQ = (shipperId!='' && shipperId!=undefined) ? " AND `e`.`id`="+shipperId : "";
            if(mobileVali.passes()===true){
                if(role=='admin'){ // Admin get all data
                    var TrackingHistory =await sequelize.query("SELECT COUNT(`t`.`id`) AS TotalRows, COUNT(DISTINCT `e`.`id`) AS totalShipper, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS totalcompleted, COUNT(DISTINCT `t`.`tracked_mobile_number`) AS totalNumberTracked, COUNT(DISTINCT `t`.`vehicle_number`) AS totalVehicleTracked FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
                } else { // Shipper get particular thair data
                    var TrackingHistory =await sequelize.query("SELECT COUNT(`t`.`id`) AS TotalRows, COUNT(DISTINCT `e`.`id`) AS totalShipper, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS totalcompleted, COUNT(DISTINCT `t`.`tracked_mobile_number`) AS totalNumberTracked, COUNT(DISTINCT `t`.`vehicle_number`) AS totalVehicleTracked FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `u`.`id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
                }
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
            const { userId, role, shipperId, fromDate, toDate, type } = req.body;
            var mobileVali = validation.getTrackingAnalysis(req.body);
            var shipperIdQ = (shipperId!='' && shipperId!=undefined) ? " AND `e`.`id`="+shipperId : "";
            if(mobileVali.passes()===true){
                if(role=='admin'){ // Admin get all data
                    if(type=='month'){
                        var TrackingAnalysis =await sequelize.query("SELECT {fn MONTHNAME(`t`.`start_date`)} AS month, DATE_FORMAT(`t`.`start_date`,'%Y') AS year, COUNT(`t`.`id`) AS totalTrakingPosted, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS trackingCompleted, COALESCE(SUM(IF(`t`.`status` = 'in-progress', 1, 0)),0) AS trackingInitiated, count(`t`.`comment`) AS complaintsLogged, count(`t`.`tracked_by_user_id`) AS shipperOnboarded, COALESCE(SUM(IF(`e`.`status` = 'active', 1, 0)),0) AS activeShipper, COALESCE(SUM(IF(`e`.`status` = 'inactive', 1, 0)),0) AS inactiveShipper FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY MONTH(`t`.`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
                    } else {
                        var TrackingAnalysis =await sequelize.query("SELECT DATE_FORMAT(`t`.`start_date`,'%d-%m-%Y') AS date, COUNT(`t`.`id`) AS totalTrakingPosted, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS trackingCompleted, COALESCE(SUM(IF(`t`.`status` = 'in-progress', 1, 0)),0) AS trackingInitiated, count(`t`.`comment`) AS complaintsLogged, count(`t`.`tracked_by_user_id`) AS shipperOnboarded, COALESCE(SUM(IF(`e`.`status` = 'active', 1, 0)),0) AS activeShipper, COALESCE(SUM(IF(`e`.`status` = 'inactive', 1, 0)),0) AS inactiveShipper FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY `t`.`start_date`",{ type: Sequelize.QueryTypes.SELECT });
                    }
                } else { // Shipper get particular thair data
                    if(type=='month'){
                        var TrackingAnalysis =await sequelize.query("SELECT {fn MONTHNAME(`t`.`start_date`)} AS month, DATE_FORMAT(`t`.`start_date`,'%Y') AS year, COUNT(`t`.`id`) AS totalTrakingPosted, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS trackingCompleted, COALESCE(SUM(IF(`t`.`status` = 'in-progress', 1, 0)),0) AS trackingInitiated, count(`t`.`comment`) AS complaintsLogged, count(`t`.`tracked_by_user_id`) AS shipperOnboarded, COALESCE(SUM(IF(`e`.`status` = 'active', 1, 0)),0) AS activeShipper, COALESCE(SUM(IF(`e`.`status` = 'inactive', 1, 0)),0) AS inactiveShipper FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`tracked_by_user_id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY MONTH(`t`.`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
                    } else {
                        var TrackingAnalysis =await sequelize.query("SELECT DATE_FORMAT(`t`.`start_date`,'%d-%m-%Y') AS date, COUNT(`t`.`id`) AS totalTrakingPosted, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS trackingCompleted, COALESCE(SUM(IF(`t`.`status` = 'in-progress', 1, 0)),0) AS trackingInitiated, count(`t`.`comment`) AS complaintsLogged, count(`t`.`tracked_by_user_id`) AS shipperOnboarded, COALESCE(SUM(IF(`e`.`status` = 'active', 1, 0)),0) AS activeShipper, COALESCE(SUM(IF(`e`.`status` = 'inactive', 1, 0)),0) AS inactiveShipper FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`tracked_by_user_id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY `t`.`start_date`",{ type: Sequelize.QueryTypes.SELECT });
                    }
                }
                if(TrackingAnalysis.length > 0){
                    res.status(200).send({ success: true, TrackingAnalysis: TrackingAnalysis}); //Return json with data or empty
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
            const { userId, role, shipperId, fromDate, toDate, type } = req.body;    
            var mobileVali = validation.getFailedAnalysis(req.body);
            var FailedAnalysis={}; // Create return Object
            var shipperIdQ = (shipperId!='' && shipperId!=undefined) ? " AND `e`.`id`="+shipperId : "";
            if(mobileVali.passes()===true){
                if(role=='admin'){ // Admin get all data
                    if(type=='month'){ // Fetch Data Month Wise
                        var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, {fn MONTHNAME(`t`.`start_date`)} AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='failed'  AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY MONTH(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
                    } else { // Fetch Data Date Wise
                        var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, DATE_FORMAT(`t`.`start_date`,'%d-%m-%Y') AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='failed'  AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY DATE(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
                    }
                } else { // Shipper get particular thair data
                    if(type=='month'){ // Fetch Data Month Wise
                        var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, {fn MONTHNAME(`t`.`start_date`)} AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='failed' AND `t`.`tracked_by_user_id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY MONTH(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
                    } else { // Fetch Data Date Wise
                        var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, DATE_FORMAT(`t`.`start_date`,'%d-%m-%Y') AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='failed' AND `t`.`tracked_by_user_id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY DATE(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });              
                    }
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
                    OrganizationSearch = await sequelize.query("SELECT `e`.`id` AS organizationId, `e`.`organisation_name` AS organizationName, `e`.`address` AS organizationAddress, `e`.`email` AS organizationContactName, `e`.`primary_contact_no` AS organizationContactNumber FROM `enterprises` AS e LEFT JOIN `enterprise_contacts` AS ec ON `ec`.`enterprise_id`=`e`.`id` WHERE `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                } else if(organizationName!='' && organizationName!=undefined){        
                    OrganizationSearch = await sequelize.query("SELECT `e`.`id` AS organizationId, `e`.`organisation_name` AS organizationName, `e`.`address` AS organizationAddress, `e`.`email` AS organizationContactName, `e`.`primary_contact_no` AS organizationContactNumber FROM `enterprises` AS e LEFT JOIN `enterprise_contacts` AS ec ON `ec`.`enterprise_id`=`e`.`id` WHERE `e`.`organisation_name` LIKE '%"+organizationName+"%'",{ type: Sequelize.QueryTypes.SELECT });
                }  
                if(OrganizationSearch.length > 0){ //query result length check
                    OrganizationSearch.forEach(async function(k,p){
                        OrganizationSearch[p]['ListOfBranch'] = []; //create ListOfBranch array
                        var ListOfBranch = await sequelize.query("SELECT * FROM `branchs` WHERE `enterprise_id`="+k.organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                        if(ListOfBranch.length > 0){
                            ListOfBranch.forEach(function(m,n){
                                var newBranch = {};
                                newBranch["branchName"] = m.name;//static data push in array
                                newBranch['branchAddress'] = m.address;//static data push in array
                                newBranch['branchContactName'] = m.contact_name;//static data push in array
                                newBranch['branchContactNumber'] = m.contact_number;//static data push in array
                                newBranch['branchLocation']={}; //static data push in array
                                newBranch['branchLocation']['lat']=m.latitude; //static data push in array
                                newBranch['branchLocation']['lan']=m.longitude; //static data push in array
                                OrganizationSearch[p]['ListOfBranch'][n]=newBranch;  //assign data into ListOfBranch array
                            });
                        }
                        res.status(200).send({ success: true, data: OrganizationSearch}); //Return json with data or empty
                    });
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
            var TrackingSearch=[];
            var Tracking_Search='';
            if(mobileVali.passes()===true){
                if(trackingId!='' && trackingId!=undefined){
                    Tracking_Search = await sequelize.query("SELECT `t`.`tracking_id`, `e`.`id` AS OrganizationId, `e`.`primary_contact_no` AS OrganizationNumber, `b`.`id` AS branchId, `b`.`address` AS branchAddress,`b`.`contact_number` AS branchContact, `l`.`pickup_location_latitude`, `l`.`pickup_location_longitude`, `l`.`drop_location_latitude`, `l`.`drop_location_longitude` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id`  LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`id`='"+trackingId+"'",{ type: Sequelize.QueryTypes.SELECT });
                } else if(vehicleNnumber!='' && vehicleNnumber!=undefined){
                    Tracking_Search = await sequelize.query("SELECT `t`.`tracking_id`, `e`.`id` AS OrganizationId, `e`.`primary_contact_no` AS OrganizationNumber, `b`.`id` AS branchId, `b`.`address` AS branchAddress,`b`.`contact_number` AS branchContact, `l`.`pickup_location_latitude`, `l`.`pickup_location_longitude`, `l`.`drop_location_latitude`, `l`.`drop_location_longitude` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id`  LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`vehicle_number`='"+vehicleNnumber+"'",{ type: Sequelize.QueryTypes.SELECT });
                } else if(organizationId!='' && organizationId!=undefined){
                    Tracking_Search = await sequelize.query("SELECT `t`.`tracking_id`, `e`.`id` AS OrganizationId, `e`.`primary_contact_no` AS OrganizationNumber, `b`.`id` AS branchId, `b`.`address` AS branchAddress,`b`.`contact_number` AS branchContact, `l`.`pickup_location_latitude`, `l`.`pickup_location_longitude`, `l`.`drop_location_latitude`, `l`.`drop_location_longitude` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id`  LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `e`.`id`='"+organizationId+"'",{ type: Sequelize.QueryTypes.SELECT });
                } else if(mobileNumber!='' && mobileNumber!=undefined){
                    Tracking_Search = await sequelize.query("SELECT `t`.`tracking_id`, `e`.`id` AS OrganizationId, `e`.`primary_contact_no` AS OrganizationNumber, `b`.`id` AS branchId, `b`.`address` AS branchAddress,`b`.`contact_number` AS branchContact, `l`.`pickup_location_latitude`, `l`.`pickup_location_longitude`, `l`.`drop_location_latitude`, `l`.`drop_location_longitude` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `loads` AS l ON `l`.`id`=`tm`.`load_id`  LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`driver_mobile_number`='"+mobileNumber+"'",{ type: Sequelize.QueryTypes.SELECT });
                }
                if(Tracking_Search.length > 0){
                    Tracking_Search.forEach(function(k,p){
                        var FromArray ={};
                        var ToArray ={};
                        FromArray['lat']=k.pickup_location_latitude;
                        FromArray['lan']=k.pickup_location_longitude;
                        ToArray['lat']=k.drop_location_latitude;
                        ToArray['lan']=k.drop_location_longitude;
                        delete Tracking_Search[p].pickup_location_latitude;delete Tracking_Search[p].pickup_location_longitude;delete Tracking_Search[p].drop_location_latitude;delete Tracking_Search[p].drop_location_longitude;
                        Tracking_Search[p]['From']=FromArray;
                        Tracking_Search[p]['To']=ToArray;
                    });
                    res.status(200).json({ success: true,ListOfOrganization: Tracking_Search});// Return json with error massage
                } else {
                    res.status(200).json({ success: false,ListOfOrganization: "No data found!"});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),ListOfOrganization: mobileVali.errors.errors});// Return json with error massage
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
                var ActiveInactiveShipper = await sequelize.query("SELECT `e`.`id` AS OrganizationId, `e`.`primary_contact_no` AS OrganizationNumber, COUNT(`t`.`id`) AS totalTracking FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `users` AS u ON `u`.`id`=`tm`.`user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `e`.`status`='"+type+"' AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"' LIMIT "+count+"",{ type: Sequelize.QueryTypes.SELECT });
                if(ActiveInactiveShipper.length > 0){  //query result length check
                    res.status(200).send({ success: true, ListOfOrganization: ActiveInactiveShipper}); //Return json with data or empty
                } else {
                    res.status(200).json({ success: false,ListOfOrganization: "No data found!"});// Return json with error massage
                }
            } else {
                res.status(200).json({ success: mobileVali.passes(),ListOfOrganization: mobileVali.errors.errors});// Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* active Inactive Shipper ends *******************************/