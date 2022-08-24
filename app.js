//requrie various node modules
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Project = require("./models/project"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  http = require('http'),
  fs = require('fs'),
  multer = require('multer'),
  csv = require('fast-csv');;
const cors = require("cors");

app.use(cors());
User = require("./models/user");
seedDB = require("./seeds"); //idr what this does



//setting up mongo
const MongoClient = require("mongodb").MongoClient;

const uri =
  "mongodb+srv://soft-eng:hahawthwtf@cluster0.nqijx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
var url =
  process.env.DATABASEURL ||
  "mongodb+srv://soft-eng:hahawthwtf@cluster0.nqijx.mongodb.net/?retryWrites=true&w=majority";
console.log(process.env.DATABASEURL);

mongoose.connect(url, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(cors());
// seedDB();

// Passport setup ====================

app.use(
  require("express-session")({
    secret: "Once Again We Win",
    resave: false,
    saveUninitialized: false,
  })
);

//initialize authorization and session management with passport.js service 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});





//loading routes (url to req,res  handler) scripts
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const projectRoutes = require("./routes/projects");
const indexRoutes = require("./routes/index");
const adminRoutes = require("./routes/admin");

// Routes ======================
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/projects", projectRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/projects/:id/comments", commentRoutes);
app.use("/admin", adminRoutes);

//the only way to add new accounts for now is from admin apnel which can be accessed only if logged in with username 'admin'
//making sure an admin user exits (delete from database manually if pw incorrect or need to update)
var adminPW = "admin123";
var newUser = new User({ username: "admin" });
User.register(newUser, adminPW, function (err, user) {
  if (err) {
    console.log(err);
    console.log("admin user already exists in database")
  } else {
    console.log("created a new admin user with pw: ", adminPW);
  }
});

//env for deployment, 3000 for local host
const port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function () {
  console.log("serving http://localhost:"+port);
});
