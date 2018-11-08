var express = require('express');
var router = express.Router();
var dbconn = require('../db/db')
var user = null
/* GET home page. 
router.get('/', function(req, res, next) {
  console.log("Enter is //")
  res.render('login', { title: 'Log In' });
});*/
router.get('/',isLogin);
router.get('/',function(req,res){
    res.render('login',{title:"User Log In"});
});
router.post('/',isLogin);
router.post('/',function(req,res){
    var username=req.body.username
    var sql="select * from Users where idUser='"+username+"'"
    console.log("username is :"+username)
    console.log("sql is :"+sql)
    dbconn.query(sql, function (err, rows) {
      if (err) {
          res.end('failed：' + err);
      } else {
        if(JSON.stringify(rows)!="[]"){
          rows.forEach(element => {
            console.log(JSON.stringify(element))
            req.session.user=element;
          });
          console.log("find user:"+req.session.user['idUser'])
          
          req.session.message="Login Successful.";
          res.redirect('/');
        }else{
          console.log("Username or Password is incorrect.")
          req.session.message="Username or Password is incorrect.";
          res.render('login', { 
            title: 'Username or Password is incorrect.'
          });
        }
      }
    });
});
router.get('/logout',function(req,res){
    req.session.user=null;
    res.redirect('/');
});
function isLogin(req,res,next){
  console.log("Enter is login")
  console.log("suser:"+req.session.user)
    if(req.session.user!=null){
        req.session.message="Already Login";
        return res.redirect('/');
    }
    next();
}
module.exports = router;
