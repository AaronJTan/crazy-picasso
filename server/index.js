const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const session = require("express-session")
const passport = require("passport");
const MongoDBStore = require('connect-mongodb-session')(session);

/* ------------------------------Cookie Session------------------------------*/

// app.use(cookieParser());

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

// const connection = mongoose.createConnection(process.env.MDB_URI, { useNewUrlParser: true })

let sessionStore = new MongoDBStore({
  uri: process.env.MDB_URI,
  collection: 'sessions'
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // equals 1 day
  }
}));

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

app.use(function(req, res, next) {
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

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined the room: ${data}`);
  })
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
