const express = require("express");
const router = express.Router({mergeParams:true});
const wrapasync = require("../utils/wrapasync.js");
const { validateReview,isLoggedin, isReviewAuthor } = require("../middleware.js");
const { postReview, destroyReview } = require("../controllers/review.js");

//Reviews post route
router.post("/" ,
    isLoggedin,
    validateReview,wrapasync (postReview));

//Reviews delete route
router.delete("/:reviewId",
    isLoggedin,
    isReviewAuthor,
    wrapasync (destroyReview));

module.exports = router;