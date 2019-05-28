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



//#
//app.use('/board',board);
//#
//hbs.registerPartials(__dirname + '/views/modal');

app.use(session({
         keys : 'user_sid',
	 secret : 'asdfasdfasdf',
	 resave : false,
	 saveUninitialized : false,
         cookie: {                 
		maxAge : 1000*60*60
         }
 }));

/*

models.sequelize.sync()
    .then(function() {
    console.log('✓ DB connection success.');
      console.log('  Press CTRL-C to stop\n');
  })
  .catch(function(err) {
    console.error(err);
    console.log('✗ DB connection error. Please make sure DB is running.');
    process.exit();
  });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//dir path
app.use(express.static(__dirname));
 
//get
app.use('/', indexRouter);
 
app.use(function(req, res, next) {
  next(createError(404));
});
*/

/*

//미들웨어 설정
app.use(morgan('short')) //로그 미들웨어
app.use(express.static('./public')) //기본 파일 폴더 위치 설정
app.use(bodyParser.urlencoded({extended:false}))
//라우트로 분리시켜주기
var userRouter = require('./routes/user.js')


var productRouter = require('./routes/product.js')
app.use('/suggestions/usr',userRouter)
app.use('/suggestions/board',productRouter)


*/






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
