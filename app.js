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
var app 				     = express();
app.use(bodyParser({limit: '50MB'}));
app.set('port', process.env.PORT || 3304);
var server = app.listen(app.get('port'), function() {	
	models.sequelize.sync().then(() => {
   console.log('model load');
  }).catch(function (e) {
    throw new Error(e);
  });
	console.log('Express server listening on port ' + server.address().port);
});
var domain = 'http://localhost:'+server.address().port;
///variable declare
app.locals.adminbaseurl= domain +'/admin/';
app.locals.baseurl= domain +'/';
app.locals.logouturl=domain +'/';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
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
var routes = require('./routes/index');
var api = require('./routes/api');
app.use(cors());
app.use('/', routes);
app.use('/api/v1', api);
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
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  return res.render('errors/404.ejs', 
    { title: '404 - Page not found !',
	});
});
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