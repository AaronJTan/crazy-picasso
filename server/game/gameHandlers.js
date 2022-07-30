const uuidGenerator = require('short-uuid');
const roomObj = require("../models/RoomActions");

function createGameHandlers(io) {
  let module = {};

  module.createPrivateRoom = async function (callback) {
    const socket = this;

    let roomCode = uuidGenerator.generate();
    socket.roomCode = roomCode;
    await roomObj.addUserToRoom(socket.username, roomCode);

    socket.join(roomCode);
    console.log(`User with ID: ${socket.id} ${socket.username} joined the private room (${roomCode})`);

    let usersInRoom = await roomObj.getUsersInRoom(roomCode);

    callback({ users: usersInRoom, roomCode });
  }

  module.joinPrivateRoom = async function (data, callback) {
    const socket = this;

    let roomCode = data.privateRoomCode;
    socket.roomCode = roomCode;
    await roomObj.addUserToRoom(socket.username, roomCode);

    socket.join(roomCode);
    console.log(`User with ID: ${socket.id} ${socket.username} joined the private room (${roomCode})`);

    let room = await roomObj.getRoom(roomCode);
    let usersInRoom = room.users;

    if (!room.game.hasStarted) {
      socket.to(roomCode).emit("user_joined_private_room", usersInRoom);
      // socket.to(roomCode).emit("receive_message", { author: socket.username, message: "JOINED THE GAME" });
      callback({ users: usersInRoom, roomCode });
    } else {
      callback({ users: usersInRoom, roomCode, gameStarted: true });
    }


  }

  module.joinPrivateGame = async function (callback) {
    const socket = this;

    let usersInRoom = await roomObj.getUsersInRoom(socket.roomCode);
    
    if (usersInRoom.length >= 2) {
      io.to(socket.roomCode).emit("set_wait_status", false);
      
      socket.to(socket.roomCode).emit("user_joined", usersInRoom);
      socket.to(socket.roomCode).emit("receive_message", { author: socket.username, message: "JOINED THE GAME" });
    } else {
      io.to(socket.roomCode).emit("set_wait_status", true);
    }
    
    callback({ users: usersInRoom });
  }

  module.startPrivateGame = async function () {
    const socket = this;

    await roomObj.setGameStarted(socket.roomCode, true);

    socket.to(socket.roomCode).emit("private_game_started");
  }

  module.joinPublicGame = async function (callback) {
    const socket = this;

    let roomCode = "public";
    socket.roomCode = roomCode;
    await roomObj.addUserToRoom(socket.username, roomCode);

    socket.join(roomCode);
    console.log(`User with ID: ${socket.id} ${socket.username} joined the public room (${roomCode})`);

    let usersInRoom = await roomObj.getUsersInRoom(roomCode);
    
    if (usersInRoom.length >= 2) {
      io.to(socket.roomCode).emit("set_wait_status", false);

      socket.to(roomCode).emit("user_joined", usersInRoom);
      socket.to(roomCode).emit("receive_message", { author: socket.username, message: "JOINED THE GAME" });

    } else {
      io.to(socket.roomCode).emit("set_wait_status", true);
    }

    callback({ users: usersInRoom });
  }

  module.sendMessage = function (data) {
    const socket = this;

    socket.to(socket.roomCode).emit("receive_message", data);
  }

  module.drawing = function (data) {
    const socket = this;

    socket.to(socket.roomCode).emit("live_drawing", data.socketData);
  }

  module.disconnect = async function () {
    const socket = this;

    if (socket.roomCode) {
      let usersInRoom = await roomObj.removeUserFromRoom(socket.roomCode, socket.username);
      await roomObj.deleteRoomIfEmpty(socket.roomCode);

      socket.to(socket.roomCode).emit("user_disconnected", usersInRoom);
      socket.to(socket.roomCode).emit("receive_message", { author: socket.username, message: "LEFT THE GAME" });

      if (usersInRoom.length === 1) {
        socket.to(socket.roomCode).emit("set_wait_status", true);
      }
    }
  }

  return module;
}

module.exports = createGameHandlers;