const express= require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const {savedRedirectUrl } = require("../middleware.js");

const { signUpuser, signUp, loginuser, login, logoutuser } = require("../controllers/user.js");

router.route("/signup")
.get(signUpuser)
.post(wrapasync( signUp));

router.route("/login")
.get(loginuser)
.post(savedRedirectUrl,
        passport.authenticate('local', {
        failureRedirect: '/login',
        failureMessage: true,
        }),login);

router.get("/logout",logoutuser);

module.exports = router;