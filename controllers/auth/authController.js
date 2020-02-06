var models = require('../../models');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');


exports.signinview = function(req, res, next){
	res.render('login/index',{ csrfToken: req.csrfToken() ,errors: req.flash('errors'),loginerrors:'',messages: req.flash('message'),lmessages: req.flash('lmessage')});
}

exports.signin = function(req, res, next) {
	//req.checkBody('username', 'Valid email address required').isEmail();
	//req.checkBody('password', 'Password Required').notEmpty();
	req.getValidationResult().then(function(result){ 
		// console.log(result);
		// return res.send("error");
       if(!result.isEmpty()){
		  // console.log(result);
		   var errors = result.array().map(function (elem) {
                return elem.msg;
            });
		   req.flash('errors',errors);
		   return res.redirect('/auth/signin#signin');
		   //res.redirect('back');
		}else{
			existingEmail = models.admins.findOne({ where: {username:req.body.username} });
			existingEmail.then(function (value) {	
				console.log(value)
				if(value){ 
	 				passport.authenticate('local', { successRedirect: '/',failureRedirect: '/signin'}, function(err, user, info) {
						console.log(err)
						console.log(user)
						console.log(info)
						if(user==false) {
							return res.render('login/index', {
								title: 'Sign In', 
								// loginerrors:'Your password is incorrect',
								loginerrors:'Invalid username and password!',
								messages:'',errors:'',
								lmessages:''
							});
						}												
						if(err) {
							return res.render('login/index', {
								title: 'Sign In', 
								loginerrors: 'Sorry Something Wrong.',
								messages:'',errors:'',
								lmessages:''});
						} 	
						return req.logIn(user, function(err) {
							if(err) {
								console.log("err2")
								console.log(err)
								return res.render('login/index', {
									title: 'Sign In', 
									loginerrors: 'Check User Id And Password.',
									messages:'',errors:'',
									lmessages:''});
							} else {
								req.session.userDetails =user;
								console.log(user);
								console.log("Testing");
								return res.redirect('/admin/dashboard');
								//return res.send('/come');
							}
						});
					})(req, res, next);

				}else{
					// req.flash('errors','Username does not exist!');
					req.flash('errors','Invalid username and password!');
					return res.redirect('/auth/signin#signin');
				}				
			});
   		}		
	});
};


   
   
exports.signup = function(req, res, next) {
	var user = req.body;
	var users = null;

	//console.log(req.body);
	//return res.send(req.body);
	//return res.send("ok");
	req.checkBody('fullname', 'Full Name  Required').notEmpty();
	req.checkBody('username', 'Username  Required').notEmpty();
	req.checkBody('email', 'Email Id Required').isEmail();
	req.checkBody('phone', 'Phone No Required').notEmpty();
	req.checkBody('password', 'Password Required').notEmpty();

// 	req.checkBody(  
//   "leader_mobile_no", 
//   "Enter a valid UK phone number.").isMobilePhone("en-GB");

	req.getValidationResult().then(function(result){ 
		 console.log(result);
		// return res.send("error");
       if(!result.isEmpty()){
		   console.log(result);
		   var errors = result.array().map(function (elem) {
                return elem.msg;
            });
		   req.flash('errors',errors);
		   return res.redirect('/auth/signin#signup');
		   //res.redirect('back');
		}else{


				var password = user.password;
				var hash = bcrypt.hashSync(password);
				var duplicate = null;
				duplicate = models.users.findOne({ where: {username:user.username} });
				duplicate.then(function (duplicate) {
				if(duplicate){
					req.flash('errors','Username Already Exists');  
					return res.redirect('/auth/signin#signup');
				}else{

					models.users.create({ 
						fullname: user.fullname, 
						//lastName: user.lastName, 
						username: user.username, 
						email:user.email,
						password: hash,
						phone:user.user_mobile,
						
					}).then(function(users) {	
						req.flash('lmessage','User Successfully Created');  					
							return res.redirect('/auth/signin');
								
					
					})
					.catch(function(error) {
							return res.send(error);
					
					}); 
				}
			}); 	
		}
	
	});
	
};
