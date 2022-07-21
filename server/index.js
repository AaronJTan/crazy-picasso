const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const MongoDBStore = require("connect-mongodb-session")(session);

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

/* ------------------------------MIDDLEWARES------------------------------*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require("cors");
// app.use(cors());

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

// local signup/login routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// private-rooms routes (create and join a private room)
const privateRoomRoutes = require("./routes/privateRoomRoutes");
app.use("/private-rooms", privateRoomRoutes);

// google oAuth login

/* ------------------------------SOCKET.IO------------------------------*/

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    method: ["GET", "POST"],
  },
});

// Socket middleware to check the username and allow the connection
// io.use((socket, next) => {
//   console.log("io middleware");
//   const username = socket.handshake.auth.username;
//   console.log("io middleware username: ", username);
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
  // username is added as an attribute of socket object which can be reused later
//   socket.username = username;
//   next();
// });

io.on("connection", (socket) => {
  // const users = [];
  // looping over the io.of("/").sockets object,
  // a map of all currently connected socket instances indexed by ID
  // for (let [id, socket] of io.of("/").sockets) {
  //   users.push({
  //     userId: id,
  //     username: socket.username
  //   })
  // }
  // console.log("before emit users from server");
  // console.log(users);
  // socket.emit("users", users);

  // notify existing users
    // emit to all connected clients
  // socket.broadcast.emit("user connected", {
  //   userID: socket.id,
  //   username: socket.username,
  // });

  const users = [];

  socket.on("join_public_room", (data) => {
    socket.join(data.roomCode);
    if (!users.includes(data.username)) {
      users.push(data.username);
    }
    console.log(`User with ID: ${socket.id} ${data.username} joined the public room`);
    // socket.emit("new_user_connected", users);
  });

  socket.on("send_message", (data) => {
    socket.to(data.roomCode).emit("receive_message", data);
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
