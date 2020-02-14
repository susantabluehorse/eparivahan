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

/************************* Set Organization Status Start *******************************/
exports.setOrganizationStatus = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    var userId = req.body.userId;
    var status = req.body.status;
    if(status !='' && organizationId !='' && userId !=''){
        var OrganizationStatus =await sequelize.query("SELECT `e`.`id` AS Id FROM `enterprises` AS e INNER JOIN `users` AS u ON `u`.`enterprise_id`=`e`.`id` WHERE `e`.`id`="+organizationId+" AND `u`.`id`="+userId+"",{ type: Sequelize.QueryTypes.SELECT });
        if(OrganizationStatus.length > 0){
            var setOrganizationStatus =await sequelize.query("UPDATE enterprises SET `status`='"+status+"' WHERE `id`="+OrganizationStatus[0].Id+"",{ type: Sequelize.QueryTypes.UPDATE });
            if(setOrganizationStatus.slice(-1)[0] > 0) {
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
/************************* Set Organization Status Ends *******************************/

/************************* Get Load By Organization By Id Start *******************************/
exports.getLoadByOrganizationById = async function(req, res, next) {
    var organization_Id = req.body.organizationId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    if(organization_Id !='', fromDate !='', toDate !=''){
        var organizationId = (organization_Id > 0) ? " AND `e`.`id`="+organization_Id : '';
        var OrganizationById = await sequelize.query("SELECT `e`.`id` AS organizationId, `e`.`organisation_name` AS organizationName FROM `enterprises` AS e LEFT JOIN `enterprise_contacts` AS ec ON `ec`.`enterprise_id`=`e`.`id` WHERE DATE(`e`.`created_at`)>='"+fromDate+"' AND DATE(`e`.`created_at`) <='"+toDate+"'"+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
        if(OrganizationById.length > 0){ //query result length check
            OrganizationById.forEach(async function(k,p){
                OrganizationById[p]['loadDetailsId'] = []; //create ListOfBranch array
                var LoadBy = await sequelize.query("SELECT `l`.`id` AS loadId, `l`.`pickup_location_address` AS `from`, `l`.`drop_location_address` AS `to`, `l`.`load_date` AS `date`, if(count(`t`.`id`) > 0 , 'true', 'false') AS alreadyTracked, `l`.`status` FROM `loads` AS l LEFT JOIN `tracking_mappers` AS tm ON `tm`.`load_id`=`l`.`id` LEFT JOIN `tracking_details` AS t ON `t`.`tracking_id`=`tm`.`tracking_id` WHERE `l`.`consignee_enterprise_id`="+k.organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadBy.length > 0){
                    LoadBy.forEach(function(m,n){
                        OrganizationById[p]['loadDetailsId'][n]=m;  //assign data into ListOfBranch array
                    });
                }
                res.status(200).send({ success: true, data: OrganizationById}); //Return json with data or empty
            });
        }else{
            res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",ListOfOrganization: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Get Load By Organization By Id Ends *******************************/

/************************* Get Complete Organization List Start *******************************/
exports.getCompleteOrganizationList = async function(req, res, next) {
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var fromCount = req.body.fromCount;
    var toCount = req.body.toCount;
    var sort_By = req.body.sortBy;
    if(fromCount !='', toCount !='', fromDate !='', toDate !=''){
        var sortBy = (sort_By == 'name') ? " ORDER BY organisation_name ASC" : " ORDER BY status ASC";
        var limit = " LIMIT "+toCount+" OFFSET "+toCount+"";
        var CompleteOrganizationList = await sequelize.query("SELECT `e`.`id` AS organizationId, `e`.`organisation_name` AS organizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `ec`.`contact_person` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile FROM `enterprises` AS e LEFT JOIN `enterprise_contacts` AS ec ON `ec`.`enterprise_id`=`e`.`id` WHERE DATE(`e`.`created_at`)>='"+fromDate+"' AND DATE(`e`.`created_at`) <='"+toDate+"'"+sortBy+limit+"",{ type: Sequelize.QueryTypes.SELECT });
        if(CompleteOrganizationList.length > 0){ //query result length check
            CompleteOrganizationList.forEach(async function(k,p){
                CompleteOrganizationList[p]['ListOfBranch'] = []; //create ListOfBranch array
                CompleteOrganizationList[p]['ListOfLoad'] = []; //create ListOfBranch array
                CompleteOrganizationList[p]['ListOfTraking'] = []; //create ListOfBranch array
                var LoadBy = await sequelize.query("SELECT `l`.`id` AS loadId, `l`.`pickup_location_address` AS `from`, `l`.`drop_location_address` AS `to`, `l`.`load_date` AS `date`, if(count(`t`.`id`) > 0 , 'true', 'false') AS alreadyTracked, `l`.`status` FROM `loads` AS l LEFT JOIN `tracking_mappers` AS tm ON `tm`.`load_id`=`l`.`id` LEFT JOIN `tracking_details` AS t ON `t`.`tracking_id`=`tm`.`tracking_id` WHERE `l`.`consignee_enterprise_id`="+k.organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadBy.length > 0){
                    LoadBy.forEach(function(m,n){
                        CompleteOrganizationList[p]['ListOfBranch'][n]=m;  //assign data into ListOfBranch array
                    });
                }
                var LoadBy = await sequelize.query("SELECT `l`.`id` AS loadId, `l`.`pickup_location_address` AS `from`, `l`.`drop_location_address` AS `to`, `l`.`load_date` AS `date`, if(count(`t`.`id`) > 0 , 'true', 'false') AS alreadyTracked, `l`.`status` FROM `loads` AS l LEFT JOIN `tracking_mappers` AS tm ON `tm`.`load_id`=`l`.`id` LEFT JOIN `tracking_details` AS t ON `t`.`tracking_id`=`tm`.`tracking_id` WHERE `l`.`consignee_enterprise_id`="+k.organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadBy.length > 0){
                    LoadBy.forEach(function(r,s){
                        CompleteOrganizationList[p]['ListOfLoad'][s]=r;  //assign data into ListOfBranch array
                    });
                }
                var LoadBy = await sequelize.query("SELECT `l`.`id` AS loadId, `l`.`pickup_location_address` AS `from`, `l`.`drop_location_address` AS `to`, `l`.`load_date` AS `date`, if(count(`t`.`id`) > 0 , 'true', 'false') AS alreadyTracked, `l`.`status` FROM `loads` AS l LEFT JOIN `tracking_mappers` AS tm ON `tm`.`load_id`=`l`.`id` LEFT JOIN `tracking_details` AS t ON `t`.`tracking_id`=`tm`.`tracking_id` WHERE `l`.`consignee_enterprise_id`="+k.organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadBy.length > 0){
                    LoadBy.forEach(function(x,y){
                        CompleteOrganizationList[p]['loadDetailsId'][y]=x;  //assign data into ListOfBranch array
                    });
                }
                res.status(200).send({ success: true, data: CompleteOrganizationList}); //Return json with data or empty
            });
        }else{
            res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",ListOfOrganization: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Get Complete Organization List Ends *******************************/

/************************* Get Complete Organization List Start *******************************/
exports.searchOrganizationInDetails = async function(req, res, next) {
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var fromCount = req.body.fromCount;
    var toCount = req.body.toCount;
    var sort_By = req.body.sortBy;
    if(fromCount !='', toCount !='', fromDate !='', toDate !=''){
        var sortBy = (sort_By == 'name') ? " ORDER BY organisation_name ASC" : " ORDER BY status ASC";
        var limit = " LIMIT "+toCount+" OFFSET "+toCount+"";
        var CompleteOrganizationList = await sequelize.query("SELECT `e`.`id` AS organizationId, `e`.`organisation_name` AS organizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `ec`.`contact_person` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile FROM `enterprises` AS e LEFT JOIN `enterprise_contacts` AS ec ON `ec`.`enterprise_id`=`e`.`id` WHERE DATE(`e`.`created_at`)>='"+fromDate+"' AND DATE(`e`.`created_at`) <='"+toDate+"'"+sortBy+limit+"",{ type: Sequelize.QueryTypes.SELECT });
        if(CompleteOrganizationList.length > 0){ //query result length check
            CompleteOrganizationList.forEach(async function(k,p){
                CompleteOrganizationList[p]['ListOfBranch'] = []; //create ListOfBranch array
                CompleteOrganizationList[p]['ListOfLoad'] = []; //create ListOfBranch array
                CompleteOrganizationList[p]['ListOfTraking'] = []; //create ListOfBranch array
                var LoadBy = await sequelize.query("SELECT `l`.`id` AS loadId, `l`.`pickup_location_address` AS `from`, `l`.`drop_location_address` AS `to`, `l`.`load_date` AS `date`, if(count(`t`.`id`) > 0 , 'true', 'false') AS alreadyTracked, `l`.`status` FROM `loads` AS l LEFT JOIN `tracking_mappers` AS tm ON `tm`.`load_id`=`l`.`id` LEFT JOIN `tracking_details` AS t ON `t`.`tracking_id`=`tm`.`tracking_id` WHERE `l`.`consignee_enterprise_id`="+k.organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadBy.length > 0){
                    LoadBy.forEach(function(m,n){
                        CompleteOrganizationList[p]['ListOfBranch'][n]=m;  //assign data into ListOfBranch array
                    });
                }
                var LoadBy = await sequelize.query("SELECT `l`.`id` AS loadId, `l`.`pickup_location_address` AS `from`, `l`.`drop_location_address` AS `to`, `l`.`load_date` AS `date`, if(count(`t`.`id`) > 0 , 'true', 'false') AS alreadyTracked, `l`.`status` FROM `loads` AS l LEFT JOIN `tracking_mappers` AS tm ON `tm`.`load_id`=`l`.`id` LEFT JOIN `tracking_details` AS t ON `t`.`tracking_id`=`tm`.`tracking_id` WHERE `l`.`consignee_enterprise_id`="+k.organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadBy.length > 0){
                    LoadBy.forEach(function(r,s){
                        CompleteOrganizationList[p]['ListOfLoad'][s]=r;  //assign data into ListOfBranch array
                    });
                }
                var LoadBy = await sequelize.query("SELECT `l`.`id` AS loadId, `l`.`pickup_location_address` AS `from`, `l`.`drop_location_address` AS `to`, `l`.`load_date` AS `date`, if(count(`t`.`id`) > 0 , 'true', 'false') AS alreadyTracked, `l`.`status` FROM `loads` AS l LEFT JOIN `tracking_mappers` AS tm ON `tm`.`load_id`=`l`.`id` LEFT JOIN `tracking_details` AS t ON `t`.`tracking_id`=`tm`.`tracking_id` WHERE `l`.`consignee_enterprise_id`="+k.organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadBy.length > 0){
                    LoadBy.forEach(function(x,y){
                        CompleteOrganizationList[p]['loadDetailsId'][y]=x;  //assign data into ListOfBranch array
                    });
                }
                res.status(200).send({ success: true, data: CompleteOrganizationList}); //Return json with data or empty
            });
        }else{
            res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",ListOfOrganization: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Get Complete Organization List Ends *******************************/