var express = require('express');
var router = express.Router();

var mysql_dbc = require('../commons/db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection, 'food');
var bcrypt = require('bcrypt');
var secret_config = require('../commons/secret');


/* GET users listing. */
router.get('/', function(req, res, next) {
	
	var sql = 'SELECT * FROM restaurant';

	connection.query(sql, function(err, result){
		if(err){
			throw err;
		}else{
			console.log("foods / sql get success");
			console.log(result);
			res.render('food', {
				shop : result,
				user : req.session.user,
				email : req.session.email,
				domain : req.session.domain
			});
		}
	});	
});

router.get('/view', function(req, res, next){

		const getId = req.query.id;
		console.log("food get id success");

		var sql = 'SELECT name, info, youtube, moreinfo FROM restaurant WHERE id=? ;' ; 

		var obj = new Object();
		connection.query(sql, getId , function(err, results){

				if(err || !results.length){
					res.status(500).render('error', { message : "존재하지 않는 정보 입니다."});
					return;
				}

				obj.user = req.session.user;
				obj.email = req.session.email;
				obj.domain = req.session.domain;
				obj.foodName = results[0].name;
				obj.foodInfo = results[0].info;
				obj.foodYoutube = results[0].youtube;
				obj.foodMoreInfo = results[0].moreinfo;

				var sql = 'SELECT latitude, longitude FROM location WHERE id=? ;';

				connection.query(sql, getId, function(err, results1){


						if(err || !results.length){
						res.status(500).render('error', { error : err, id : getId});
						}

						obj.foodLatitude = results1[0].latitude;
						obj.foodLongitude = results1[0].longitude;

						var sql = 'SELECT image, menu_name, info, price FROM menu WHERE id=? ;';	 	
						connection.query(sql, getId, function(err, results2){

								if(err || !results.length){
								res.status(500).render('error', { error : err, id : getId});
								}

								obj.Menu = results2;
								console.log(obj);
								res.render('foodInfo', obj);
								});

				});
				//비동기적 말고 동기적 방식 찾아서 적용해 볼 것 
				//waterfall or promise 방식
		});

});	

router.get('/api', function(req, res, next){

		var getName = req.query.name;
                var getId = req.query.id;
                console.log("food get api ID success");
		//console.log(req.query.test);
		var obj = new Object();
		if(getName){
			var sql = 'SELECT id FROM restaurant WHERE name=?;';
			connection.query(sql,getName, function(err, results){
				if(err || !results.length){
					obj.infoGet ="fail find name";
					obj.category="restaurant";
					res.send(obj);
					return;	
				}
				
				getId = results[0].id;

			              var sql = 'SELECT name, info, youtube, moreinfo FROM restaurant WHERE id=? ;' ;

                connection.query(sql, getId , function(err, results){
                                console.log(getId);
                                obj.infoGet = "success";
                                obj.category = "restaurant";
                                if(err || !results.length){
                                        obj.infoGet ="fail";
                                        res.send(obj);
                                        return;
                                }

                                obj.Name = results[0].name;
                                obj.Info = results[0].info;
                                obj.Youtube = results[0].youtube;
                                obj.MoreInfo = results[0].moreinfo;

                                var sql = 'SELECT latitude, longitude FROM location WHERE id=? ;';

                                connection.query(sql, getId, function(err, results1){


                                                if(err || !results1.length){
                                                        obj.infoGet="location fail";
                                                        res.send(obj);
                                                        return;
                                                }

                                                obj.foodLatitude = results1[0].latitude;
                                                obj.foodLongitude = results1[0].longitude;

                                                var sql = 'SELECT image, menu_name, info, price FROM menu WHERE id=? ;';
                                                connection.query(sql, getId, function(err, results2){

                                                                if(err || !results2.length){
                                                                        obj.infoGet="Menu fail";
                                                                        res.send(obj);
                                                                        return;
                                                                }

                                                                obj.Menu = results2;
                                                                console.log(obj);
                                                                var jsonArray = JSON.parse(JSON.stringify(obj));
                                                                res.send(jsonArray);
                                                                });

                                });
                                //비동기적 말고 동기적 방식 찾아서 적용해 볼 것
                                //waterfall or promise 방식
                });

				
			});
		}
		else{
               	var sql = 'SELECT name, info, youtube, moreinfo FROM restaurant WHERE id=? ;' ;

                connection.query(sql, getId , function(err, results){
				console.log(getId);
				obj.infoGet = "success";
				obj.category = "restaurant";
                                if(err || !results.length){
					obj.infoGet ="fail";
                                	res.send(obj);
					return;
                                }
				
                                obj.Name = results[0].name;
                                obj.Info = results[0].info;
                                obj.Youtube = results[0].youtube;
                                obj.MoreInfo = results[0].moreinfo;

                                var sql = 'SELECT latitude, longitude FROM location WHERE id=? ;';

                                connection.query(sql, getId, function(err, results1){


                                                if(err || !results1.length){
							obj.infoGet="location fail";
                                                	res.send(obj);
							return;
                                                }

                                                obj.foodLatitude = results1[0].latitude;
                                                obj.foodLongitude = results1[0].longitude;

                                                var sql = 'SELECT image, menu_name, info, price FROM menu WHERE id=? ;';
                                                connection.query(sql, getId, function(err, results2){

                                                                if(err || !results2.length){
                                                                	obj.infoGet="Menu fail";
									res.send(obj);
									return;
                                                                }

                                                                obj.Menu = results2;
                                                                console.log(obj);
								var jsonArray = JSON.parse(JSON.stringify(obj));
                                                                res.send(jsonArray);
                                                                });

                                });
                                //비동기적 말고 동기적 방식 찾아서 적용해 볼 것
                                //waterfall or promise 방식
                });
		}

});


module.exports = router;
