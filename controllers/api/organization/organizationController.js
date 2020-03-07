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
/************************* Set Organization Status Start *******************************/
exports.setOrganizationStatus = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, active } = req.body;
            var mobileVali = validation.setOrganizationStatus(req.body);
            if(mobileVali.passes()===true){
                var OrganizationStatus =await sequelize.query("SELECT `e`.`id` AS Id FROM `enterprises` AS e LEFT JOIN `users` AS u ON `u`.`enterprise_id`=`e`.`id` WHERE `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(OrganizationStatus.length > 0){
                    var status = (active=='true') ? 'active' : 'inactive';
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
                res.status(200).json({ success: mobileVali.passes(),data:mobileVali.errors.errors});// Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Set Organization Status Ends *******************************/

/************************* Get Load By Organization By Id Start *******************************/
exports.getLoadByOrganizationById = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, fromDate, toDate } = req.body;
            var mobileVali = validation.getLoadByOrganizationById(req.body);
            if(mobileVali.passes()===true){
                var organization_Id = (organizationId > 0) ? " AND `id`="+organizationId : ''; 
                var getLoadByOrganizationById =await sequelize.query("SELECT `id` AS organizationId, `organisation_name` AS organizationName FROM `enterprises` WHERE DATE(`created_at`) >='"+fromDate+"' AND DATE(`created_at`) <='"+toDate+"'"+organization_Id+"",{ type: Sequelize.QueryTypes.SELECT });
                if(getLoadByOrganizationById.length > 0){ //query result length check
                    for (var p = 0; p < getLoadByOrganizationById.length; p++) {
                        getLoadByOrganizationById[p]['loadDetailsId'] = []; //create ListOfLoad array
                        var LoadBy =await sequelize.query("SELECT `l`.`id` AS loadId, `l`.`pickup_location_address` AS `from`, `l`.`drop_location_address` AS `to`, `l`.`load_date` AS `date`, if(count(`lt`.`id`) > 0 , 'true', 'false') AS alreadyTracked, `l`.`load_status` AS status FROM `loads` AS l LEFT JOIN `loads_tracks` AS lt ON `lt`.`load_id`=`l`.`id` WHERE `l`.`consignee_enterprise_id`="+getLoadByOrganizationById[p].organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                        getLoadByOrganizationById[p]['loadDetailsId']=LoadBy;
                    };
                    res.status(200).send({ success: true, data: getLoadByOrganizationById}); //Return json with data or empty
                }else{
                    res.status(200).json({ success: false,data: "No data found!"});// Return json with error massage
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
/************************* Set Load By Organization Status Ends *******************************/

/************************* Get Organization By Id Start *******************************/
exports.getOrganizationById = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.getOrganizationById(req.body);
            if(mobileVali.passes()===true){
                var OrganizationById = await sequelize.query("SELECT `id` AS organizationId, `organisation_name` AS OrganizationName, `address` AS OrganizationAddress,`country` AS OrganizationCountry, `state` AS OrganizationState, `city` AS OrganizationCity, `pincode` AS OrganizationPin, `email` AS OrganizationEmail, `contact_name` AS OrganizationContact, `contact_mobile_number` AS OrganizationMobile, `contact_primary_name` AS primaryContactName, `primary_contact_no` AS primaryContactMobileNumber, if(`bidding_client`=1,'true','false') AS biddingClient, if(`status`='active','true','false') AS active FROM `enterprises` WHERE `id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(OrganizationById.length > 0){ //query result length check
                    for (var p = 0; p < OrganizationById.length; p++) {
                        OrganizationById[p]['branchArr'] = []; //create ListOfLoad array
                        var LoadBy = await sequelize.query("SELECT `id` AS BranchId, `name` AS BranchName, `contact_name` AS BranchContactName, `contact_number` AS BranchContactNumber, `latitude` AS BranchLat, `longitude` AS BranchLang, `state` AS BranchState, `city` AS BranchCity, `pin` AS BranchPin  FROM `branchs` WHERE `enterprise_id`="+OrganizationById[p].organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                        OrganizationById[p]['branchArr']=LoadBy;

                    };
                    res.status(200).send({ success: true, data: OrganizationById}); //Return json with data or empty
                }else{
                    res.status(200).json({ success: false,data: "No data found!"});// Return json with error massage
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
/************************* Get Organization By Id Ends *******************************/

/************************* Get Complete Organization List Start *******************************/
exports.getCompleteOrganizationList = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { fromCount, toCount, sortBy, sortType } = req.body;
            var mobileVali = validation.getCompleteOrganizationList(req.body);
            if(mobileVali.passes()===true){
                var sort_Type = (sortType == 'DESC') ? "DESC" : "ASC";
                var sort_By = (sortBy == 'name') ? " ORDER BY `organisation_name` "+sort_Type : " ORDER BY `status` "+sort_Type;
                var limit = " LIMIT "+toCount+" OFFSET "+fromCount+"";                
                var CompleteOrganizationList = await sequelize.query("SELECT `id` AS organizationId, `organisation_name` AS OrganizationName, `address` AS OrganizationAddress, `country` AS OrganizationCountry, `state` AS OrganizationState, `city` AS OrganizationCity, `pincode` AS OrganizationPin, `email` AS OrganizationEmail, `contact_name` AS OrganizationContact, `contact_mobile_number` AS OrganizationMobile, `contact_primary_name` AS primaryContactName, `primary_contact_no` AS primaryContactMobileNumber, if(`bidding_client`=1,'true','false') AS biddingClient, if(`status`='active','true','false') AS active FROM `enterprises`"+sort_By+limit+"",{ type: Sequelize.QueryTypes.SELECT });
                if(CompleteOrganizationList.length > 0){ //query result length check
                    for (var p=0; p < CompleteOrganizationList.length; p++) {
                        CompleteOrganizationList[p]['branchArr'] = []; //create ListOfBranch array                        
                        var LoadBranchByOrgId = await sequelize.query("SELECT `id` AS BranchId, `name` AS BranchName,`contact_name` AS BranchContactName, `contact_number` AS BranchContactNumber, `latitude` AS BranchLat, `longitude` AS BranchLang, `state` AS BranchState, `city` AS BranchCity, `pin` AS BranchPin  FROM `branchs` WHERE `enterprise_id`="+CompleteOrganizationList[p].organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                        CompleteOrganizationList[p]['branchArr']=LoadBranchByOrgId;
                        var LoadTrakingByOrgId = await sequelize.query("SELECT count(`t`.`id`) AS TotalTracking, COALESCE(SUM(IF(`t`.`status` = 'in-progress', 1, 0)),0) AS inprogressTracking, COALESCE(SUM(IF(`t`.`status` = 'canceled', 1, 0)),0) AS calcelledTracking, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS completedTracking, COALESCE(SUM(IF(`t`.`status` = 'awaited', 1, 0)),0) AS awaitedTracking FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `e`.`id`="+CompleteOrganizationList[0].organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                        if(LoadTrakingByOrgId.length > 0){
                            CompleteOrganizationList[p]['TotalTracking'] = LoadTrakingByOrgId[0]['TotalTracking'];
                            CompleteOrganizationList[p]['inprogressTracking'] = LoadTrakingByOrgId[0]['inprogressTracking'];
                            CompleteOrganizationList[p]['calcelledTracking'] = LoadTrakingByOrgId[0]['calcelledTracking'];
                            CompleteOrganizationList[p]['completedTracking'] = LoadTrakingByOrgId[0]['completedTracking'];
                            CompleteOrganizationList[p]['awaitedTracking'] = LoadTrakingByOrgId[0]['awaitedTracking'];
                        }
                    };
                    res.status(200).send({ success: true, data: CompleteOrganizationList}); //Return json with data or empty
                }else{
                    res.status(200).json({ success: false,data: "No data found!"});// Return json with error massage
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
/************************* Get Complete Organization List Ends *******************************/

/************************* Get Complete Organization List Start *******************************/
exports.searchOrganizationInDetails = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.searchOrganizationInDetails(req.body);
            if(mobileVali.passes()===true){
                var CompleteOrganizationList = await sequelize.query("SELECT `id` AS organizationId, `organisation_name` AS OrganizationName, `address` AS OrganizationAddress, `country` AS OrganizationCountry, `state` AS OrganizationState, `city` AS OrganizationCity, `pincode` AS OrganizationPin, `email` AS OrganizationEmail, `contact_name` AS OrganizationContact, `contact_mobile_number` AS OrganizationMobile, `contact_primary_name` AS primaryContactName, `primary_contact_no` AS primaryContactMobileNumber, if(`bidding_client`=1,'true','false') AS biddingClient, if(`status`='active','true','false') AS active FROM `enterprises` WHERE `id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(CompleteOrganizationList.length > 0){ //query result length check
                    for (var p = 0; p < CompleteOrganizationList.length; p++) {
                        CompleteOrganizationList[p]['branchArr'] = []; //create ListOfBranch array
                        var LoadBranchByOrgId = await sequelize.query("SELECT `id` AS BranchId, `name` AS BranchName,`contact_name` AS BranchContactName, `contact_number` AS BranchContactNumber, `latitude` AS BranchLat, `longitude` AS BranchLang, `state` AS BranchState, `city` AS BranchCity, `pin` AS BranchPin  FROM `branchs` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                        CompleteOrganizationList[p]['branchArr']=LoadBranchByOrgId;
                        var LoadTrakingByOrgId = await sequelize.query("SELECT count(`t`.`id`) AS TotalTracking, COALESCE(SUM(IF(`t`.`status` = 'in-progress', 1, 0)),0) AS inprogressTracking, COALESCE(SUM(IF(`t`.`status` = 'canceled', 1, 0)),0) AS calcelledTracking, COALESCE(SUM(IF(`t`.`status` = 'completed', 1, 0)),0) AS completedTracking, COALESCE(SUM(IF(`t`.`status` = 'awaited', 1, 0)),0) AS awaitedTracking FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE `e`.`id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                        if(LoadTrakingByOrgId.length > 0){
                            CompleteOrganizationList[p]['TotalTracking'] = LoadTrakingByOrgId[0]['TotalTracking'];
                            CompleteOrganizationList[p]['inprogressTracking'] = LoadTrakingByOrgId[0]['inprogressTracking'];
                            CompleteOrganizationList[p]['calcelledTracking'] = LoadTrakingByOrgId[0]['calcelledTracking'];
                            CompleteOrganizationList[p]['completedTracking'] = LoadTrakingByOrgId[0]['completedTracking'];
                            CompleteOrganizationList[p]['awaitedTracking'] = LoadTrakingByOrgId[0]['awaitedTracking'];
                        }
                        res.status(200).send({ success: true, data: CompleteOrganizationList}); //Return json with data or empty
                    };
                }else{
                    res.status(200).json({ success: false,data: "No data found!"});// Return json with error massage
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
/************************* Get Complete Organization List Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.addUserToOrganization = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, userName, userEmail, userMobileNumber, userRole, userStatus } = req.body;
            var mobileVali = validation.addUserToOrganization(req.body);
            if(mobileVali.passes()===true){
                var existUser = await sequelize.query("SELECT id FROM `users` WHERE `email`='"+userEmail+"' OR `mobile`='"+userMobileNumber+"'",{ type: Sequelize.QueryTypes.SELECT });
                if(existUser.length <= 0){
                    var addUserToOrganization = await sequelize.query("INSERT INTO `users`(`enterprise_id`, `name`, `email`, `mobile`, `user_type`, `status`) VALUES ("+organizationId+",'"+userName+"','"+userEmail+"','"+userMobileNumber+"','"+userRole+"','"+userStatus+"')",{ type: Sequelize.QueryTypes.INSERT });
                    if(addUserToOrganization.slice(-1)[0] > 0){ //query result length check
                        res.status(200).send({ success: true}); //Return json with data or empty
                    }else{
                        res.status(200).json({ success: false});// Return json with error massage
                    }
                } else {
                    res.status(200).json({ success: false,data: 'User already exist'});// Return json with error massage
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
/************************* Remove User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.editUserToOrganization = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, userId, userName, userEmail, userMobileNumber, userRole, userStatus } = req.body;
            var mobileVali = validation.editUserToOrganization(req.body);
            if(mobileVali.passes()===true){
                var existUser = await sequelize.query("SELECT id FROM `users` WHERE `email`='"+userEmail+"' OR `mobile`='"+userMobileNumber+"'",{ type: Sequelize.QueryTypes.SELECT });
                if(existUser.length > 0){
                    if(existUser[0].id == userId){
                        var editUserToOrganization = await sequelize.query("UPDATE `users` SET `enterprise_id`="+organizationId+", `name`='"+userName+"', `email`='"+userEmail+"', `mobile`='"+userMobileNumber+"', `user_type`='"+userRole+"', status='"+userStatus+"' WHERE `id`="+userId+"",{ type: Sequelize.QueryTypes.INSERT });
                        if(editUserToOrganization.slice(-1)[0] > 0){ //query result length check
                            res.status(200).send({ success: true}); //Return json with data or empty
                        }else{
                            res.status(200).json({ success: false});// Return json with error massage
                        }
                    } else {
                        res.status(200).json({ success: false,data: 'email id already exist another user'});
                    }
                } else {
                    res.status(200).json({ success: false,data: 'not found'});// Return json with error massage
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
/************************* Remove User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.removeUserFromOrganization = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, userId } = req.body;
            var mobileVali = validation.removeUserFromOrganization(req.body);
            if(mobileVali.passes()===true){
                var UserFromOrganizationExist = await sequelize.query("SELECT id FROM `users` WHERE `id`="+userId+" AND `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(UserFromOrganizationExist.length > 0){
                    var removeUserFromOrganization = await sequelize.query("DELETE FROM `users` WHERE `id`="+userId+" AND `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.DELETE });
                    res.status(200).send({ success: true}); //Return json with data or empty
                } else {
                    res.status(200).send({ success: false}); 
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
/************************* Remove User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.addBranchToOrganization = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, BranchName, BranchContactNumber, BranchContactName, BranchLat, BranchLang, BranchState, BranchCity, BranchPin } = req.body;
            var mobileVali = validation.addBranchToOrganization(req.body);
            if(mobileVali.passes()===true){
                var addUserToOrganization = await sequelize.query("INSERT INTO `branchs`(`enterprise_id`, `name`, `contact_name`, `contact_number`, `latitude`, `longitude`, `state`, `city`, `pin`) VALUES ("+organizationId+",'"+BranchName+"','"+BranchContactName+"','"+BranchContactNumber+"','"+BranchLat+"','"+BranchLang+"','"+BranchState+"','"+BranchCity+"','"+BranchPin+"')",{ type: Sequelize.QueryTypes.INSERT });
                if(addUserToOrganization.slice(-1)[0] > 0){ //query result length check
                    var branId = addUserToOrganization.slice(0,1);
                    res.status(200).send({ success: true,"BranchId":branId[0]}); //Return json with data or empty
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
/************************* Remove User To Organization Ends *******************************/

/************************* Edit User To Organization Start *******************************/
exports.editBranchToOrganization = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, BranchId, BranchName, BranchContactNumber, BranchContactName, BranchLat, BranchLang, BranchState, BranchCity, BranchPin } = req.body;
            var mobileVali = validation.editBranchToOrganization(req.body);
            if(mobileVali.passes()===true){
                var editUserToOrganization = await sequelize.query("UPDATE `branchs` SET `enterprise_id`="+organizationId+", `name`='"+BranchName+"', `contact_name`='"+BranchContactName+"', `contact_number`='"+BranchContactNumber+"', `latitude`='"+BranchLat+"', `longitude`='"+BranchLang+"', `state`='"+BranchState+"', `city`='"+BranchCity+"', `pin`='"+BranchPin+"' WHERE `id`="+BranchId+"",{ type: Sequelize.QueryTypes.INSERT });
                if(editUserToOrganization.slice(-1)[0] > 0){ //query result length check
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
/************************* Edit User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.removeBranchToOrganization = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, BranchId } = req.body;
            var mobileVali = validation.removeBranchToOrganization(req.body);
            if(mobileVali.passes()===true){
                var BranchToOrganizationExist = await sequelize.query("SELECT id FROM `branchs` WHERE `id`="+BranchId+" AND `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                if(BranchToOrganizationExist.length > 0){
                    var removeBranchToOrganization = await sequelize.query("DELETE FROM `branchs` WHERE `id`="+BranchId+" AND `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.DELETE });
                    res.status(200).send({ success: true}); //Return json with data or empty
                } else {
                    res.status(200).send({ success: false}); //Return json with data or empty
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
/************************* Remove User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.searchUser = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.searchOrganizationInDetails(req.body);
            if(mobileVali.passes()===true){
                var searchUser = await sequelize.query("SELECT `id` AS userId, `enterprise_id` AS organizationId, `name` AS UserName, `email` AS userEmail, `mobile` AS UserMobileNumber, `user_type` AS UserRole, `status` AS userStatus  FROM `users` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                res.status(200).send({ success: true,data: searchUser}); //Return json with data or empty
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
/************************* Remove User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.editOrganizationById = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, OrganizationName, OrganizationAddress, OrganizationType, OrganizationCountry, OrganizationState, OrganizationCity, OrganizationPin, OrganizationEmail, OrganizationContact, OrganizationMobile, primaryContactName, primaryContactMobileNumber, biddingClient, active } = req.body;
            var mobileVali = validation.editOrganizationById(req.body);
            if(mobileVali.passes()===true){             
                var statusN = (active==true) ? 'active' : 'inactive';
                var bidding_Client = (biddingClient==true) ? 1 : 0;
                var addUserToOrganization = await sequelize.query("UPDATE `enterprises` SET `organisation_name`='"+OrganizationName+"', `type`='"+OrganizationType+"', `email`='"+OrganizationEmail+"', `address`='"+OrganizationAddress+"', `country`='"+OrganizationCountry+"', `city`='"+OrganizationCity+"', `state`='"+OrganizationState+"', `pincode`='"+OrganizationPin+"', `contact_primary_name`='"+primaryContactName+"', `primary_contact_no`='"+primaryContactMobileNumber+"', `contact_name`='"+OrganizationContact+"', `contact_mobile_number`='"+OrganizationMobile+"', `bidding_client`='"+bidding_Client+"', `status`='"+statusN+"' WHERE `id`="+organizationId+"",{ type: Sequelize.QueryTypes.UPDATE });
                if(addUserToOrganization.slice(-1)[0] > 0){ //query result length check
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
/************************* Remove User To Organization Ends *******************************/

/************************* Add User To Organization Start *******************************/
exports.createOrganizationById = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, OrganizationName, OrganizationAddress, OrganizationType, OrganizationCountry, OrganizationState, OrganizationCity, OrganizationPin, OrganizationEmail, OrganizationContact, OrganizationMobile, primaryContactName, primaryContactMobileNumber, biddingClient, active } = req.body;
            var mobileVali = validation.createOrganizationById(req.body);
            if(mobileVali.passes()===true){
                var statusN = (active==true) ? 'active' : 'inactive';
                var bidding_Client = (bidding_Client==true) ? 1 : 0;
                var existOrganization = await sequelize.query("SELECT id FROM `enterprises` WHERE `email`='"+OrganizationEmail+"'",{ type: Sequelize.QueryTypes.SELECT });
                if(existOrganization.length <= 0){
                    var createOrganizationById = await sequelize.query("INSERT INTO `enterprises`(`organisation_name`, `type`, `email`, `address`, `country`, `city`, `state`, `pincode`, `contact_primary_name`, `primary_contact_no`, `contact_name`, `contact_mobile_number`, `bidding_client`, `status`) VALUES ('"+OrganizationName+"', '"+OrganizationType+"', '"+OrganizationEmail+"', '"+OrganizationAddress+"', '"+OrganizationCountry+"', '"+OrganizationCity+"', '"+OrganizationState+"', '"+OrganizationPin+"', '"+primaryContactName+"', '"+primaryContactMobileNumber+"', '"+OrganizationContact+"', '"+OrganizationMobile+"', '"+bidding_Client+"', '"+statusN+"')",{ type: Sequelize.QueryTypes.INSERT });
                    if(createOrganizationById.slice(-1)[0] > 0){ //query result length check
                        var orgId = createOrganizationById.slice(0,1);
                        res.status(200).send({ success: true,"organizationId":orgId[0]}); //Return json with data or empty
                    }else{
                        res.status(200).json({ success: false});// Return json with error massage
                    }
                } else {
                    res.status(200).json({ success: false,data: 'Organisation already exist'});//
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
/************************* Remove User To Organization Ends *******************************/
/************************* Add User To Organization Start *******************************/
exports.searchBranch = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId } = req.body;
            var mobileVali = validation.searchOrganizationInDetails(req.body);
            if(mobileVali.passes()===true){
                var searchBranch = await sequelize.query("SELECT `id` AS BranchId, `enterprise_id` AS organizationId, `name` AS BranchName,`contact_name` AS BranchContactName, `contact_number` AS BranchContactNumber, `latitude` AS BranchLat, `longitude` AS BranchLang, `state` AS BranchState, `city` AS BranchCity, `pin` AS BranchPin  FROM `branchs` WHERE `enterprise_id`="+organizationId+"",{ type: Sequelize.QueryTypes.SELECT });
                res.status(200).send({ success: true,data: searchBranch}); //Return json with data or empty
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
/************************* Remove User To Organization Ends *******************************/
/************************* Add User To Organization Start *******************************/
exports.getTotalorgCount = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            var totalCount = await sequelize.query("SELECT count(`id`) AS totalCount FROM `enterprises`",{ type: Sequelize.QueryTypes.SELECT });
            res.status(200).send({ success: true,data: totalCount}); //Return json with data or empty
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Remove User To Organization Ends *******************************/