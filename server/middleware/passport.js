const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");
const Player = require("../models/playerModel");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// passport.use(
//   new LocalStrategy({ usernameField: "username" }, async function verify(username, password, done) {
//     if (!username || !password) {
//       return done(null, false, { message: "missing inputs" });
//     }

//     const player = await Player.findOne({ username });

//     if (player && (await bcrypt.compare(password, player.password))) {
//       return done(null, player);
//     } else {
//       return done(null, false, { message: "login failed, invalid username or password" });
//     }
//   })
// );

// passport.serializeUser(function (user, done) {
//   process.nextTick(function () {
//     done(null, { id: user.id, username: user.username, email: user.email });
//   });
// });

// passport.deserializeUser(function (user, done) {
//   process.nextTick(function () {
//     return done(null, user);
//   });
// });

// function initialize(passport, getUserByEmail, getUserById) {

//   const authenticateUser = async (email, password, done) => {
//     const user = getUserByEmail(email)
//       if (user == null) {
//         return done(null, false, { message: "No user found with that email"})
//       }

//       try {
//         if (await bcrypt.compare(password, user.password)) {
//           return done(null, user);
//         } else {
//           return done(null, false, { message: "Password incorrect" })
//         }
//       } catch(e) {
//         return done(e)
//       }
//   }

//   passport.use(new LocalStrategy({ usernameField: "email" }, function verify(username, password, cb) {
//     if (!username || !password) {
//       return cb(null, false, { message: "missing inputs"});
//       // res.status(400).json({ error: "missing inputs" });
//     }

//     const player = await Player.findOne({ email });

//     if (player && (await bcrypt.compare(password, player.password))) {
//       return cb(null, player);
//       // res.status(200).json({
//       //   _id: player.id,
//       //   firstName: player.firstName,
//       //   lastName: player.lastName,
//       //   email: player.email,
//       // });
//     } else {
//       return cb(null, false, { message: "login failed, invalid email or password" })
//       // res.status(400).json({ error: "login failed, invalid email or password" });
//     }
//   }));

//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });

//   passport.deserializeUser((id, done) => {
//     done(null, getUserById(id));
//   });

// }

// module.exports = initialize

// passport.use(
//   new GoogleStrategy(
//     {
//       //options for the google strat
//       callbackURL: "/auth/google/redirect",
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       passReqToCallback: true,
//     },
//     (request, accessToken, refreshToken, profile, done) => {
//       // passport callback function
//       console.log("passport cb function fired");
//       console.log(profile);
//       console.log(profile.displayName);
//       console.log(profile.name.familyName);
//       console.log(profile.name.givenName);
//       console.log(profile.id);

//       new Player({
//         firstName: profile.name.givenName,
//         lastName: profile.name.familyName,
//         usename: profile.displayName,
//         googleId: profile.id,
//       })
//         .save()
//         .then((newPlayer) => {
//           console.log("newPlayer: ", newPlayer);
//         })
//         .catch((err) => console.log(err));
//     }
//   )
// );
