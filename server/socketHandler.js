const users = [];

const User = (function() {
  return function User(username, roomCode) {
    this.username = username;
    this.roomCode = roomCode;
  }
})();

const addUserToUsersList = (io, username) => {
  let user = new User(username, "public");
  users.push(user);

}

const deleteUserFromList = (username) => {
  let index = users.findIndex((userObj) => {
    return userObj.username === username;
  })

  users.splice(index, 1);
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
      addUserToUsersList(io, socket.username);

      let roomCode = "public";
      socket.join(roomCode);
      console.log(`User with ID: ${socket.id} ${socket.username} joined the public room (${roomCode})`);
      
      socket.to(roomCode).emit("user_joined", users);
      socket.to(roomCode).emit("receive_message", { author: socket.username, message: "JOINED THE GAME" });

      callback({ users: users });
    });

    socket.on("send_message", (data) => {
      let roomCode = "public";
      socket.to(roomCode).emit("receive_message", data);
    });

    socket.on("drawing", (data) => {
      let roomCode = "public";
      socket.to(roomCode).emit("live_drawing", data.socketData);
    });

    socket.on("disconnect", () => {
      let roomCode = "public";
      deleteUserFromList(socket.username);

      socket.to(roomCode).emit("user_disconnected", users);
      socket.to(roomCode).emit("receive_message", { author: socket.username, message: "LEFT THE GAME" });
    });
  });
}

module.exports = {
  listen
}