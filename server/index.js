const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const MongoDBStore = require("connect-mongodb-session")(session);
const RoomModel = require("./models/schemas/Room");

/* ------------------------------CONNECT DATABASE------------------------------*/
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MDB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

let sessionStore = new MongoDBStore({
  uri: process.env.MDB_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // equals 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Uncomment below for docker run

// mongoose
//   .connect(
//     process.env.DB_CONNECTION,
//     { useNewUrlParser: true }
//   )
//   .then(() => {
//     console.log('MongoDB Connected')
//   })
//   .catch(err => {
//     console.log(err)
//   });

/* ------------------------------Google OAuth------------------------------*/

/* ------------------------------MIDDLEWARES------------------------------*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.use(function (req, res, next) {
  req.header("Access-Control-Allow-Origin", "*");
  req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

/* ------------------------------ROUTES------------------------------*/
/* Temporary*/
app.get("/", function (req, res, next) {
  res.json("HELLO");
});

require("./middleware/passport");

// app.get('/google', passport.authenticate('google', { scope: ["email", "profile"] }));

// app.get('/oauth2/redirect/google',
//   passport.authenticate('google', { failureRedirect: '/auth/signin', failureMessage: true }),
//   function(req, res) {
//     res.redirect('/select-room');
//   });

// local signup/login routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// app.get("/google-auth", passport.authenticate("google", { scope: ["email", "profile"] }));

// private-rooms routes (create and join a private room)
const privateRoomRoutes = require("./routes/privateRoomRoutes");
app.use("/private-rooms", privateRoomRoutes);

// google oAuth login

/* ------------------------------SOCKET.IO------------------------------*/

const { Server } = require("socket.io");
const gameSocketConnection = require("./game/gameSocketConnection");

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    method: ["GET", "POST"],
  },
});

const nodemailer = require("nodemailer");

// Step 1: Create transporter object
// let transporter = nodemailer.createTransport({
//   service: "AOL",
//   auth: {
//     user: "crazy_picasso@gmail.com",
//     pass: "cscc09project",
//   },
// });

// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   auth: {
//       user: 'coy82@ethereal.email',
//       pass: 'jtJHynyu5EcsfgW2Eh'
//   }
// });

// // Step 2
// let mailOptions = {
//   from: "coy82@ethereal.email",
//   to: "coy82@ethereal.email",
//   subject: "Testing",
//   text: "It works",
// };

// transporter.sendMail(mailOptions, function (err, data) {
//   if (err) {
//     console.log("Error occurs when sending an email", err);
//   } else {
//     console.log("Email sent!");
//   }
// });

const clearRooms = async () => {
  await RoomModel.deleteMany({});
}

clearRooms()

gameSocketConnection.listen(io);
/* ------------------------------INITIALIZE SERVER------------------------------*/
const PORT = 3001;

server.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
