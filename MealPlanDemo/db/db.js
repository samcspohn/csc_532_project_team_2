var settings = require('./setting');   //引入express模块
var mysql = require('mysql');     //引入mysql模块

 
var pool = mysql.createPool({      //创建mysql实例
    host: settings.host,
    port: settings.port,
    user: settings.user,
    password: settings.password,
    database: settings.database
});

function query(sql, callback) {
    pool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(sql, function (err, rows) {
            callback(err, rows);
            connection.release();
        });
    });
}
module.exports={
    query:query
}