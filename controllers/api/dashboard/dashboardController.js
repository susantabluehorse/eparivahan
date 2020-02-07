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
            var TrackingCount =await sequelize.query("SELECT COALESCE(SUM(IF(`t`.`status` = 'active', 1, 0)),0) AS active, COALESCE(SUM(IF(`t`.`status` = 'tracked', 1, 0)),0) AS tracked, COALESCE(SUM(IF(`t`.`status` = 'not-tracked', 1, 0)),0) AS 'not-tracked', COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS completed FROM `tracking_details` AS t INNER JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'",{ type: Sequelize.QueryTypes.SELECT });
        } else { // Shipper get particular thair data
            var TrackingCount =await sequelize.query("SELECT COALESCE(SUM(IF(`t`.`status` = 'active', 1, 0)),0) AS active, COALESCE(SUM(IF(`t`.`status` = 'tracked', 1, 0)),0) AS tracked, COALESCE(SUM(IF(`t`.`status` = 'not-tracked', 1, 0)),0) AS 'not-tracked', COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS completed FROM `tracking_details` AS t INNER JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` WHERE `t`.`tracked_by_user_id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'",{ type: Sequelize.QueryTypes.SELECT });
        }
        res.status(200).json({data:TrackingCount[0]}); //Return json with data or empty
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
            var TrackingHistory =await sequelize.query("SELECT COUNT(`t`.`id`) AS TotalRows, COUNT(DISTINCT `e`.`id`) AS totalShipper, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS totalcompleted, COUNT(DISTINCT `t`.`tracked_mobile_number`) AS totalNumberTracked, COUNT(DISTINCT `t`.`vehicle_number`) AS totalVehicleTracked FROM `tracking_details` AS t INNER JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` INNER JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
        } else { // Shipper get particular thair data
            var TrackingHistory =await sequelize.query("SELECT COUNT(`t`.`id`) AS TotalRows, COUNT(DISTINCT `e`.`id`) AS totalShipper, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS totalcompleted, COUNT(DISTINCT `t`.`tracked_mobile_number`) AS totalNumberTracked, COUNT(DISTINCT `t`.`vehicle_number`) AS totalVehicleTracked FROM `tracking_details` AS t INNER JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` INNER JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`tracked_by_user_id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+"",{ type: Sequelize.QueryTypes.SELECT });
        }
        res.status(200).json({data:TrackingHistory[0]}); //Return json with data or empty
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
                var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, {fn MONTHNAME(`t`.`start_date`)} AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t INNER JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` INNER JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='active'  AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY MONTH(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
            } else {  // Fetch Data Date Wise
                var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, DATE_FORMAT(`t`.`start_date`,'%d-%m-%Y') AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t INNER JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` INNER JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='active'  AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY DATE(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
            }
        } else { // Shipper get particular thair data
            if(type=='month'){ // Fetch Data Month Wise
                var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, {fn MONTHNAME(`t`.`start_date`)} AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t INNER JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` INNER JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='active' AND `t`.`tracked_by_user_id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY MONTH(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });
            } else {  // Fetch Data Date Wise
                var Failed =await sequelize.query("SELECT COUNT(`t`.`id`) AS totalFailed, DATE_FORMAT(`t`.`start_date`,'%d-%m-%Y') AS month, COUNT(`t`.`start_date`) AS count FROM `tracking_details` AS t INNER JOIN `users` AS u ON `u`.`id`=`t`.`tracked_by_user_id` INNER JOIN `enterprises` AS e ON `e`.`id`=`u`.`enterprise_id` WHERE `t`.`status`='active' AND `t`.`tracked_by_user_id`="+userId+" AND DATE(`t`.`start_date`)>='"+fromDate+"' AND DATE(`t`.`start_date`) <='"+toDate+"'"+shipperIdQ+" GROUP BY DATE(`start_date`)",{ type: Sequelize.QueryTypes.SELECT });              
            }
        }
        if(Failed.length > 0){
            FailedAnalysis['totalFailed']=0;
            var totalFailed = 0;
            Failed.forEach(function(k,p){
                totalFailed = totalFailed + k.totalFailed;
                FailedAnalysis[k.month]=k.count;    
            });
            FailedAnalysis['totalFailed']=totalFailed;
        }
        res.status(200).json({data:FailedAnalysis}); //Return json with data or empty
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

    var category_list = await sequelize.query("SELECT categories.category_id, categories.title, (SELECT COUNT(*) FROM candidate_looking_for WHERE categories.category_id=candidate_looking_for.category) as candidate_count_by_category FROM categories where categories.status='active' order by categories.title ASC",{ type: Sequelize.QueryTypes.SELECT });
    var location_list = await sequelize.query("SELECT COUNT(*) as candidate_count_by_location, location as candidate_location FROM candidate_looking_for GROUP BY location",{ type: Sequelize.QueryTypes.SELECT });
    
    //if(category_list){
        res.status(200).send({ success: true, category_list: category_list, location_list: location_list});
    // }else{
    //     res.status(200).send({ message: "No category found" });
    // }    
}
/************************* search organization ends *******************************/

/************************* search tracking start *******************************/
exports.getTrackingSearch = async function(req, res, next) {

    var category_list = await sequelize.query("SELECT categories.category_id, categories.title, (SELECT COUNT(*) FROM candidate_looking_for WHERE categories.category_id=candidate_looking_for.category) as candidate_count_by_category FROM categories where categories.status='active' order by categories.title ASC",{ type: Sequelize.QueryTypes.SELECT });
    var location_list = await sequelize.query("SELECT COUNT(*) as candidate_count_by_location, location as candidate_location FROM candidate_looking_for GROUP BY location",{ type: Sequelize.QueryTypes.SELECT });
    
    //if(category_list){
        res.status(200).send({ success: true, category_list: category_list, location_list: location_list});
    // }else{
    //     res.status(200).send({ message: "No category found" });
    // }    
}
/************************* search tracking ends *******************************/

/************************* active Inactive Shipper start *******************************/
exports.getActiveInactiveShipper = async function(req, res, next) {

    var category_list = await sequelize.query("SELECT categories.category_id, categories.title, (SELECT COUNT(*) FROM candidate_looking_for WHERE categories.category_id=candidate_looking_for.category) as candidate_count_by_category FROM categories where categories.status='active' order by categories.title ASC",{ type: Sequelize.QueryTypes.SELECT });
    var location_list = await sequelize.query("SELECT COUNT(*) as candidate_count_by_location, location as candidate_location FROM candidate_looking_for GROUP BY location",{ type: Sequelize.QueryTypes.SELECT });
    
    //if(category_list){
        res.status(200).send({ success: true, category_list: category_list, location_list: location_list});
    // }else{
    //     res.status(200).send({ message: "No category found" });
    // }    
}
/************************* active Inactive Shipper ends *******************************/