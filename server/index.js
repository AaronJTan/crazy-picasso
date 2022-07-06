const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

/* ------------------------------CONNECT DATABASE------------------------------*/
// const mongoose = require('mongoose');

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
app.set('view engine', 'ejs');


const cors = require('cors');
app.use(cors());

app.use(function(req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

/* ------------------------------ROUTES------------------------------*/
/* Temporary*/
app.get("/", function(req, res, next) {
  res.json("HELLO");
  next();
});

app.get("/public/", (req, res, next) => {
  console.log("hello?")
  res.redirect(`/public/${uuidv4()}`);
})



app.get("/video", (req, res) => {
  res.render('room');
})

const { Server, Socket } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: `http://localhost:${process.env.NGINX_PORT}`,
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("send_message", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_message", data);
  });
  socket.on('join-room', (userId) => {
    console.log("User joined the room");
  })
});



/* ------------------------------INITIALIZE SERVER------------------------------*/
const PORT = 3003;

server.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});