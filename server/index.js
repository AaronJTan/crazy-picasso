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
  res.json("HELLO");
});

const authRoutes = require("./routes/authRoutes");

// signup route handler
app.post("/auth", authRoutes);

require("./middleware/passport");
// authenticate with passport for signin endpoint 
app.post("/auth/signin", passport.authenticate('local'), (req, res) => {
  console.log("Session: ", req.session);
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

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined the room: ${data}`);
  })
  socket.on("send_message", (data) => {
    socket.to(data.roomCode).emit("receive_message", data);
    // socket.broadcast.emit("receive_message", data);
  });

  socket.on("drawing", (data) => {
    socket.broadcast.emit("live_drawing", data);
  });
});

/* ------------------------------INITIALIZE SERVER------------------------------*/
const PORT = 3001;

server.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
