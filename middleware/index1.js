// Allthe middle wares
const Project = require('../models/project');
const Comment = require('../models/comment');
var middlewareObj = {}

middlewareObj.checkProjectOwnership = function (req,res,next) {
  if(req.isAuthenticated()){
    Project.findById(req.params.id,function (err,foundProject) {
      if(err){
        req.flash("error","Could not find the Project.")
        console.log(err)
      }
      else{
        //if(foundProject.author.id.equals(req.user._id)){
        if(foundProject.author.filter(e => e.id.equals(req.user._id)).length > 0){
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