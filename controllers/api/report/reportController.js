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

/************************* candidate category list api start *******************************/
exports.generateReport = async function(req, res, next) {
    var organization_Id = req.body.organizationId;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var type = req.body.type;
    if(fromDate !='' && type !='' && toDate !=''){
        var branchs = await sequelize.query("SELECT * FROM `branchs`",{ type: Sequelize.QueryTypes.SELECT });
        var data='';        
        data +='ID\tEnterpriseId\tName\tContactName\tContactEmail\tContactNumber\tAddress\tLatitude\tLongitude\tStatus\tCreatedAt\tUpdatedAt\n';        
        for (var i = 0; i < branchs.length; i++) {
            let status = (branchs[i].status==1) ? 'Active' : 'Inactive';
            data += branchs[i].id+'\t'+branchs[i].enterprise_id+'\t'+branchs[i].name+'\t'+branchs[i].contact_name+'\t'+branchs[i].contact_email+'\t'+branchs[i].contact_number+'\t'+branchs[i].address+'\t'+branchs[i].latitude+'\t'+branchs[i].longitude+'\t'+status+'\t'+branchs[i].created_at+'\t'+branchs[i].updated_at+'\n';
        }
        var dateTime = new Date();
        var nameDateTime = dateTime.getDate()+'-'+dateTime.getMonth()+'-'+dateTime.getFullYear()+'_'+dateTime.getTime();
        fs.writeFile('./public/reports/'+'branchsList_'+nameDateTime+'.xls', data, (err) => {
            if (err) throw err;            
            res.status(200).json({ success: "true",data: 'reports/branchsList_'+nameDateTime+'.xls'});// Return json with error massage
        });
    } else {
        res.status(200).json({ success: "false",data: "All fileds are required!"});// Return json with error massage
    }    
}
/************************* candidate category list api ends *******************************/