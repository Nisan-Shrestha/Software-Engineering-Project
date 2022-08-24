const express = require('express');
var router = express.Router();
const Project = require('../models/project');
const Comment = require('../models/comment');
const middleware = require('../middleware/index1');
router.get('/', function (req, res) {
  Project.find({}, function (err, allProjects) {
    if (err) {
      console.log(err);
    }
    else {
      res.render('projects/index', { projects: allProjects })
    }
  })
})

router.get('/new', middleware.isLoggedIn, function (req, res) {
  res.render('projects/new')
})

//Add project
router.post('/', middleware.isLoggedIn, function (req, res) {
  var title = req.body.title
  var year = req.body.year
  var description = req.body.description
  var link = req.body.link
  var image = req.body.image
  var supervisor = req.body.supervisor
 // var authors = req.body.authors
  req.body.member.forEach(username=>{
    
  })
  var author = {
    id: req.user._id,
    username: req.body.member,
  }
  var reviewStatus = false
  var abstract = req.body.abstract

  var newProject = { title: title, image: image, description: description, author: author,  year: year, link: link, supervisor: supervisor, reviewStatus: reviewStatus, abstract: abstract }

  Project.create(newProject, function (err, newProj) {
    if (err) {
      console.log("error", err);
    }
    else {
      res.redirect('/projects')
    }
  })
})


//my project
router.get('/myprojects/:id', middleware.isLoggedIn, (req, res) => {
  console.log("hello")
  try {
    Project.find({"author.id":req.params.id }, function (err, allProjects) {
      if (err) {
        console.log(err);
      }
      else {
        res.render('projects/index', { projects: allProjects })
      }
    })
   
  } catch (error) {
    console.log(error);
  }
});



//search
router.get('/search', (req, res) => {
  try {
    Project.find({ $or: [{ title: { '$regex':new RegExp(req.query.dsearch, "i") } }, { supervisor: { '$regex': new RegExp(req.query.dsearch, "i") } }] }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.render('projects/index', { projects: data });
      }
    })
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id', function (req, res) {
  Project.findById(req.params.id).populate('comments').exec(function (err, foundGround) {
    if (err) {
      console.log("ERRORORORORO:", err);
    }
    else {
      res.render('projects/show', { project: foundGround })
    }
  })
})

// edit route
router.get('/:id/edit', middleware.checkProjectOwnership, function (req, res) {
  Project.findById(req.params.id, function (err, foundProject) {
    res.render("projects/edit", { project: foundProject })
  })
})

// Update Route
router.put("/:id", middleware.checkProjectOwnership, function (req, res) {
  Project.findByIdAndUpdate(req.params.id, req.body.project, function (err, updatedproject) {
    if (err) {
      res.redirect('/projects')
    }
    else {
      res.redirect('/projects/' + req.params.id)
    }
  })
})


// DESTROY PROJECT ROUTE
router.delete('/:id', middleware.checkProjectOwnership, function (req, res) {
  Project.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      res.redirect('/projects/' + req.params.id)
    }
    console.log("deleted")
    res.redirect('/projects')
  })
})




module.exports = router