var express 			   = require('express');
var path 				     = require('path');
var favicon 			   = require('static-favicon');
var cookieParser 		 = require('cookie-parser');
var bodyParser 			 = require('body-parser');
var flash            = require('connect-flash');
var sess             = require('express-session');
var bcrypt 				   = require('bcrypt-nodejs');
var passport         = require('passport');
var LocalStrategy    = require('passport-local').Strategy;
var cors 				     = require('cors');
var expressValidator = require('express-validator');
var models 			     = require('./models'); 
var store 				   = require('session-memory-store')(sess);
var flash            = require('connect-flash');

///consol.log(config.host);
///passport
// passport.use(new LocalStrategy(function(username, password, done) {
//   models.admins.findOne({ where: {username:username,status:"active"} }).then(function(data) {
//     console.log(data+"jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
//     var user = data;
//     if(user === null) {
//       return done(null, false, {message: 'Invalid username or password'});
//     } else {
//       user = data.toJSON();
//       if(!bcrypt.compareSync(password,user.password)) {
//         console.log(bcrypt.compareSync(password, user.password));
//         return done(null, false, {message: 'Invalid  password'});
//       } else {
//         return done(null, user);
//       }
//     }
//   });
// }));

// passport.serializeUser(function(user, done) {
// 	console.log(user.username);
//   done(null, user.username);
// });

// passport.deserializeUser(function(username, done) {
//   models.admins.findOne({ where: {username:username} }).then(function(user) {
//     done(null, user);
//   });
// });

///Express session store and expiration

var app 				= express();
//app.locals.name_title = "Mitrajit Samanta";
//require('helper/frontend_helper_functions.js');
app.use(bodyParser({limit: '50MB'}))

//app.configure(function() {
  //app.use(express.cookieParser('keyboard cat'));
  //app.use(express.session({ cookie: { maxAge: 60000 }}));
 // app.use(flash());
//});

app.set('port', process.env.PORT || 3304);
var server = app.listen(app.get('port'), function() {	
	models.sequelize.sync().then(() => {
   console.log('model load');
  }).catch(function (e) {
    throw new Error(e);
  });
	console.log('Express server listening on port ' + server.address().port);
  //debug('Express server listening on port ' + server.address().port);
});


var domain = 'http://localhost:'+server.address().port;
///variable declare
app.locals.adminbaseurl= domain +'/admin/';
app.locals.baseurl= domain +'/';
//app.locals.baseurl= 'http://192.168.0.8:3302/';
app.locals.logouturl=domain +'/'; 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
// app.use(bodyParser.json({limit: '150mb'}));
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
// limit: '150mb',
// extended: true
// })); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//app.use(busboyBodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(flash());
app.use(sess({
  name: 'nodescratch',
  secret: 'MYSECRETISVERYSECRET',
  store:  new store({ expires: 60 * 60 * 1000, debug: true }),
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

///routes
var routes 				= require('./routes/index');
//var authentication 		= require('./routes/auth.js');
var api 				= require('./routes/api');
//var admin 				= require('./routes/admin');
app.use(cors());
app.use('/', routes);
app.use('/api/v1', api);
//app.use('/admin', admin);
//app.use('/auth', authentication);
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
/// error handlers
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         // res.render('error', {'/errors/404.ejs' });
//         return res.render('errors/404.ejs', 
//         { title: '404 - Page not found !',
// 		});
//     });
// }
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  return res.render('errors/404.ejs', 
    { title: '404 - Page not found !',
	});
});

// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'Options') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
    return res.status(200).json({});
  }
  next();    
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add this after the bodyParser middlewares!
module.exports = app;