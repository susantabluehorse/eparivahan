var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth/authController');
var dashboardController = require('../controllers/admin/dashboardController');
var dashboardController = require('../controllers/admin/dashboardController');
var adminsController = require('../controllers/admin/adminsController');
var job_seekersController = require('../controllers/admin/job_seekersController');

var models = require('../models');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });




var app = express();
var url = require('url');

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //if user is looged in, req.isAuthenticated() will return true 
        next();
    } else{
        res.redirect("/auth/signin");
    }
}


var expressValidator = require('express-validator');
router.use(expressValidator())


router.get('/',function(req, res) {
    res.redirect('/admin/dashboard');
  //console.log(req.baseUrl, req.url);
      //res.end();
});

// app.locals.userfullname = "Mitrajit Samnata";
// app.locals.usercreatedBy = 1;

function middleHandler(req,res,next){
//     models.users.findOne({ where: {username: (req.session.passport.user)} }).then(function(user) {
//         if(user)
//         {
//             res.locals.userfullname = user.name;
//             res.locals.profilePicId = user.id;
//             res.locals.timezone = req.cookies.timezone;
            next();
//         }else{
//             // res.locals.userfullname = "Mitrajit Samnata";
//             // res.locals.usercreatedBy = 1;
//             //req.session.destroy();
//             //res.redirect("/auth/signin");
//             req.logout();
//             res.redirect('/auth/signin');
//         }
//     });
}






router.get('/dashboard',checkAuthentication,middleHandler,dashboardController.dashboard);

/////////////////admin Controller start////////////////////////////////
router.get('/admin-user',checkAuthentication,middleHandler,adminsController.adminsList);
router.get('/admin-user/addedit/:id?',checkAuthentication,middleHandler,adminsController.addeditPageLoad);
router.post('/admin-user/add',checkAuthentication,middleHandler,adminsController.add);
router.get('/admin-user/delete/:id?',checkAuthentication,middleHandler,adminsController.deleteAdmins);
/////////////////admin Controller start/////////////////////////////
////
/////////////////job_seekers Controller start////////////////////////////////
router.get('/job_seekers',checkAuthentication,middleHandler,job_seekersController.job_seekersList);
router.get('/job_seekers/addedit/:id?',checkAuthentication,middleHandler,job_seekersController.addeditPageLoad);
router.post('/job_seekers/add',checkAuthentication,middleHandler,job_seekersController.add);
router.get('/job_seekers/delete/:id?',checkAuthentication,middleHandler,job_seekersController.deletejob_seekers);
/////////////////job_seekers Controller start/////////////////////////////
///////






module.exports = router;
