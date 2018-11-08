 
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "advsoft.codryjh8aaby.us-west-2.rds.amazonaws.com",
  user: "devsoft",
  password: "Test2018",
  database: "mydb"
});

/*
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
*/

function getMeal(target, mealsToChoosFrom, mealsToSkip){
    var m = ""
    var count = 0;
    var closest = 0;
    var closestVal = Math.abs(mealsToChoosFrom[count][1] - calPerMeal);
    for(var i = 0; i < mealsToChoosFrom.length; i++, ++count % mealsToChoosFrom.length){
        if(Math.abs(mealsToChoosFrom[count][1] - calPerMeal) < closestVal){
            closest = count;
            closestVal = Math.abs(mealsToChoosFrom[count][1] - calPerMeal);
        }
    }
    m = mealsToChoosFrom[closest];
    mealsToSkip.push([m[0],m[1],m[2], 0]);
    mealsToChoosFrom.splice(closest,1);
    console.log(m[0]);
    return m;
} 

function checkMealsUsed(mealsToChoosFrom, mealsToSkip){
    for(i = mealsToSkip.length - 1; i >= 0; i--){
        if(mealsToSkip[i][3] >= 1){
            mealsToChoosFrom.push([mealsToSkip[i][0],mealsToSkip[i][1],mealsToSkip[i][2]]);
            mealsToSkip.splice(i,1);
        }
        else
            mealsToSkip[i][3]++;
    }
}


user = "202";

