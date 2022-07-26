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
    
    socket.on("join_public_room", (callback) => {
      let roomCode = "public";
      socket.roomCode = roomCode;
      addUserToRoom(socket.username, roomCode);

      socket.join(roomCode);
      console.log(`User with ID: ${socket.id} ${socket.username} joined the public room (${roomCode})`);
      
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
      let usersInRoom = removeUserFromRoom(socket.roomCode, socket.username);

      socket.to(socket.roomCode).emit("user_disconnected", usersInRoom);
      socket.to(socket.roomCode).emit("receive_message", { author: socket.username, message: "LEFT THE GAME" });
    });
  });
}

module.exports = {
  listen
}