var express = require('express');
var router = express.Router();
var mysql_dbc = require('../commons/db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection, 'festivals');
var bcrypt = require('bcrypt');
var secret_config = require('../commons/secret');



/* GET users listing. */
router.get('/', function(req, res, next) {
   res.render('festival', { user : req.session.user });
});


module.exports = router;
