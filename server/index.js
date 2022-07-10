const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const session = require("express-session")({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});
const passport = require("passport");
const initializePassport = require("./config/passport");
const Player = require("./models/playerModel");
const bcrypt = require("bcrypt");

/* ------------------------------Cookie Session------------------------------*/

app.use(session);

app.use(passport.initialize());
app.use(passport.session());

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

/* ------------------------------MIDDLEWARES------------------------------*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

const cors = require("cors");
app.use(cors());

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

/* ------------------------------ROUTES------------------------------*/
/* Temporary*/
app.get("/", function (req, res, next) {
  console.log("homepage");
  res.json("HELLO");
});

const authRoutes = require("./routes/authRoutes");

app.post("/auth/signup", async (req, res) => {
  console.log("auth/signup");
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  console.log(username);

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "missing inputs" });
  }

  const playerExist = await Player.findOne({ email });

  if (playerExist) return res.status(400).json({ error: "an account already exists" });

  const salt = await bcrypt.genSalt(10);
  const saltedhash = await bcrypt.hash(password, salt);

  const newPlayer = await Player.create({
    firstName,
    lastName,
    username,
    email,
    password: saltedhash,
  });

  if (newPlayer) {
    res.status(200).json({
      _id: newPlayer.id,
      firstName: newPlayer.firstName,
      lastName: newPlayer.lastName,
      username: newPlayer.username,
      email: newPlayer.email,
    });
  } else {
    res.status(400).json({ error: "problem with creating customer (invalid customer data)" });
  }
});

app.post("/auth/signin", passport.authenticate("local"), (req, res) => {
  console.log("Session: ", req.session);
  res.username = req.session.passport.user.username;
  return res.status(200).json("signin success");
});

const { Server, Socket } = require("socket.io");

const sharedsession = require("express-socket.io-session");
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    method: ["GET", "POST"],
  },
});

io.use(sharedsession(session));

io.on("connection", (socket) => {
  // Accept a login event with user's data
  // socket.on("login", function(userdata) {
  //   socket.handshake.session.userdata = userdata;
  //   socket.handshake.session.save();
  // });
  // socket.on("logout", function(userdata) {
  //     if (socket.handshake.session.userdata) {
  //         delete socket.handshake.session.userdata;
  //         socket.handshake.session.save();
  //     }
  // });
  console.log();
  console.log(`User Connected: ${socket.id}`);
  console.log(socket.handshake.session);
  socket.on("send_message", (data) => {
    console.log(socket.handshake.session);
    console.log(data);
    socket.broadcast.emit("receive_message", data);
  });
  socket.on("join-room", (userId) => {
    console.log("User joined the room");
  });
});

/* ------------------------------INITIALIZE SERVER------------------------------*/
const PORT = 3001;

server.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
