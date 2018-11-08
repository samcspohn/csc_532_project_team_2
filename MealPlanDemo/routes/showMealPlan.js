var express = require('express');
var router = express.Router();
var dbconn = require('../db/db')
var sqlquery = null
var queryResult = null
/* GET home page. */
function query(res,sql){
  dbconn.query(sql, function (err, rows) {
    if (err) {
        res.end('failed：' + err);
    } else {
        console.log(JSON.stringify(rows))
    }
    res.render('showMealPlan', { 
      title: 'showMealPlan',
      posts: rows
    });
  });
}
router.get('/', isNotLogin);

router.get('/', function(req, res, next) {
  var userid = req.session.user['idUser']
  sqlquery="SELECT BaseMeal.BaseMeal_name FROM BaseMeal LEFT JOIN MealContent ON MealContent.BaseMeal_idBaseMeal = BaseMeal.idBaseMeal"+
   " LEFT JOIN DailyMeals ON DailyMeals.idDailyMeals = MealContent.DailyMeals_idDailyMeals LEFT JOIN WeeklyMeals ON WeeklyMeals.idWeeklyMeals"+
   " = DailyMeals.WeeklyMeals_idWeeklyMeals LEFT JOIN MealSchedule ON MealSchedule.idMealSchedule = WeeklyMeals.MealSchedule_idMealSchedule"+
   " LEFT JOIN Users ON Users.idUser = MealSchedule.Users_idUser WHERE idUser = '"+userid+"' ORDER BY idDailyMeals , meal_type"
  console.log(sqlquery)
  query(res,sqlquery)
});

router.post('/', function(req,res){
  console.log("Post button")
  console.log(req.body['userID'])
  query(res,sqlquery)
  //query(res,"update ")
});

function isNotLogin(req,res,next){
  console.log("Enter is login")
  console.log("suser:"+req.session.user)
    if(req.session.user==null){
        req.session.message="You should Login Before you setting a Goal";
        return res.redirect('/');
    }
    next();
}
module.exports = router;
