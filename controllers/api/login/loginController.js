var models = require('../../../models');
var jwt = require('jsonwebtoken');
var SECRET = 'nodescratch';
var fs = require('file-system');
var bcrypt = require('bcrypt-nodejs');
var config = require('../../../config/config.json');
var Sequelize = require("sequelize");
const https = require('https');
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

/************************* Login start *******************************/
exports.getLogin = async function(req, res, next) {
    var mobile = req.body.mobile;
    if(mobile!=''){
        var userDetails =await sequelize.query("SELECT `id`,`user_type`,`status`,`created_by` FROM `users` WHERE `mobile`='"+mobile+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(userDetails.length > 0) { //query result length check
            if(userDetails[0].user_type=='consignee' && userDetails[0].status=='active' ){
                var otp = Math.floor(100000 + Math.random() * 900000);
                https.get("https://app.indiasms.com/sendsms/bulksms.php?username=saktip&password=anmol123&type=TEXT&sender=EPVHAN&mobile="+mobile+"&message="+otp+"", (resp) => {}).on("error", (err) => {});
                var userOtp = await sequelize.query("INSERT INTO `user_otp`(`user_id`, `user_otp`, `created_by`, `status`) VALUES ("+userDetails[0].id+", "+otp+","+userDetails[0].created_by+",'active')",{ type: Sequelize.QueryTypes.INSERT });                
                res.status(200).json({ success: "true", data:"true" }); //Return json with data or empty
            } else {
                res.status(200).json({ success: "false", data:"User not active and consignee" }); //Return json with data or empty
            }
        } else {
            res.status(200).json({ success: "false",data: "User not find" }); //Return json with data or empty
        }
    }else{
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Login ends *******************************/

/************************* Verify Otp start *******************************/
exports.getLoginVerifyOtp = async function(req, res, next) {
    var otp = req.body.otp;
    var userId = req.body.userId;
    if(userId!='' && otp!=''){
        var otpDetails =await sequelize.query("SELECT `id` FROM `user_otp` WHERE `user_id`="+userId+" AND `status`='active' AND `user_otp`="+otp+"",{ type: Sequelize.QueryTypes.SELECT });
        if(otpDetails.length > 0) { //query result length check
            var otpDetails =await sequelize.query("UPDATE `user_otp` SET `status`='inactive' WHERE `id`="+otpDetails[0].id+"",{ type: Sequelize.QueryTypes.UPDATE });
            res.status(200).json({ success: "false", data:otpDetails}); //Return json with data or empty
        } else {
            res.status(200).json({ success: "false",data: "Please enter right otp"});// Return json with error massage
        }
    }else{
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }
}
/************************* Verify Otp ends *******************************/