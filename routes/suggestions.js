var express = require('express');
var router = express.Router();
var mysql_dbc = require('../commons/db_con')();
var connection = mysql_dbc.init();
//mysql_dbc 자체가 db 다 연동 시켜둔 겁니다~
mysql_dbc.test_open(connection, 'suggestion');


var bcrypt = require('bcrypt');
var secret_config = require('../commons/secret');
/* GET users listing. */

var isAuthenticated = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
};

router.get('/', function(req, res, next) {

   //console.log(req.session.user);
   res.redirect('/suggestions/list/'+1); 

});

router.get('/list/:cur', function(req,res, next) {

  res.render ('suggestion', {
 		user : req.session.user,
		domain : req.session.domain,
		email : req.session.email 
  });  
});

router.get("/delete/:id",isAuthenticated, function (req,res,next) {

	res.render('suggestDelete', {
		user : req.session.user,
		domain : req.session.domain,
		email : req.session.email
	});
});

router.get('/insert', isAuthenticated ,function(req,res,next){
	
   fs.readFile('insert.html', 'utf-8', function (error, data) {
   res.send(data)
   })




  res.render('suggestInsert', {
	user : req.session.user,
	domain : req.session.domain,
	email : req.session.email
  });

});

router.post('/insert',function(req,res,next){
	// insert 에서 포스트 정보가 넘어오면 처리할 함수 
	// db에 넣는 쿼리문이 들어갈 ??

	

});

router.get("/edit/:id", isAuthenticated ,function(req,res,next){

	res.render('suggestEdit', {
	
		user : req.session.user,
		domain : req.session.domain,
		email : req.session.email
	});

});

router.get("/detail/:id", function(req,res,next){

	res.render('suggestDetail', {
		user : req.session.user,
		domain : req.session.domain,
		email : req.session.email
	});
});



module.exports = router;