con.connect(function(err) {
    if (err) throw err;
            
    console.log("here");
    //get goal
    con.query("select mydb.TargetGoals.Calorie from mydb.TargetGoals where mydb.TargetGoals.User_idUser = " + user + ";", function (err, result, fields) {
    var target = result[0]['Calorie']; // get from database
    console.log(target)
        con.query("SELECT BaseMeal.BaseMeal_name,BaseMeal.idBaseMeal, SUM(FoodNutrition.total_calories) FROM BaseMeal LEFT JOIN BaseIngredent ON BaseIngredent.BaseMeal_idBaseMeal = BaseMeal.idBaseMeal LEFT JOIN FoodNutrition ON FoodNutrition.IDFoodNutrition = BaseIngredent.FoodNutrition_IDFoodNutrition GROUP BY BaseMeal.BaseMeal_name;", function (err, result, fields) {
            var meals = [];
            var mealsUsed = [];
            if (err) throw err;
            for(var i = 0; i < result.length; i++){
                //console.log(result[i]['BaseMeal_name'] + " : " + result[i]['SUM(FoodNutrition.total_calories)']);
                meals.push([result[i]['BaseMeal_name'], result[i]['SUM(FoodNutrition.total_calories)'], result[i]['idBaseMeal']]);
            }
            console.log(meals);
            
    
            weeklyMeals = []
            
            for(var i = 0; i < 7; i++){
                dailyMeals = []
                
                dailyTarget = target;
                // get breakfast

                calPerMeal = dailyTarget / 3;
                breakfast = getMeal(calPerMeal, meals, mealsUsed);
                console.log(breakfast);
                dailyMeals.push(breakfast);
                
                //get lunch
                dailyTarget -= breakfast[1];
                calPerMeal = dailyTarget / 2;
                
                lunch = getMeal(calPerMeal,meals, mealsUsed);
                console.log(lunch);
                dailyMeals.push(lunch);
                
                //get dinner
                dailyTarget -= lunch[1];
                calPerMeal = dailyTarget;
                
                
                dinner = getMeal(calPerMeal,meals, mealsUsed);
                console.log(dinner);
                dailyMeals.push(dinner);
                
                console.log(dailyTarget - dinner[1])
                weeklyMeals.push(dailyMeals);
                
                console.log(mealsUsed);
                checkMealsUsed(meals,mealsUsed);
            }
            console.log(weeklyMeals);
            if(false){
                
                con.query("delete from mydb.MealSchedule where Users_idUser = " + user + ";", function (err, result, fields) {
                    if(err) throw err;
                });
            }
            else{
                
            con.query("SELECT * FROM mydb.MealSchedule where Users_idUser = " + user + ";", function (err, result, fields) {
                if(err) throw err;
                    console.log(result)
                    if(result.length == 0) // does not exist
                    {
                        console.log("here");
                        con.query("insert into mydb.MealSchedule(Users_idUser) values(" + user +");" , function (err, result, fields) { // insert meal schedule
                            if(err) throw err;
                            con.query("select idMealSchedule from mydb.MealSchedule where Users_idUser = " + user + ";" , function (err, result, fields) { // get meal schedule id
                                if(err) throw err;
                                mealScheduleId = result[0]['idMealSchedule'];
                                console.log(mealScheduleId);
                                
                                con.query("insert into mydb.WeeklyMeals(MealSchedule_idMealSchedule) values(" + mealScheduleId +");" , function (err, result, fields) { // insert meal week    
                                    if(err) throw err;
                                    con.query("select idWeeklyMeals from mydb.WeeklyMeals where MealSchedule_idMealSchedule = " + mealScheduleId + ";" , function (err, result, fields) { // get meal week id
                                        if(err) throw err;
                                        mealWeekId = result[0]['idWeeklyMeals'];
                                        console.log(mealWeekId);
                                        
                                        
                                        values = ""
                                        for(var i = 0; i < 7; i++){
                                            values += "(" + Math.floor(Math.random() * 10000000) + "," + mealWeekId +"),";
                                        }
                                        values = values.substring(0,values.length - 1);
                                        console.log(values);
                                        con.query("insert into mydb.DailyMeals(idDailyMeals,WeeklyMeals_idWeeklyMeals) values" + values +";" , function (err, result, fields) { // insert meal day
                                            if(err) throw err;
                                            con.query("select * from mydb.DailyMeals where WeeklyMeals_idWeeklyMeals = "+ mealWeekId + ";" , function (err, result, fields) { // get days ids
                                                if(err) throw err;
                                                values = "";
                                                console.log("here 2");
                                                console.log(result);
                                                for(var i = 0; i < 7;i++){
                                                    values += "(" + weeklyMeals[i][0][2] + ",1," + result[i]['idDailyMeals'] + "),";// breakfast
                                                    values += "(" + weeklyMeals[i][1][2] + ",2," + result[i]['idDailyMeals'] + "),";// lunch
                                                    values += "(" + weeklyMeals[i][2][2] + ",3," + result[i]['idDailyMeals'] + "),";// dinner
                                                }
                                                values = values.substring(0,values.length - 1);
                                                con.query("insert into mydb.MealContent(BaseMeal_idBaseMeal, meal_type, DailyMeals_idDailyMeals) values" + values +";" , function (err, result, fields) { });// insert contents
                                                
                                            });
                                        });
                                    });
                                });
                            });
                        });
                        
                        
                    }
                    else{
                        mealScheduleId = result[0]['idMealSchedule'];
                        console.log(mealScheduleId);
                        con.query(`SELECT
    MealContent.BaseMeal_idBaseMeal,
    DailyMeals_idDailyMeals,
    meal_type
FROM
    MealContent
        LEFT JOIN
    DailyMeals ON DailyMeals.idDailyMeals = MealContent.DailyMeals_idDailyMeals
        LEFT JOIN
    WeeklyMeals ON WeeklyMeals.idWeeklyMeals = DailyMeals.WeeklyMeals_idWeeklyMeals
        LEFT JOIN
    MealSchedule ON MealSchedule.idMealSchedule = WeeklyMeals.MealSchedule_idMealSchedule
        LEFT JOIN
    Users ON Users.idUser = MealSchedule.Users_idUser where idUser = ` + user + `
    order by idDailyMeals, meal_type;`, function (err, result, fields) { // get meal contents
                            if(err) throw err;
                            console.log(result);
                            console.log(result.length);
                            query_ = ""
//                             query_ += "update MealContent set BaseMeal_idBaseMeal = " + weeklyMeals[0 / 3][0][2] + " where DailyMeals_idDailyMeals = " + result[i]['DailyMeals_idDailyMeals'] + " and meal_type = 1;\r\n";
//                             query_ += "update MealContent set BaseMeal_idBaseMeal = " + weeklyMeals[0 / 3][1][2] + " where DailyMeals_idDailyMeals = " + result[i]['DailyMeals_idDailyMeals'] + " and meal_type = 2;\r\n";
                            for(var i = 0; i < result.length; i += 3){
                               query_ = "update MealContent set BaseMeal_idBaseMeal = " + weeklyMeals[i / 3][0][2] + " where DailyMeals_idDailyMeals = " + result[i]['DailyMeals_idDailyMeals'] + " and meal_type = 1;\r\n";
                                con.query(query_, function (err, result, fields) { 
                                    if(err) throw err;
                                });// update contents
                               query_ = "update MealContent set BaseMeal_idBaseMeal = " + weeklyMeals[i / 3][1][2] + " where DailyMeals_idDailyMeals = " + result[i]['DailyMeals_idDailyMeals'] + " and meal_type = 2;\r\n";
                               con.query(query_, function (err, result, fields) { 
                                    if(err) throw err;
                                });// update contents
                               query_ = "update MealContent set BaseMeal_idBaseMeal = " + weeklyMeals[i / 3][2][2] + " where DailyMeals_idDailyMeals = " + result[i]['DailyMeals_idDailyMeals'] + " and meal_type = 3;\r\n";
                               con.query(query_, function (err, result, fields) { 
                                    if(err) throw err;
                                });// update contents
                            }
                            console.log(query_);
                        });
                    }
            });
            
            }
            // put meal schedule in db
            
            //process.exit();
        });
        
    });
});
