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
    const { organizationId, fromDate, toDate, type } = req.body;
    var mobileVali = validation.getTrackingCount(req.body);
    if(mobileVali.passes()===true){
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
        res.status(200).json({ success: mobileVali.passes(),data: mobileVali.errors.errors}); // Return json with error massage
    }    
}
/************************* candidate category list api ends *******************************/