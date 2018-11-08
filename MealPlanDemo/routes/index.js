var express = require('express');
var router = express.Router();
var User=require('../modules/user');
var user=null
var message=null
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user!=null){
    user=req.session.user
  }
  if(req.session.message!=null){
    message=req.session.message
  }
  console.log("user:"+user)
  res.render('index', { 
    title: 'MealPlan',
    user:user, 
    message:message
  });
});
router.get('/logout',function(req,res){
  req.session.user=null;
  req.session.message=null;
  user=null;
  message=null;
  res.redirect('/');
});
module.exports = router;
