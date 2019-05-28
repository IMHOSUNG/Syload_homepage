var express = require('express');
var router = express.Router();
var mysql_dbc = require('../commons/db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection, 'snss');
var bcrypt = require('bcrypt');
var secret_config = require('../commons/secret');



/* GET users listing. */
router.get('/', function(req, res, next) {
	var sql = 'SELECT * FROM sns';

	connection.query(sql, function(err, result) {
		if(err) {
			throw err;
		} else {
			console.log("snss/sql get success");
			console.log(result);
			res.render('sns', {
				user : req.session.user,
				email : req.session.email,
				domain : req.session.domain
			 });
		}
	});
});

router.get('/:id', function(req, res, next) {
	const getId = req.params.id;
	console.log("sns get ID success");

	var sql = 'SELECT name, info, SNSaddress, moreinfo FROM sns WHERE id=?;';

	var obj = new Object();
	connection.query(sql, getId, function(err, results) {
		if(err || !results.length) {
			res.status(500).render('error', { error : err, id : getId });
		}
		
		obj.user = req.session.user;
		obj.email = req.session.email;
		obj.domain = req.session.domain;
		obj.snsName = results[0].name;
		obj.snsInfo = results[0].info;
		obj.snsSNSaddress = results[0].SNSaddress;
		obj.snsMoreInfo = results[0].moreinfo;
	});
});

module.exports = router;
