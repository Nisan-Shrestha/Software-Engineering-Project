const express = require('express');
var router = express.Router({mergeParams:true})
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

//Comments : New
router.get('/new',middleware.isLoggedIn,function (req,res) {
  Campground.findById(req.params.id,function (err,campground) {
    if(err){
      console.log(err);
    }
    else{
      res.render('comments/new',{campground:campground})
    }
  })
})

//Comments Create
router.post('/',middleware.isLoggedIn,function (req,res) {
  Campground.findById(req.params.id,function (err,campground) {
    if(err){
      console.log(err);
      res.redirect('/campgrounds')
    }
    else
    {    
      Comment.create(req.body.comment,function (err,comment) {
        if(err){
          console.log(err);
        }
        else{
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          
          comment.save()
          
          campground.comments.push(comment)
          campground.save()
          
          res.redirect('/campgrounds/'+campground._id)
        }
      })
    }
  })
})

router.get("/:comment_id/edit",middleware.checkCommentOwnership,function (req,res) {
  Campground.findById(req.params.id,function (err,campground) {
    if(err){
      console.log(err);
    }
    else{
      Comment.findById(req.params.comment_id,function (err,foundComment) {
        if(err){
          console.log(err);
        }
        else{
          res.render('comments/edit',{campground:campground,comment:foundComment})
        }
      })
    }
  })
})

// Comment update
router.put('/:comment_id/',middleware.checkCommentOwnership,function (req,res) {
  Comment.findByIdAndUpdate(req.params.comment_id,{text:req.body.comment.text},function (err,updatedComment) {
    if(err){
      console.log(err);
      res.redirect('back')
    }
    else{
      res.redirect('/campgrounds/'+req.params.id)
    }
  })
})

// Delete Comment
router.delete('/:comment_id',middleware.checkCommentOwnership,function (req,res) {
  Comment.findByIdAndDelete(req.params.comment_id,function (err) {
    if(err){
      console.log(err);
      res.redirect('back')
    }
    else{
      res.redirect('/campgrounds/'+req.params.id)
      console.log("SUCcessfully deleted");
      
    }
  })
})
  





module.exports = router