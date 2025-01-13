if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express= require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;

main().then(()=>{
console.log("connected to the server");
})
.catch((err)=> console.log(err));

async function main ( ) {
await mongoose.connect(dburl);
  };

app.set("views engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride( "_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.listen(8080 ,()=>{
    console.log(" Server is running on port 8080");
});


const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24 * 3600,
});

store.on("error" , () =>{
    console.log("ERROR IN MONGO STORE",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

 app.use((req, res, next) => {
        res.locals.currUser = req.user;
       next();
    });
    app.use(session(sessionOptions));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        next();
    });
  
    // function isAuthenticated(req, res, next) {
    //     if (req.isAuthenticated()) {
    //         return next();
    //     }
    //     res.redirect('/login');
    // }

    app.get("/listings/search",(req, res) =>{
        req.flash("error"," OOPs!!! Search listing Does Not Found");
        res.redirect("/listings")
    });
    
    app.use("/home", (req , res)=>{
        res.render("./listings/home.ejs");
        console.log("home page accesed")
    });

    app.use("/listings" , listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/" ,userRouter);

    app.all("*",(req,res,next) => {
        next(new ExpressError(404 ,"Page Not Found!"));
    });

    app.use((err, req ,res , next) =>{
        let {statusCode = 500 , message="Somethig went Wrong!"} = err;
        res.status(statusCode).render("error.ejs" ,{message});
    });
 
//  res.render("/listings/index.ejs" , { allListings });
 

//   app.get("/listings", async (req , res)=>{
//     let sampleListings = new Listing({
//         title:"My new villa",
//         description: "beach view",
//         image:"",
//         price: 1800,
//         location: "East, Goa",
//         country:"India",
//     });
//     await sampleListings.save();
//     console.log("welcome to root");
//     res.send("success root");
// });
