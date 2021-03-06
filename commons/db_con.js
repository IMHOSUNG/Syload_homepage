var mysql = require('mysql');
var config = require('../commons/secret').db_info.local;

module.exports = function () {
  return {
    init: function () {
      return mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
	multipleStatements : true
      })
    },

    test_open: function (con, name) {
      con.connect(function (err) {
        if (err) {
          console.error('mysql connection error :' + err);
        } else {
          console.info(name + ' mysql is connected successfully.');
        }
      })
    }
  }
};
