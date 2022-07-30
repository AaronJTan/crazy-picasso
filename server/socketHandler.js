const uuidGenerator = require('short-uuid');
const rooms = new Map();
const RoomModel = require("./models/Room");

const addUserToRoom = async (username, roomCode) => {
  let room = await RoomModel.findOne({ roomCode });
  let user = {username};
  
  if (room === null ) {
    await RoomModel.create({ roomCode, users: [user] });
  } else {
    room.users.push(user);

    await room.save();
  }
}

const getUsersInRoom = async (roomCode) => {
  let room = await RoomModel.findOne({ roomCode }).lean();
  let usersInRoom = room.users;

  return usersInRoom;
}

const removeUserFromRoom = async (roomCode, username) => {
  let room = await RoomModel.findOneAndUpdate(
    { roomCode },
    { $pull: { users: { username } } },
    { safe: true, multi: false, new: true }
  ).lean();

  let usersInRoom = room.users;

  return usersInRoom;
}

const deleteRoomIfEmpty = async (roomCode) => {
  let usersInRoom = await getUsersInRoom(roomCode);

  if (usersInRoom.length === 0) {
    await RoomModel.deleteOne({ roomCode });
  }
}

const listen = (io) => {
  // Socket middleware to check the username and allow the connection
  io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    console.log("io middleware username: ", username);
    // username is added as an attribute of socket object which can be reused later
    socket.username = username;
    next();
  });

  io.on("connection", (socket) => {

    socket.on("create_private_room", async (callback) => {
      let roomCode = uuidGenerator.generate();
      socket.roomCode = roomCode;
      await addUserToRoom(socket.username, roomCode);

      socket.join(roomCode);
      console.log(`User with ID: ${socket.id} ${socket.username} joined the private room (${roomCode})`);
      console.log(rooms);

      let usersInRoom = await getUsersInRoom(roomCode);

      callback({ users: usersInRoom, roomCode });
    });

    socket.on("join_private_room", async (data, callback) => {
      let roomCode = data.privateRoomCode;
      socket.roomCode = roomCode;
      await addUserToRoom(socket.username, roomCode);

      socket.join(roomCode);
      console.log(`User with ID: ${socket.id} ${socket.username} joined the private room (${roomCode})`);
      console.log(rooms);

      let usersInRoom = await getUsersInRoom(roomCode);
      socket.to(roomCode).emit("user_joined_private_room", usersInRoom);
      // socket.to(roomCode).emit("receive_message", { author: socket.username, message: "JOINED THE GAME" });

      callback({ users: usersInRoom, roomCode });
    });

    socket.on("join_private_game", async (callback) => {
      let usersInRoom = await getUsersInRoom(socket.roomCode);
      
      if (usersInRoom.length >= 2) {
        io.to(socket.roomCode).emit("set_wait_status", false);
        
        socket.to(socket.roomCode).emit("receive_message", { author: socket.username, message: "JOINED THE GAME" });
      } else {
        io.to(socket.roomCode).emit("set_wait_status", true);
      }
      
      callback({ users: usersInRoom });
    });

    socket.on("start_private_game", () => {
      socket.to(socket.roomCode).emit("private_game_started");
    });
    
    socket.on("join_public_game", async (callback) => {
      let roomCode = "public";
      socket.roomCode = roomCode;
      await addUserToRoom(socket.username, roomCode);

      socket.join(roomCode);
      console.log(`User with ID: ${socket.id} ${socket.username} joined the public room (${roomCode})`);

      let usersInRoom = await getUsersInRoom(roomCode);
      
      if (usersInRoom.length >= 2) {
        io.to(socket.roomCode).emit("set_wait_status", false);

        socket.to(roomCode).emit("user_joined", usersInRoom);
        socket.to(roomCode).emit("receive_message", { author: socket.username, message: "JOINED THE GAME" });

      } else {
        io.to(socket.roomCode).emit("set_wait_status", true);
      }

      callback({ users: usersInRoom });
    });

    socket.on("send_message", (data) => {
      socket.to(socket.roomCode).emit("receive_message", data);
    });

    socket.on("drawing", (data) => {
      socket.to(socket.roomCode).emit("live_drawing", data.socketData);
    });

    socket.on("disconnect", async () => {
      if (socket.roomCode) {
        let usersInRoom = await removeUserFromRoom(socket.roomCode, socket.username);
        await deleteRoomIfEmpty(socket.roomCode);
  
        socket.to(socket.roomCode).emit("user_disconnected", usersInRoom);
        socket.to(socket.roomCode).emit("receive_message", { author: socket.username, message: "LEFT THE GAME" });

        if (usersInRoom.length === 1) {
          socket.to(socket.roomCode).emit("set_wait_status", true);
        }
      }
    });
  });
}

module.exports = {
  listen
}