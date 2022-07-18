const router = require("express").Router();
// const passport = require("passport");
const { signupPlayer, signinPlayer, logoutPlayer } = require("../controllers/playerController");

// defines endpoints for signup and signin
router.post("/signup", signupPlayer);
router.post("/signin", signinPlayer);
router.get("/logout", logoutPlayer);

// router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

// callback route for google to redirect to
// router.get(
//   "/google/redirect",
//   passport.authenticate("google"),
//   (req, res) => {
//     res.send("you reached the callback URI");
//   }
// );

module.exports = router;
