import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});
const PORT = 3001;

app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("send_message", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_message", data);
  });
});

server.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
