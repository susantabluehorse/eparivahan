var models = require('../../../models');
var jwt = require('jsonwebtoken');
var SECRET = 'nodescratch';
var fs = require('file-system');
var bcrypt = require('bcrypt-nodejs');
var config = require('../../../config/config.json');
var Sequelize = require("sequelize");
var json2csv = require('json2csv');
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
/************************* candidate category list api start *******************************/
exports.generateReport = async function(req, res, next) {
    var organization_Id = req.body.organizationId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var type = req.body.type;
    if(fromDate !='' && type !='' && toDate !=''){
        var branchs = await sequelize.query("SELECT * FROM `branchs`",{ type: Sequelize.QueryTypes.SELECT });
        var fields = ['id', 'enterprise_id', 'name', 'contact_name', 'contact_email', 'contact_number', 'address', 'latitude', 'longitude', 'status', 'created_at', 'updated_at'];
        var fieldNames = ['ID', 'EnterpriseId', 'Name', 'ContactName', 'ContactEmail', 'ContactNumber', 'Address', 'Latitude', 'Longitude', 'Status', 'CreatedAt', 'UpdatedAt'];
        var data = json2csv({ data: branchs, fields: fields, fieldNames: fieldNames });
        res.attachment('branchs.csv');
        res.status(200).send('');
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }    
}
/************************* candidate category list api ends *******************************/


