 

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "advsoft.codryjh8aaby.us-west-2.rds.amazonaws.com",
  user: "devsoft",
  password: "Test2018",
  database: "mydb"
});

 
 user = "202";

con.connect(function(err) {
    if (err) throw err;
            con.query(`UPDATE mydb.TargetGoals 
SET 
    Calorie = 800
WHERE
    User_idUser = '202';`, function(err,result,fields){
    if (err) throw err;
});
});
