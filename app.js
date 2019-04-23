var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var bootstrap = require('bootstrap');
//cookie and session and login 
var hbs = require('hbs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var mysql = require('mysql');

//route Info
var indexRouter = require('./routes/index');
var foodsRouter = require('./routes/foods');
var festivalsRouter = require('./routes/festivals');
var snssRouter = require('./routes/snss');
var suggestionsRouter = require('./routes/suggestions');
var toursRouter = require('./routes/tours');
var couponRouter = require('./routes/coupons');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + '/views/modal');

app.use(session({
         keys : 'user_sid',
	 secret : 'asdfasdfasdf',
	 resave : false,
	 saveUninitialized : false,
         cookie: {                 
		maxAge : 1000*60*60
         }
 }));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/foods', foodsRouter);
app.use('/festivals', festivalsRouter);
app.use('/snss',snssRouter);
app.use('/suggestions',suggestionsRouter);
app.use('/tours',toursRouter);
app.use('/coupons',couponRouter);

/*
app.get('/', function(req,res){res.render('index',{ title : req.user});

app.get('/login', function(req, res) {res.render('login',{title : req.user});
// Setting the naver oauth routes
app.get('/auth/naver', 
	passport.authenticate('naver', null), function(req, res) {
    	console.log('/auth/naver failed, stopped');
    });

// creates an account if no account of the new user
app.get('/auth/login/naver/callback', 
	passport.authenticate('naver', {
        failureRedirect: '#!/auth/login'
    }), function(req, res) {
    	res.redirect('/'); 
    });
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.local.user = req.session.user;
  next(createError(404));
});

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'test',
	password : '1013@!Aa',
	port : 3306,
	database : 'syload'

});

connection.connect( function(err){

	if(err){
	
		console.error('mysql connection error');
		console.error(err);
		throw err;
	}else{
	
		console.log("success connect");
	}
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
