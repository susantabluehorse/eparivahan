const express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var formidable = require('formidable');
var multiparty = require('multiparty'); 
var bodyParser = require('body-parser');


// var router = express.Router();

exports.dashboard = function(req, res, next){
    //return res.send('42');
//router.get('/',(req,res)=>{
    console.log(req.session);
    //if(req.session && req.session.user){   
    return res.render('admin/home/dashboard',{
        title: 'Dashboard',
        arrData: '',
        arrChat: '',
        arrUser: '',
        messages: req.flash('message'),
        errors: req.flash('errors')	
    });
//}else{
    //return res.redirect('/');
//}

//});
}

// router.get('/',(req,res)=>{
//     res.render("home/dashboard",{
//            });
//         });

// module.exports = router;//