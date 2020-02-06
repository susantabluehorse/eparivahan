var models = require('../../models');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var multiparty = require('multiparty'); 
var bodyParser = require('body-parser');
var config = require('../../config/config');
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
        }
});





exports.adminsList = function(req, res, next){
	
	AdminList = models.admins.findAll({order: [['admin_id', 'DESC']] });  
    AdminList.then(function (value) {
		console.log(value);
		return res.render('admin/admins/list', 
        {
            title:"Admin List",
            arrData: value,
            messages: req.flash('info'),
        });
    });
}


exports.addeditPageLoad = function(req, res, next){	
    var id = req.params.id;
    var editpageLoad = null;
    if(!id){	
        //res.status(200).send({ 
        return res.render('admin/admins/addedit', {
            title:"Add Admin",
            arrData:'',
            messages: req.flash('info'),  
        });
    }else{            
        editpageLoad = models.admins.findOne({ where: {admin_id:id} });
        editpageLoad.then(function (value) {	
            return res.render('admin/admins/addedit', { 
                title:"Edit Admin",               
                arrData: value,
                messages: req.flash('info'),                
            });
        });	
    }	
};


exports.add = function(req, res, next) {
   
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) { 
        var id = fields.update_id[0];

        if(!id){
            var password = fields.password ? fields.password[0]:'';
			var hash = bcrypt.hashSync(password);
            models.admins.create({ 
                username            : fields.username[0], 
                password            : hash,            
                name                : fields.name[0],
                email               : fields.email[0],
                alternate_email     : fields.alternate_email[0],
                mobile              : fields.mobile[0],
                alternate_mobile    : fields.alternate_mobile[0],                
                address             : fields.address[0],                
                status              : fields.status[0],

                }).then(function(user) {                    
                    req.flash('info','Successfully Created');
                    return res.redirect('back');
                })
        }else{
            models.admins.update({ 
                username            : fields.username[0], 
                password            : hash,            
                name                : fields.name[0],
                email               : fields.email[0],
                alternate_email     : fields.alternate_email[0],
                mobile              : fields.mobile[0],
                alternate_mobile    : fields.alternate_mobile[0],                
                address             : fields.address[0],                
                status              : fields.status[0],
				
            },{where:{admin_id:id}}).then(function(user) {
                req.flash('info','Successfully Updated');
                return res.redirect('back');
            })
        }
    });
}



exports.deleteAdmins = async function(req, res, next) {
    var id = req.params.id;
    deleteAdmin = await models.admins.destroy({where:{admin_id:id}});
        req.flash('info','Successfully Deleted');           
        return res.redirect('back'); 
}; 

