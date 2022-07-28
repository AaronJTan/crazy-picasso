const uuidGenerator = require('short-uuid');
const users = new Map();

const User = (function() {
  return function User(username, roomCode) {
    this.username = username;
    this.roomCode = roomCode;
  }
})();

const addUserToRoom = (username, roomCode) => {
  let user = new User(username, roomCode);
  
  if (!users.has(roomCode)) {
    users.set(roomCode, [user]);
  } else {
    let usersInRoom = users.get(roomCode);
    usersInRoom.push(user);
  }
}

const getUsersInRoom = (roomCode) => {
  let usersInRoom = users.get(roomCode);

  return usersInRoom;
}

const removeUserFromRoom = (roomCode, username) => {
  let usersInRoom = users.get(roomCode);
  
  let index = usersInRoom.findIndex((userObj) => {
    return userObj.username === username;
  })

  usersInRoom.splice(index, 1);

  return usersInRoom;
}

const deleteRoomIfEmpty = (roomCode) => {
  if (getUsersInRoom(roomCode).length == 0) {
    users.delete(roomCode);
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

    socket.on("create_private_room", (callback) => {
      let roomCode = uuidGenerator.generate();
      socket.roomCode = roomCode;
      addUserToRoom(socket.username, roomCode);

      socket.join(roomCode);
      console.log(`User with ID: ${socket.id} ${socket.username} joined the private room (${roomCode})`);
      console.log(users);

      let usersInRoom = getUsersInRoom(roomCode);

      callback({ users: usersInRoom, roomCode });
    });

    socket.on("join_private_room", (data, callback) => {
      let roomCode = data.privateRoomCode;
      socket.roomCode = roomCode;
      addUserToRoom(socket.username, roomCode);

      socket.join(roomCode);
      console.log(`User with ID: ${socket.id} ${socket.username} joined the private room (${roomCode})`);
      console.log(users);

      let usersInRoom = getUsersInRoom(roomCode);
      socket.to(roomCode).emit("user_joined_private_room", usersInRoom);
      // socket.to(roomCode).emit("receive_message", { author: socket.username, message: "JOINED THE GAME" });

      callback({ users: usersInRoom, roomCode });
    });

    socket.on("join_private_game", (callback) => {
      let usersInRoom = getUsersInRoom(socket.roomCode);
      socket.to(socket.roomCode).emit("receive_message", { author: socket.username, message: "JOINED THE GAME" });
      
      callback({ users: usersInRoom });
    });

    socket.on("start_private_game", () => {
      socket.to(socket.roomCode).emit("private_game_started");
    });
    
    socket.on("join_public_game", (callback) => {
      let roomCode = "public";
      socket.roomCode = roomCode;
      addUserToRoom(socket.username, roomCode);

      socket.join(roomCode);
      console.log(`User with ID: ${socket.id} ${socket.username} joined the public room (${roomCode})`);
      console.log(users);

      let usersInRoom = getUsersInRoom(roomCode);
      socket.to(roomCode).emit("user_joined", usersInRoom);
      socket.to(roomCode).emit("receive_message", { author: socket.username, message: "JOINED THE GAME" });

      callback({ users: usersInRoom });
    });

    socket.on("send_message", (data) => {
      socket.to(socket.roomCode).emit("receive_message", data);
    });

    socket.on("drawing", (data) => {
      socket.to(socket.roomCode).emit("live_drawing", data.socketData);
    });

    socket.on("disconnect", () => {
      if (socket.roomCode) {
        let usersInRoom = removeUserFromRoom(socket.roomCode, socket.username);
        deleteRoomIfEmpty(socket.roomCode);
  
        socket.to(socket.roomCode).emit("user_disconnected", usersInRoom);
        socket.to(socket.roomCode).emit("receive_message", { author: socket.username, message: "LEFT THE GAME" });
      }
    });
  });
}

module.exports = {
  listen
}