const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const {isLoggedin, isOwner, validateListing } = require("../middleware.js");
const { index,newListing,showListing, postListing, 
    editListing, updateListing, destroyListing, 
    } = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../CloudConfig.js")
const upload = multer({storage})

// //search route

//index route
router.route("/")
.get(wrapasync(index))
.post(isLoggedin,
    upload.single("listing[image]"),
    validateListing,
    wrapasync
    (postListing));

//new route
router.route("/new")
.get(isLoggedin, (newListing));

//show route ,update route, delete route
router.route("/:id")
.get(wrapasync(showListing))
.put(isLoggedin,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapasync(updateListing))
    
.delete(
    isLoggedin,isOwner,wrapasync(destroyListing));

// edit route
router.route("/:id/edit")
.get(isLoggedin,isOwner,
    wrapasync( editListing));



module.exports = router;