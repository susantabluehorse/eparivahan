var models = require('../../models');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var multiparty = require('multiparty'); 
var bodyParser = require('body-parser');
var config = require('../../config/config');
var helper = require('../../helpers/frontend_helper_functions');
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


exports.job_seekersList = function(req, res, next){
	
	AdminList = models.job_seekers.findAll({order: [['job_seeker_id', 'DESC']] });  
    AdminList.then(function (value) {
		return res.render('admin/job_seekers/list', 
        {
            title:"Job Seeker List",
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
        return res.render('admin/job_seekers/addedit', {
            title:"Add Job Seekers",
            arrData:'',
            helper :helper,
            messages: req.flash('info'),  
        });
    }else{            
        editpageLoad = models.job_seekers.findOne({ where: {job_seeker_id:id} });
        editpageLoad.then(function (value) {	
            return res.render('admin/job_seekers/addedit', { 
                title:"Edit Job Seekers",               
                arrData: value,
                helper :helper,
                messages: req.flash('info'),                
            });
        });	
    }	
};

exports.add = function(req, res, next) {

    var d = new Date();
    var n = d.getTime();  
   
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) { 
        var id = fields.update_id[0];

        if(!id){
            var password = fields.password ? fields.password[0]:'';
			var hash = bcrypt.hashSync(password);
            models.job_seekers.create({ 
                username            : fields.username[0], 
                password            : hash,
                last_login_at       : d,
                status              : fields.status[0],

                }).then(function(job) { 

                    var folder_name = job.job_seeker_id;
                    const path = 'job_seekers/' + folder_name + '/';
                    helper.createDirectory(path);
                    console.log("Folder directory"+path);

                    if(files.profile_picture[0].originalFilename != '') {
                        var temp_path = files.profile_picture[0].path;
                        //var file_name = files.file_pan[0].originalFilename;
                        var target_path = path + "profile_picture.jpg";
                        helper.uploadFile(temp_path, target_path);
                    }                 
                    req.flash('info','Successfully Created');
                    return res.redirect('back');
                })
        }else{
            models.job_seekers.update({ 
                username            : fields.username[0], 
                password            : hash,
                last_login_at       : d,
                status              : fields.status[0],
				
            },{where:{job_seeker_id:id}}).then(function(user) {
                req.flash('info','Successfully Updated');
                return res.redirect('back');
            })
        }
    });
}

exports.deletejob_seekers = async function(req, res, next) {
    var id = req.params.id;
    deleteAdmin = await models.job_seekers.destroy({where:{job_seeker_id:id}});
        req.flash('info','Successfully Deleted');           
        return res.redirect('back'); 
}; 