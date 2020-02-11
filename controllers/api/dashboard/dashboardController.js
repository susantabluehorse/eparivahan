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

/*************************TrackingCount / TrackingSnapshot start *******************************/
exports.getTrackingCount = async function(req, res, next) {
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
/*************************TrackingCount / TrackingSnapshot ends *******************************/

/*************************Tracking History start *******************************/
exports.getTrackingHistory = async function(req, res, next) {
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
/*************************Tracking History ends *******************************/

/************************* Tracking Analysis start *******************************/
exports.getTrackingAnalysis = async function(req, res, next) {

    var category_list = await sequelize.query("SELECT categories.category_id, categories.title, (SELECT COUNT(*) FROM candidate_looking_for WHERE categories.category_id=candidate_looking_for.category) as candidate_count_by_category FROM categories where categories.status='active' order by categories.title ASC",{ type: Sequelize.QueryTypes.SELECT });
    var location_list = await sequelize.query("SELECT COUNT(*) as candidate_count_by_location, location as candidate_location FROM candidate_looking_for GROUP BY location",{ type: Sequelize.QueryTypes.SELECT });
    
    //if(category_list){
        res.status(200).send({ success: true, category_list: category_list, location_list: location_list});
    // }else{
    //     res.status(200).send({ message: "No category found" });
    // }    
}
/************************* Tracking Analysis ends *******************************/

/************************* Tracking Analysis start *******************************/
exports.getFailedAnalysis = async function(req, res, next) {
    //console.log(req.body);
    var userId = req.body.userId;
    var role = req.body.role;
    var shipperId = req.body.shipperId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var type = req.body.type;
    var FailedAnalysis={}; // Create return Object
    var shipperIdQ = shipperId!='' ? " AND `e`.`id`="+shipperId : "";
    if(userId !='' && role !='' && fromDate !='' && toDate !=''){
        if(role=='admin'){ // Admin get all data
            if(type=='month'){ // Fetch Data Month Wise
                var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, {fn MONTHNAME(`t`.`start_date`)} AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='active'  AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY MONTH(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
            } else {  // Fetch Data Date Wise
                var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, DATE_FORMAT(`t`.`start_date`,'%d-%m-%Y') AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='active'  AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY DATE(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
            }
        } else { // Shipper get particular thair data
            if(type=='month'){ // Fetch Data Month Wise
                var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, {fn MONTHNAME(`t`.`start_date`)} AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='active' AND `t`.`tracked_by_user_id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY MONTH(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
            } else {  // Fetch Data Date Wise
                var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, DATE_FORMAT(`t`.`start_date`,'%d-%m-%Y') AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='active' AND `t`.`tracked_by_user_id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY DATE(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });              
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
            res.status(200).json({data:FailedAnalysis}); //Return json with data or empty
        } else {
            res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
        }
    }else{
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }   
}
/************************* Tracking Analysis ends *******************************/

/************************* Create tracking start *******************************/
exports.getTrackingAdd = async function(req, res, next) {

    var category_list = await sequelize.query("SELECT categories.category_id, categories.title, (SELECT COUNT(*) FROM candidate_looking_for WHERE categories.category_id=candidate_looking_for.category) as candidate_count_by_category FROM categories where categories.status='active' order by categories.title ASC",{ type: Sequelize.QueryTypes.SELECT });
    var location_list = await sequelize.query("SELECT COUNT(*) as candidate_count_by_location, location as candidate_location FROM candidate_looking_for GROUP BY location",{ type: Sequelize.QueryTypes.SELECT });
    
    //if(category_list){
        res.status(200).send({ success: true, category_list: category_list, location_list: location_list});
    // }else{
    //     res.status(200).send({ message: "No category found" });
    // }    
}
/************************* Create tracking ends *******************************/

/************************* search organization start *******************************/
exports.getOrganizationSearch = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    var organizationName = req.body.organizationName;  
    if(organizationId !=''){
        var OrganizationSearch = await sequelize.query("SELECT `e`.`id` AS organizationId, `e`.`organisation_name` AS organizationName, `e`.`address` AS organizationAddress, `e`.`email` AS organizationContactName, `e`.`primary_contact_no` AS organizationContactNumber FROM `enterprises` AS e LEFT JOIN `enterprise_contacts` AS ec ON `ec`.`enterprise_id`=`e`.`id` WHERE `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
    } else if(organizationName!=''){        
        var OrganizationSearch = await sequelize.query("SELECT `e`.`id` AS organizationId, `e`.`organisation_name` AS organizationName, `e`.`address` AS organizationAddress, `e`.`email` AS organizationContactName, `e`.`primary_contact_no` AS organizationContactNumber FROM `enterprises` AS e LEFT JOIN `enterprise_contacts` AS ec ON `ec`.`enterprise_id`=`e`.`id` WHERE `e`.`organisation_name` LIKE '%"+organizationName+"%'",{ type: Sequelize.QueryTypes.SELECT });
    } else {
        res.status(200).json({ success: "false",data: "Please Provied organization id or name"});// Return json with error massage
    }    
    if(OrganizationSearch.length > 0){ //query result length check
        var newBranch = {};
        newBranch["branchName"] = "ss";//static data push in array
        newBranch['branchAddress'] = 'ss';//static data push in array
        newBranch['branchContactName'] = 'ss';//static data push in array
        newBranch['branchContactNumber'] = 'ss';//static data push in array
        newBranch['branchLocation']={}; //static data push in array
        newBranch['branchLocation']['lan']='ss'; //static data push in array
        newBranch['branchLocation']['lat']='ss'; //static data push in array
        OrganizationSearch[0]['ListOfBranch'] = []; //create ListOfBranch array
        OrganizationSearch[0]['ListOfBranch'][0]=newBranch;  //assign data into ListOfBranch array
        res.status(200).send({ success: true, data: OrganizationSearch[0]}); //Return json with data or empty
    }else{
        res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
    }
}
/************************* search organization ends *******************************/

/************************* search tracking start *******************************/
exports.getTrackingSearch = async function(req, res, next) {
    var trackingId = req.body.trackingId;
    var TrackingSearch=[];
    var Tracking_Search='';
    if(trackingId!=''){
        Tracking_Search = await sequelize.query("SELECT `t`.`tracking_id`, `t`.`longitude`, `t`.`latitude`, `e`.`id` AS OrganizationId, `e`.`primary_contact_no` AS OrganizationNumber FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`id`='"+trackingId+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(Tracking_Search.length <= 0){
            Tracking_Search = await sequelize.query("SELECT `t`.`tracking_id`, `t`.`longitude`, `t`.`latitude`, `e`.`id` AS OrganizationId, `e`.`primary_contact_no` AS OrganizationNumber FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`vehicle_number`='"+trackingId+"'",{ type: Sequelize.QueryTypes.SELECT });
            if(Tracking_Search.length <= 0){
                Tracking_Search = await sequelize.query("SELECT `t`.`tracking_id`, `t`.`longitude`, `t`.`latitude`, `e`.`id` AS OrganizationId, `e`.`primary_contact_no` AS OrganizationNumber FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `e`.`id`='"+trackingId+"'",{ type: Sequelize.QueryTypes.SELECT });
                if(Tracking_Search.length <= 0){
                    Tracking_Search = await sequelize.query("SELECT `t`.`tracking_id`, `t`.`longitude`, `t`.`latitude`, `e`.`id` AS OrganizationId, `e`.`primary_contact_no` AS OrganizationNumber FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`driver_mobile_number`='"+trackingId+"'",{ type: Sequelize.QueryTypes.SELECT });
                }
            }
        }
        if(Tracking_Search.length > 0){
            Tracking_Search.forEach(function(k,p){
                var FromArray ={};
                var ToArray ={};
                var Search ={};
                FromArray['lan']=k.longitude;
                FromArray['lat']=k.latitude;
                ToArray['lan']=k.longitude;
                ToArray['lat']=k.latitude;
                Search['trackingId'] = k.tracking_id;
                Search['From']=FromArray;
                Search['To']=ToArray;
                Search['OrganizationId']=k.OrganizationId;
                Search['OrganizationNumber']=k.OrganizationNumber;
                Search['branchId']='';
                Search['branchAddress']='';
                Search['branchContact']='';
                TrackingSearch[p] = Search;
            });
            res.status(200).json({ success: "false",ListOfOrganization: TrackingSearch});// Return json with error massage
        } else {
            res.status(200).json({ success: "false",ListOfOrganization: "No data found!"});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",ListOfOrganization: "All fileds are required!"});// Return json with error massage
    }  
}
/************************* search tracking ends *******************************/

/************************* active Inactive Shipper start *******************************/
exports.getActiveInactiveShipper = async function(req, res, next) {
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var type = req.body.type;
    var count = req.body.count;
    if(type !='' && count !='' && fromDate !='' && toDate !=''){
        var ActiveInactiveShipper = await sequelize.query("SELECT `e`.`id` AS OrganizationId, `e`.`primary_contact_no` AS OrganizationNumber, COUNT(`t`.`id`) AS totalTracking FROM `tracking_details` AS t LEFT JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `e`.`status`='"+type+"' AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"' LIMIT "+count+"",{ type: Sequelize.QueryTypes.SELECT });
        if(ActiveInactiveShipper.length > 0){  //query result length check
            res.status(200).send({ success: true, ListOfOrganization: ActiveInactiveShipper}); //Return json with data or empty
        }else{
            res.status(200).json({ success: "false",ListOfOrganization: "No data found!"});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",ListOfOrganization: "All fileds are required!"});// Return json with error massage
    }
}
/************************* active Inactive Shipper ends *******************************/