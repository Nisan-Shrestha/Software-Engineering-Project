const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      flash = require('connect-flash'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      methodOverride = require('method-override'),
      Campground = require('./models/campground'),
      Comment = require('./models/comment')
      User    = require('./models/user')
      seedDB = require('./seeds');

const commentRoutes     = require('./routes/comments');
const campgroundRoutes  = require('./routes/campgrounds');
const projectRoutes  = require('./routes/projects');
const indexRoutes        = require('./routes/index');

const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://nisan:Shrestha@nisan.xxkt3.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
var url = process.env.DATABASEURL || "mongodb+srv://nisan:Shrestha@nisan.xxkt3.mongodb.net/?retryWrites=true&w=majority"
console.log(process.env.DATABASEURL);
 
mongoose.connect(url , {useNewUrlParser:true})
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(flash())
// seedDB();

// Passport setup ====================

app.use(require('express-session')({
  secret: "Once Again We Win",
  resave: false,
  saveUninitialized : false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function (req,res,next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
})

// Routes ======================
app.use('/',indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/projects",projectRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
const port = process.env.PORT || 3000 ;
app.listen(port, process.env.IP,function(){
  console.log("serving Local @ 3000");
})  