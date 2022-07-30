const express = require('express');
var router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');
router.get('/',function(req,res){
  Campground.find({},function(err,allCampgrounds){
    if (err) {
      console.log(err);
    }
    else{
      res.render('campgrounds/index', {campgrounds:allCampgrounds})
    }
  })
})

router.get('/new',middleware.isLoggedIn,function(req,res){
  res.render('campgrounds/new')
})

//Add CampGround
router.post('/',middleware.isLoggedIn,function (req,res) {
  var name = req.body.name
  var price = req.body.price
  var image = req.body.image
  var description = req.body.description
  var author = {
    id : req.user._id,
    username : req.user.username
  } 
  var newCampground = { name : name , image :image, description :description, author:author, price:price}
  
  Campground.create(newCampground,function (err,newCamp) {
    if (err) {
      console.log("error",err);
    }
    else{
      res.redirect('/campgrounds')
    }
  })
})

router.get('/:id',function(req,res){
  Campground.findById(req.params.id).populate('comments').exec(function(err,foundGround){
    if(err){
      console.log("ERRORORORORO:",err);
    }
    else{
      res.render('campgrounds/show',{campground:foundGround})
    }
    })
})

// edit route
router.get('/:id/edit',middleware.checkCampgroundOwnership,function (req,res) {
  Campground.findById(req.params.id,function (err,foundCampground) {
      res.render("campgrounds/edit",{campground:foundCampground})
  })
})

// Update Route
router.put("/:id",middleware.checkCampgroundOwnership,function (req,res) {
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function (err,updatedCampground) {
    if(err){
      res.redirect('/campgrounds')
    }
    else{
      res.redirect('/campgrounds/'+req.params.id)
    }
  })
})

// DESTROY CAMPGROUND ROUTE
router.delete('/:id',middleware.checkCampgroundOwnership,function (req,res) {
  Campground.findByIdAndDelete(req.params.id,function (err) {
    if (err) {
      res.redirect('/campgrounds/'+req.params.id)
    }
    res.redirect('/campgrounds')
  })
})

module.exports = router