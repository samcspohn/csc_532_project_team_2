 
 

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
    con.query(`SELECT 
    SUM(mydb.FoodNutrition.total_calories)
FROM
    mydb.FoodLog
        LEFT JOIN
    FoodNutrition ON FoodNutrition_IDFoodNutrition = IDFoodNutrition
WHERE
    Time_Stamp < TIMESTAMP('2018-11-09', '01:01:01')
        AND Time_Stamp > TIMESTAMP('2018-11-07', '01:01:01');`, function(err,result,fields){
        if (err) throw err;
        console.log(result);
        calsEaten = result[0]['SUM(mydb.FoodNutrition.total_calories)'];
        con.query(`SELECT Calories_Burned FROM DailyNumbers where Users_idUser = 202`, function(err,result,fields){
        if (err) throw err;
            calsBurned = result[0]['Calories_Burned'];
            console.log("calories eaten:" + calsEaten);
            console.log("calories burned:" + calsBurned);
            if( calsBurned - calsEaten < 0)
                console.log(" you need to burn " + (calsEaten - calsBurned) + " more calories");
            else
                console.log(" you need to eat " + (calsEaten - calsBurned) + " more calories");
        });
        
});
});
