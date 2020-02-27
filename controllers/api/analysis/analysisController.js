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
/************************* Change Tracking Status start *******************************/
exports.getChangeTrackingStatus = async function(req, res, next) {
    const { access_token } = req.headers;
    var header = validation.accessToken(req.headers);
    if(header.passes()===true){
        var accessToken =await sequelize.query("SELECT `id`,`remember_token` FROM `users` WHERE `remember_token`='"+access_token+"'",{ type: Sequelize.QueryTypes.SELECT });
        if(accessToken.length > 0){
            var trackingId = req.body.trackingId;
            var status = req.body.status;
            if(trackingId !='' && status !=''){
                var ChangeTrackingStatus =await sequelize.query("UPDATE `tracking_details` SET `status`='"+status+"' WHERE `tracking_id`="+trackingId+"",{ type: Sequelize.QueryTypes.UPDATE });
                res.status(200).json({data:{success: true,"data":"success"}}); //Return json with data or empty
            } else {
                res.status(200).json({ success: false,data: "All fileds are required!"});// Return json with error massage
            }
        } else {
            res.status(200).json({ success: false,data: 'You dont have permission to access'});// Return json with error massage
        }
    } else {
        res.status(200).json({ success: header.passes(),data: header.errors.errors});// Return json with error massage
    }
}
/************************* Change Tracking Status ends *******************************/