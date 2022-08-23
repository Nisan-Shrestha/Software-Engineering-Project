const express = require("express");
var router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const multer = require('multer')
const csv = require('fast-csv');
const cors = require("cors");
const fs = require('fs');
const Project = require('../models/project');
const middleware = require('../middleware/index1');



const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("erore hereer")
        cb(null, "./csvfiles"); //important this is a direct path fron our current file to storage location
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: fileStorageEngine });

router.get('/', function (req, res) {
    // res.send("hello")
    Project.find({},function(err,allProjects){
        if (err) {
          console.log(err);
        }
        else{
          res.render('admin/admin', {projects:allProjects})
        }
      })

});

router.post('/upload-csv', upload.single('file'), function (req, res) {
    console.log(req.file);

    const fileRows = [];
    csv.parseFile(req.file.path)
        .on("data", function (data) {
            fileRows.push(data); // push each row
        })
        .on("end", function () {
            console.log(fileRows) //contains array of arrays. Each inner array represents row of the csv file, with each element of it a column
            var newCount = 0;
            fileRows.forEach(row => {
                console.log(row);
                if (row[0].toLowerCase() == "Username") {
                    return;
                } else {
                    var UserName = row[0];
                    var PassWord = row[1];

                    var newUser = new User({ username: UserName });
                    User.register(newUser, PassWord, function (err, user) {
                        if (err) {
                            console.log(err);
                        } else {
                            // passport.authenticate("local")(req, res, function () {
                            newCount++;;
                            console.log("\n new user created:", UserName)
                            // });
                        }
                    });console.log("\n ASASDAS new user created:", UserName)
                    //process "fileRows" and respond
                }
            })
            fs.unlinkSync(req.file.path);                     // remove file after finish process

            // req.flash("success", "Succesfully added " + newCount + " no of new accounts")
            res.render('admin/upload');
        })
});


router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.render("register", { error: err.message }); x
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome " + user.username + "!!!");
                res.redirect("/projects");
            });
        }
    });
});

router.put("/:id",middleware.checkProjectOwnership,function (req,res) {
    Project.findByIdAndUpdate(req.params.id,req.body.project,function (err,updatedproject) {
      if(err){
        res.redirect('/admin')
      }
      else{
        res.redirect('/admin/'+req.params.id)
      }
    })
  })


module.exports = router;