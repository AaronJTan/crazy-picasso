const router = require("express").Router();
const passport = require("passport");
const { signupPlayer, signinPlayer } = require("../controllers/playerController");

// defines endpoints for signup and signin
router.post("/signup", signupPlayer);
router.post("/signin", signinPlayer);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

// callback route for google to redirect to
router.get("/google/redirect", (req, res) => {
  res.send("you reached the callback URI");
});

module.exports = router;
