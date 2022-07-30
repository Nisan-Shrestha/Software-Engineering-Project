const express = require('express');
var router = express.Router()
const passport = require('passport');
const User = require('../models/user');

// ROot
router.get('/',function(req,res) {
  res.render('landing')
})

// Show Register Form
router.get('/register',function (req,res) {
  res.render('register')
})

// Handles Sign up i.e. Register
router.post('/register',function(req,res){
  var newUser = new User({username:req.body.username})
  User.register(newUser,req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.render('register',{error:err.message})
    }
    else{
      passport.authenticate('local')(req,res,function(){
        req.flash("success","welcome to YelpCamp "+user.username)
        res.redirect('/campgrounds')
      })
    }
  })
})

// Show Login Form
router.get('/login',function (req,res) {
  res.render('login')
})

// HAndle Login
router.post('/login',passport.authenticate('local',
  {
    // successRedirect:'/campgrounds',
    failureRedirect:'/login',
    failureFlash: true,
    // successFlash:"Logged in succesfully"
  }),function (req,res) {
    req.flash('success',"logged in Successfully as : " + req.user.username)
    res.redirect('/campgrounds')
})

// Handle Logout
router.get('/logout',function (req,res) {
  req.flash('success',"Logged You Out")
  req.logout()
  res.redirect('/campgrounds')
})

module.exports = router