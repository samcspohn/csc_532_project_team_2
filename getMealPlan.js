 

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
    BaseMeal.BaseMeal_name
FROM
    BaseMeal
        LEFT JOIN
    MealContent ON MealContent.BaseMeal_idBaseMeal = BaseMeal.idBaseMeal
        LEFT JOIN
    DailyMeals ON DailyMeals.idDailyMeals = MealContent.DailyMeals_idDailyMeals
        LEFT JOIN
    WeeklyMeals ON WeeklyMeals.idWeeklyMeals = DailyMeals.WeeklyMeals_idWeeklyMeals
        LEFT JOIN
    MealSchedule ON MealSchedule.idMealSchedule = WeeklyMeals.MealSchedule_idMealSchedule
        LEFT JOIN
    Users ON Users.idUser = MealSchedule.Users_idUser
WHERE
    idUser = 202
ORDER BY idDailyMeals , meal_type;`, function(err,result,fields){
    for(var i = 0; i < result.length; i += 3){
        console.log("day " + (i / 3 + 1));
        console.log("breakfast: " + result[i]['BaseMeal_name']);
        console.log("lunch: " + result[i + 1]['BaseMeal_name']);
        console.log("dinner: " + result[i + 2]['BaseMeal_name']);
    }
    
});
});
