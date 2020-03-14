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
const http = require('http');
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
/************************* candidate category list api start *******************************/
exports.generateReport = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            const { organizationId, fromDate, toDate, type } = req.body;
            var mobileVali = validation.generateReport(req.body);
            if(mobileVali.passes()===true){
                var organization_Id = (organizationId !='' ) ? " AND `e`.`id`="+organizationId : "";
                var reports = await sequelize.query("SELECT `t`.`tracking_id` AS trackingId, `e`.`id` AS organizationId, `e`.`organisation_name` AS OrganizationName, `e`.`address` AS OrganizationAddress, `e`.`email` AS OrganizationEmail, `e`.`contact_primary_name` AS OrganizationContact, `e`.`primary_contact_no` AS OrganizationMobile, `b`.`id` AS BranchId, `b`.`name` AS BranchName, `b`.`contact_name` AS BranchContactName, `b`.`contact_number` AS BranchContactNumber, `t`.`from_location` AS `Form`, `t`.`to_location` AS `To`, `t`.`start_date` AS StartDate, `t`.`tracking_count` AS trackingCount, `t`.`max_tracking_count` AS maxTrackingCount, `t`.`tracked_mobile_number` AS currentTrackingNumber, `t`.`tracked_mobile_mumbers` AS trackkedMobileNumbers, `t`.`other_mobile_number` AS otherMobileNumber, `t`.`other_location` AS otherLocation, `t`.`driver_name` AS driverName, `t`.`vehicle_number` AS vehicleNumber, `t`.`time_stamp`, `t`.`latitude`, `t`.`longitude`, `t`.`comment`, `t`.`status` AS status, if(`t`.`active_status`='active', 'true', 'false') AS active, `t`.`city`, `t`.`state` FROM `tracking_details` AS t LEFT JOIN `tracking_mappers` AS tm ON `tm`.`tracking_id`=`t`.`tracking_id` LEFT JOIN `branchs` AS b ON `b`.`id`=`tm`.`branch_id` LEFT JOIN `enterprises` AS e ON `e`.`id`=`b`.`enterprise_id` WHERE DATE(`t`.`created_at`) >= '"+fromDate+"' AND DATE(`t`.`created_at`) <= '"+toDate+"'"+organization_Id+"",{ type: Sequelize.QueryTypes.SELECT });
                if(reports.length > 0){
                    var data='';
                    if(type=='bulk'){
                        data +='trackingId\torganizationId\tOrganizationName\tOrganizationAddress\tOrganizationEmail\tOrganizationContact\tOrganizationMobile\tBranchId\tBranchName\tBranchContactName\tBranchContactNumber\tForm\tTo\tStartDate\tTrackingCount\tMaxTrackingCount\tCurrentTrackingNumber\tTrackkedMobileNumbers\tOtherMobileNumber\tOtherLocation\tDriverName\tVehicleNumber\tTimeStamp\tLatitude\tLongitude\tStatus\tActive\n';
                        for (var i = 0; i < reports.length; i++) {
                            data += reports[i].trackingId+'\t'+reports[i].organizationId+'\t'+reports[i].OrganizationName+'\t'+reports[i].OrganizationAddress+'\t'+reports[i].OrganizationEmail+'\t'+reports[i].OrganizationContact+'\t'+reports[i].OrganizationMobile+'\t'+reports[i].BranchId+'\t'+reports[i].BranchName+'\t'+reports[i].BranchContactName+'\t'+reports[i].BranchContactNumber+'\t'+reports[i].Form+'\t'+reports[i].To+'\t'+reports[i].StartDate+'\t'+reports[i].trackingCount+'\t'+reports[i].maxTrackingCount+'\t'+reports[i].currentTrackingNumber+'\t'+reports[i].trackkedMobileNumbers+'\t'+reports[i].otherMobileNumber+'\t'+reports[i].otherLocation+'\t'+reports[i].driverName+'\t'+reports[i].vehicleNumber+'\t'+reports[i].time_stamp+'\t'+reports[i].latitude+'\t'+reports[i].longitude+'\t'+reports[i].status+'\t'+reports[i].active+'\n';
                        }
                        var dateTime = new Date();
                        var nameDateTime = dateTime.getDate()+'-'+dateTime.getMonth()+'-'+dateTime.getFullYear()+'_'+dateTime.getTime();
                        fs.writeFile('./public/reports/'+'trackingList_'+nameDateTime+'.xls', data, (err) => {
                            if (err) throw err;
                            res.status(200).json({ success: true,data: req.app.locals.baseurl+'download-file/trackingList_'+nameDateTime+'.xls'});// Return json with error massage
                        });
                    } else {
                        data +='VehicleNumber\tTransporterName\tForm\tTo\tDate\tcurrentLocation\n';
                        for (var i = 0; i < reports.length; i++) {
                            let cityT = reports[i].city;
                            let citys = cityT.split(',');
                            let stateT = reports[i].state;
                            let states = stateT.split(',');
                            let currentLocation = citys[citys.length-1]+'-'+states[states.length-1];
                            data += reports[i].vehicleNumber+'\t'+reports[i].OrganizationName+'\t'+reports[i].Form+'\t'+reports[i].To+'\t'+reports[i].StartDate+'\t'+currentLocation+'\n';
                        }
                        var dateTime = new Date();
                        var nameDateTime = dateTime.getDate()+'-'+dateTime.getMonth()+'-'+dateTime.getFullYear()+'_'+dateTime.getTime();
                        fs.writeFile('./public/reports/'+'trackingListMis_'+nameDateTime+'.xls', data, (err) => {
                            if (err) throw err;
                            res.status(200).json({ success: true,data: req.app.locals.baseurl+'download-file/trackingListMis_'+nameDateTime+'.xls'});// Return json with error massage
                        });
                    }
                } else {
                    res.status(200).json({ success: true,data: 'Not found data'});
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
/************************* candidate category list api ends *******************************/