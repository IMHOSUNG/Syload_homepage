var express = require('express');
var router = express.Router();

var mysql_dbc = require('../commons/db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection, 'festivals');
var bcrypt = require('bcrypt');
var secret_config = require('../commons/secret');


/* GET users listing. */
router.get('/', function(req, res, next){
	
	var sql = 'SELECT * FROM festival';

	connection.query(sql,function(err, result){
		if(err){
			throw err;
		}else{
			console.log("festivals / sql get success");
			console.log(result);
			res.render('festival', {
				festival : result,
				user : req.session.user,
				email : req.session.email,
				domain : req.session.domain
			});
		}
	});
});

router.get('/:id', function(req, res, next){

	const getId = req.param.id;
	console.log("festival get ID success");

	var sql = 'SELECT name, info, youtube, moreinfo FROM festival where id=? ;' ;

	var obj = new Object();
	connection.query(sql, getId, function(err,results){

		if(err || !results.length){
			res.status().render('error', {error : err, id : getId});
		}

		obj.user = req.session.user;
		obj.email = req.session.email;
		obj.domain = req.session.domain;
		obj.festivalName = results[0].name;
		obj.festivalInfo = results[0].info;
		obj.festivalYoutube = results[0].youtube;
		obj.festivalMoreInfo = results[0].moreinfo;

		var sql = 'SELECT latitude, longitude FROM location WHERE id=? ;';
		
		connection.query(sql, getId, function(err, results1){

			if(err || !results.length){
				res.status(500).render('error', {error : err, id : getId});
			}

			obj.foodLatitude = result1[0].latitude;
			obj.foodLongitude = result1[0].longitude;

			var sql = 'SELECT image, menu_name, info, priice FROM menu WHERE id=? ;';

			connection.query(sql, getId, function(err,results2){
		
				if(err || !results.length){
					   res.status().render('error', {error : err, id : getId});
				}
				
					   obj.Menu = result2;
					   console.log(obj);
			 	  	   res.render('foodInfo', obj);
	       	   });

	     });


	});

});
		

module.exports = router;
