var express = require('express');
var router = express.Router();
var dbconn = require('../db/db')
var isNew=false
router.post('/',function(req,res){
  var userid=req.session.user['idUser']
  if(isNew){
    var sql="Insert into TargetGoals(Weight,Calorie,Fat,carbohydrate,Protein,User_idUser) values ('"
      +req.body.targetWeight+"','"
      +req.body.targetCalorie+"','"
      +req.body.targetFat+"','"
      +req.body.targetCarbohydrate+"','"
      +req.body.targetProtein+"','"
      +userid+"'"
      +")"
  }else{
    var sql="UPDATE TargetGoals SET Weight='"+req.body.targetWeight+
    "',Calorie='"+req.body.targetCalorie+"',Fat='"+req.body.targetFat+
    "',carbohydrate='"+req.body.targetCarbohydrate+"',Protein='"+req.body.targetProtein+
    "' where User_idUser='"+userid+"'"
  }
  var sql_para=[req.body.targetWeight,req.body.targetCalorie,req.body.targetFat,req.body.targetCarbohydrate,req.body.targetProtein,req.body.targetWeight,userid]
  console.log("sql is :"+sql)
  console.log("para is :"+sql_para)
  console.log("New:"+isNew)

  dbconn.query(sql, function (err, result) {
    if (err) {
        res.end('failed：' + err);
        console.log(err)
    } else {
      console.log(JSON.stringify(result))
      req.session.message="Set Goal Successfully.";
      res.redirect('/');
    }
  });
});
/* GET home page. */
router.get('/', isNotLogin);
router.get('/', function(req, res, next) {
  isNew=false
  console.log(req.session.user['idUser'])
  var sql = "select * from TargetGoals where User_idUser='"+req.session.user['idUser']+"'"
  dbconn.query(sql, function (err, rows) {
    if (err) {
      res.end('failed：' + err);
    } else {
      if (JSON.stringify(rows)=="[]"){
        isNew=true
      } 
    }
    console.log(JSON.stringify(rows))
    console.log("isNew:"+isNew)
    res.render('setGoal', { 
      title: 'Set Goal',
      isNew: isNew,
      posts: rows
    });
  });
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
