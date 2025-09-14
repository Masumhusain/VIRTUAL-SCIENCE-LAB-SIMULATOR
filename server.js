
require('dotenv').config();
const express = require('express'); 
const app = express();
const PORT = process.env.SERVER_PORT;
const mongoose = require('mongoose')
const path = require('path');
const engine = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const ExpressError = require('./utils/expressError.js')
const {isLoggedIn} = require("./middleware.js")
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Set EJS
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let MongoUrl = process.env.DB_URL;
// data base setUp 
main().then(() => console.log("Connected to DB")).catch(err => console.log(err));


async function main() {
    await mongoose.connect(MongoUrl,  {useNewUrlParser: true,
      useUnifiedTopology: true});
}



const User = require("./models/user.js"); 
const Experiment = require("./models/experiment.js");
const ExperimentAcid = require("./models/experiment-acid.js");
const MotionExperiment = require("./models/motion.js");
// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser (for forms, optional)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// session store  
const store  = MongoStore.create({
    mongoUrl: MongoUrl,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 7 * 24 * 60 * 60 ,
})

store.on(("error") , ()=> {
  console.log("Error in mongo session store", err);
})
// Session setup
const sessionOptions = {
  store,
     secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
} };
app.use(session(sessionOptions));

// Flash
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set locals for templates
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    res.locals.curr_user = req.user;
    next();
});


//fakeUser
// app.get("/demouser", async(req, res)=> {
//     const fakeUser = new User( {
//         username: "mukesh",
//         email: "demo@gmail.com"
//     });

//   let RegisteredUser = await User.register(fakeUser , "1234");
//   res.send(RegisteredUser);

   
// })





//fake experiments
//  app.get("/fakeexperiment", async(req, res)=> {
//     const fakeexp = new Experiment( {
//         experiment_name: "ohms_law",
//          done_by: "masum",
//          voltage: "12",
//          current: "12",
//           resistance: "12",
//          power: "12",
//          created_at: new Date()
//     })
//     fakeexp.save();
//     res.send(fakeexp);
// });


// app.get("/acidexperiment", async(req, res)=> {
//     const newExperiment = new ExperimentAcid({
//     acidMolarity: 1.0,
//     baseMolarity: 1.0,
//     acidVolume: 50,
//     baseVolume: 50,
//     pH: "pH 7.00",
//     status: "Mix complete"
//   });
//   await newExperiment.save();
//   res.send(newExperiment);
// })

     



   
// })

// Route to set flash and redirect
app.get('/', (req, res) => {
    req.flash('success', 'Welcome to the home page!');
    res.redirect('/home'); // redirect so flash 
    // works
});



app.get("/home", (req, res)=> {
    res.render("f-index.ejs")
})

app.get('/signup', (req, res) => {
    res.render('users/signup'); // flash message available via res.locals
});


app.post("/signup", async(req, res)=> {
    try {
         let {username, email, password} = req.body;
     let userNew = new User( {
        username, email
     });
    let newUser = await  User.register(userNew, password);
    console.log(newUser);
    req.login(newUser, (err)=> {
        if(err) {
            return next(err);
        }
     req.flash("success", "user registered successfully");
    res.redirect("/home");
    })
   
    }catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
   
});

app.get("/login", (req, res)=> {
    res.render("users/login");
});

app.post("/login", passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
}),async(req, res)=> {
    req.flash("success", "Logged in successfully");
    res.redirect("/home");
});

app.get("/logout", (req, res)=> {
    req.logout((err)=> {
        if(err)  {
            return next(err);
        }
        req.flash("error", "Logged out successfully");
       res.redirect("/home")
    })
})


app.get("/ohms", isLoggedIn,  (req, res)=> {
    res.render("experiment/ohmsLaw.ejs");
})

app.get("/acid-base-reaction",isLoggedIn, (req, res)=> {
    res.render("experiment/acid-base-reaction.ejs");
})

app.get("/newtons-motion",isLoggedIn, (req, res)=> {
    res.render("experiment/newton-motion.ejs");
})

app.get("/about", (req, res)=> {
    res.render("about.ejs");
})

app.get("/contact", (req, res)=> {
    res.render("contact.ejs");
})
app.get("/experiments-saved", (req, res)=> {
    res.render("show-experiment/show-experiments.ejs");
})


//save fpr ohms  
// experiment save code starts form here 
// ✅ Save route (frontend fetch yahan hit karega)
app.post("/save", async (req, res) => {
  try {
    const newExp = new Experiment(req.body);
    await newExp.save();

  } catch (err) {
    console.error("❌ Error saving experiment:", err);
    req.flash("error", "Failed to save experiment");
    res.redirect("/experiments");
  }
});


// ✅ ohms all Experiments dekhne ke liye
app.get("/experiments", async (req, res) => {
  try {
    const exps = await Experiment.find();
    res.render("show-experiment/ohms-exp.ejs", { experiments: exps });
  } catch (err) {
    res.status(500).send("Error fetching experiments");
  }
});

//save for  acid base reaction 
app.post("/save-acid-reaction", async (req, res) => {
  try {
    const newExp = new ExperimentAcid(req.body);
    await newExp.save();

  } catch (err) {
    console.error("❌ Error saving experiment:", err);
    req.flash("error", "Failed to save experiment");
    res.redirect("/experiments");
  }
});


// ✅ All Experiments dekhne ke liye
app.get("/experiments-acid", async (req, res) => {
  try {
    const exps = await ExperimentAcid.find();
    res.render("show-experiment/acid-experiment.ejs", { experiments: exps });
  } catch (err) {
    res.status(500).send("Error fetching experiments");
  }
});


//motion experiment save
app.post("/save-motion", async (req, res) => {
  try {
    const newExp = new MotionExperiment(req.body);
    const saveMotion = await newExp.save();
    console.log(saveMotion);
  } catch (err) {
    console.error("❌ Error saving experiment:", err);
    res.redirect("/experiments");
  }
});

// ✅ All Experiments dekhne ke liye
app.get("/experiments-motion", async (req, res) => {
  try {
    const exps = await MotionExperiment.find();
    res.render("show-experiment/motion-experiment.ejs", { experiments: exps });
  } catch (err) {
    res.status(500).send("Error fetching experiments");
  }
});


//fake data 
app.get("/motionget", async(req, res)=> {
    const newExperiment = new MotionExperiment({
      experiment_name: "Motion Experiment",
      done_by: "masum",
       mass: 5,          // kg
     force: 5.8,         // N
    angle: 30,         // degree
    gravity: 9.8,       // m/s^2
    mu_s: 0.5,          // static friction
     mu_k: 0.5,          // kinetic friction
  });
  await newExperiment.save();
  res.send(newExperiment);
})





//error handler
app.all(/./, (req , res , next)=> {
  next(new ExpressError(404, "Page not found"));
})

app.use((err , req, res ,next)=> {
    console.log("error: " , err.name);
    next(err);
})

//middlewared
app.use((err , req ,res , next)=> {
  let {status=500 , message="Something went wrong!"} = err;
  res.status(status).render("error.ejs", {err});
})


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
