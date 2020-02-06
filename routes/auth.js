var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth/authController');
var models = require('../models');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var expressValidator    = require('express-validator');

var app 				= express();


var expressValidator = require('express-validator');
router.use(expressValidator());

router.get('/',function(req, res) {
  res.send('respond with a resource');
});


function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //if user is looged in, req.isAuthenticated() will return true 
        next();
    } else{
        res.redirect("/auth/signin");
    }
}


function checkAuthifLogin(req,res,next){
    if(!req.isAuthenticated()){
        //if user is looged in, req.isAuthenticated() will return true 
        next();
    } else{
        res.redirect("/admin/dashboard");
    }
}


router.get('/signin',csrfProtection,checkAuthifLogin,authController.signinview);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/auth/signin');
});


router.post('/signin', authController.signin);
router.post('/signup', authController.signup);

router.get('/home',checkAuthentication, function(req, res, next) {

  res.render('home/dashboard') 
});
/*router.get('/users', function(req, res, next) {
  res.render('user/list') 
});*/



module.exports = router;
