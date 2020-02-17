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
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
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
    if(fromCount >= 0, toCount > fromCount, fromDate !='', toDate !=''){
        var sortBy = (sort_By == 'name') ? " ORDER BY organisation_name ASC" : " ORDER BY status ASC";
        var limit = " LIMIT "+toCount+" OFFSET "+fromCount+"";
        var CompleteOrganizationList = await sequelize.query("SELECT `e`.`id` AS organizationId, `e`.`organisation_name` AS organizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `ec`.`contact_person` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile FROM `enterprises` AS e LEFT JOIN `enterprise_contacts` AS ec ON `ec`.`enterprise_id`=`e`.`id` WHERE DATE(`e`.`created_at`)>='"+fromDate+"' AND DATE(`e`.`created_at`) <='"+toDate+"'"+sortBy+limit+"",{ type: Sequelize.QueryTypes.SELECT });
        if(CompleteOrganizationList.length > 0){ //query result length check
            CompleteOrganizationList.forEach(async function(k,p){
                CompleteOrganizationList[p]['ListOfBranch'] = []; //create ListOfBranch array
                CompleteOrganizationList[p]['ListOfTraking'] = []; //create ListOfBranch array
                CompleteOrganizationList[p]['ListOfLoad'] = []; //create ListOfBranch array
                var LoadBranchByOrgId = await sequelize.query("SELECT `id` AS BranchId, `name` AS BranckName, `contact_name` AS BranchContactName, `contact_number` AS BranchContactNumber FROM `branchs` WHERE `enterprise_id`="+k.organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadBranchByOrgId.length > 0){
                    LoadBranchByOrgId.forEach(function(m,n){
                        CompleteOrganizationList[p]['ListOfBranch'][n]=m;  //assign data into ListOfBranch array
                    });
                }
                var LoadTrakingByOrgId = await sequelize.query("SELECT `t`.`id` AS trackingId, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`tracked_mobile_number` AS activeMobile, `t`.`client_contact_mobile` AS activeContact FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `e`.`id`="+k.organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadTrakingByOrgId.length > 0){
                    LoadTrakingByOrgId.forEach(function(a,t){
                        CompleteOrganizationList[p]['ListOfTraking'][t]=a;  //assign data into ListOfBranch array
                    });
                }
                var LoadListByOrgId = await sequelize.query("SELECT `l`.`pickup_location_latitude` AS pickupLatitude, `l`.`pickup_location_longitude` AS pickupLongitude, `l`.`pickup_location_address` AS pickupAddress, `l`.`pickup_person_mobile` AS pickupMobile, `l`.`drop_location_latitude` AS dropLatitude, `l`.`drop_location_longitude` AS dropLongitude, `l`.`drop_location_address` AS dropAddress, `l`.`drop_person_mobile` AS dropMobile, COALESCE(SUM(IF(`q`.`status` = 'active', 1, 0)),0) AS status FROM `loads` AS l INNER JOIN `quotations` AS q ON `q`.`load_id`=`l`.`id` WHERE `l`.`consignee_enterprise_id`="+k.organizationId+" GROUP BY `l`.`id`",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadListByOrgId.length > 0){
                    LoadListByOrgId.forEach(function(r,s){
                        CompleteOrganizationList[p]['ListOfLoad'][s]=r;  //assign data into ListOfBranch array
                    });
                }
                res.status(200).send({ success: true, data: CompleteOrganizationList}); //Return json with data or empty
            });
        }else{
            res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Get Complete Organization List Ends *******************************/

/************************* Get Complete Organization List Start *******************************/
exports.searchOrganizationInDetails = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    if(organizationId != ''){
        var CompleteOrganizationList = await sequelize.query("SELECT `e`.`id` AS organizationId, `e`.`organisation_name` AS organizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `ec`.`contact_person` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile FROM `enterprises` AS e LEFT JOIN `enterprise_contacts` AS ec ON `ec`.`enterprise_id`=`e`.`id` WHERE `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
        if(CompleteOrganizationList.length > 0){ //query result length check
            CompleteOrganizationList.forEach(async function(k,p){
                CompleteOrganizationList[p]['ListOfBranch'] = []; //create ListOfBranch array
                CompleteOrganizationList[p]['ListOfTraking'] = []; //create ListOfBranch array
                CompleteOrganizationList[p]['ListOfLoad'] = []; //create ListOfBranch array
                var LoadBranchByOrgId = await sequelize.query("SELECT `id` AS BranchId, `name` AS BranckName, `contact_name` AS BranchContactName, `contact_number` AS BranchContactNumber FROM `branchs` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadBranchByOrgId.length > 0){
                    LoadBranchByOrgId.forEach(function(m,n){
                        CompleteOrganizationList[p]['ListOfBranch'][n]=m;  //assign data into ListOfBranch array
                    });
                }
                var LoadTrakingByOrgId = await sequelize.query("SELECT `t`.`id` AS trackingId, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`tracked_mobile_number` AS activeMobile, `t`.`client_contact_mobile` AS activeContact FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadTrakingByOrgId.length > 0){
                    LoadTrakingByOrgId.forEach(function(a,t){
                        CompleteOrganizationList[p]['ListOfTraking'][t]=a;  //assign data into ListOfBranch array
                    });
                }
                var LoadListByOrgId = await sequelize.query("SELECT `l`.`pickup_location_latitude` AS pickupLatitude, `l`.`pickup_location_longitude` AS pickupLongitude, `l`.`pickup_location_address` AS pickupAddress, `l`.`pickup_person_mobile` AS pickupMobile, `l`.`drop_location_latitude` AS dropLatitude, `l`.`drop_location_longitude` AS dropLongitude, `l`.`drop_location_address` AS dropAddress, `l`.`drop_person_mobile` AS dropMobile, COALESCE(SUM(IF(`q`.`status` = 'active', 1, 0)),0) AS status FROM `loads` AS l INNER JOIN `quotations` AS q ON `q`.`load_id`=`l`.`id` WHERE `l`.`consignee_enterprise_id`="+organizationId+" GROUP BY `l`.`id`",{ type: Sequelize.QueryTypes.SELECT });
                if(LoadListByOrgId.length > 0){
                    LoadListByOrgId.forEach(function(r,s){
                        CompleteOrganizationList[p]['ListOfLoad'][s]=r;  //assign data into ListOfBranch array
                    });
                }
                res.status(200).send({ success: true, data: CompleteOrganizationList}); //Return json with data or empty
            });
        }else{
            res.status(200).json({ success: "false",data: "No data found!"});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Get Complete Organization List Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.addUserToOrganization = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    var userName = req.body.userName;
    var userMobileNumber = req.body.userMobileNumber;
    var userRole = req.body.userRole;
    if(organizationId != '' && userName != '' && userMobileNumber != '' && userRole != ''){
        var addUserToOrganization = await sequelize.query("INSERT INTO `users`(`enterprise_id`, `name`,  `mobile`, `user_type`) VALUES ("+organizationId+",'"+userName+"','"+userMobileNumber+"','"+userRole+"')",{ type: Sequelize.QueryTypes.INSERT });
        if(addUserToOrganization.slice(-1)[0] > 0){ //query result length check
            res.status(200).send({ success: 'true'}); //Return json with data or empty
        }else{
            res.status(200).json({ success: 'false'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Remove User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.removeUserFromOrganization = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    var userId = req.body.userId;
    if(organizationId != '' && userId != ''){
        var removeUserFromOrganization = await sequelize.query("DELETE FROM `users` WHERE `id`="+userId+" AND `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.DELETE });
        res.status(200).send({ success: 'true'}); //Return json with data or empty
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Remove User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.addBranchToOrganization = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    var BranchName = req.body.BranchName;
    var BranchContactPerson = req.body.BranchContactPerson;
    var BranchContactNumber = req.body.BranchContactNumber;
    var lat = req.body.BranchLocation.lat;
    var lang = req.body.BranchLocation.lang;
    if(organizationId != '' && BranchName != '' && BranchContactPerson != '' && BranchContactNumber != ''&& lat != '' && lang != ''){
        var addUserToOrganization = await sequelize.query("INSERT INTO `branchs`(`enterprise_id`, `name`, `contact_name`, `contact_number`,`latitude`, `longitude`) VALUES ("+organizationId+",'"+BranchName+"','"+BranchContactPerson+"','"+BranchContactNumber+"','"+lat+"','"+lang+"')",{ type: Sequelize.QueryTypes.INSERT });
        if(addUserToOrganization.slice(-1)[0] > 0){ //query result length check
            res.status(200).send({ success: 'true'}); //Return json with data or empty
        }else{
            res.status(200).json({ success: 'false'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Remove User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.removeBranchToOrganization = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    var BranchId = req.body.BranchId;
    if(organizationId != '' && BranchId != ''){
        var removeBranchToOrganization = await sequelize.query("DELETE FROM `branchs` WHERE `id`="+BranchId+" AND `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.DELETE });
        res.status(200).send({ success: 'true'}); //Return json with data or empty
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Remove User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.searchUser = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    if(organizationId != ''){
        var searchUser = await sequelize.query("SELECT `id` AS userId, `enterprise_id` AS organizationId, `name` AS UserName, `mobile` AS UserMobileNumber, `user_type` AS UserRole  FROM `users` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
        res.status(200).send({ success: 'true',data: searchUser}); //Return json with data or empty
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Remove User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.editOrganizationById = async function(req, res, next) {
    var organizationId = req.body.organizationId;
    var organisationName = req.body.organisationName;
    var type = req.body.type;
    var country = req.body.country;
    var city = req.body.city;
    var state = req.body.state;
    var pincode = req.body.pincode;
    var contactNo = req.body.contactNo;
    var currency = req.body.currency;
    if(organisationName != '' && type != '' && country != '' && city != ''&& state != '' && pincode != '' && contactNo != '' && currency != ''){
        var addUserToOrganization = await sequelize.query("UPDATE `enterprises` SET `organisation_name`='"+organisationName+"', `type`='"+type+"', `country`='"+country+"', `city`='"+city+"', `state`='"+state+"', `pincode`='"+pincode+"', `primary_contact_no`='"+contactNo+"', `currency`='"+currency+"' WHERE `id`="+organizationId+"",{ type: Sequelize.QueryTypes.UPDATE });
        if(addUserToOrganization.slice(-1)[0] > 0){ //query result length check
            res.status(200).send({ success: 'true'}); //Return json with data or empty
        }else{
            res.status(200).json({ success: 'false'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Remove User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.createOrganizationById = async function(req, res, next) {
    var organisationName = req.body.organisationName;
    var type = req.body.type;
    var country = req.body.country;
    var city = req.body.city;
    var state = req.body.state;
    var pincode = req.body.pincode;
    var contactNo = req.body.contactNo;
    var currency = req.body.currency;
    if(organisationName != '' && type != '' && country != '' && city != ''&& state != '' && pincode != '' && contactNo != '' && currency != ''){
        var createOrganizationById = await sequelize.query("INSERT INTO `enterprises`(`organisation_name`, `type`, `country`, `city`, `state`, `pincode`, `primary_contact_no`, `currency`) VALUES ('"+organisationName+"', '"+type+"', '"+country+"', '"+city+"', '"+state+"', '"+pincode+"', '"+contactNo+"', '"+currency+"')",{ type: Sequelize.QueryTypes.INSERT });
        if(createOrganizationById.slice(-1)[0] > 0){ //query result length check
            res.status(200).send({ success: 'true'}); //Return json with data or empty
        }else{
            res.status(200).json({ success: 'false'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Remove User To Organization Ends *******************************/