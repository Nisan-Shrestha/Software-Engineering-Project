// Allthe middle wares
const Campground = require('../models/campground');
const Comment = require('../models/comment');
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function (req,res,next) {
  if(req.isAuthenticated()){
    Campground.findById(req.params.id,function (err,foundCampground) {
      if(err){
        req.flash("error","Could not find the Campground.")
        console.log(err)
      }
      else{
        if(foundCampground.author.id.equals(req.user._id)){
          return next()
        }
        else{
          req.flash("error","You are not Authorized to do that!")
          res.redirect('back')
        }
      }
    })
  }
  else{
    req.flash("error","You need to be Logged in to do that.")
    res.redirect('back')
  }
}

middlewareObj.checkCommentOwnership = function (req,res,next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id,function(err,foundComment){
      if (err) {
        console.log(err);
        req.flash("error","Could not find Comment.")
        res.redirect('back')
      } 
      else{
        if (foundComment.author.id.equals(req.user._id)) {
          return next()
        }
        else{
          req.flash("error","You are not authorised to do that.")
          res.redirect('back')
        }
      }
    })
  }
  else{
    req.flash("error","You need to be Logged in to do that.")
    res.redirect('/login')
  }
}

middlewareObj.isLoggedIn = function(req,res,next) {
  if(req.isAuthenticated()){
    return next()
  }
  req.flash("error","You need to be Logged in to do that.")
  res.redirect('/login')
}

module.exports = middlewareObj