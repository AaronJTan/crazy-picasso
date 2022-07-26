const users = [];

const addUserToUsersList = (io, username) => {
  // looping over the io.of("/").sockets object,
  // a map of all currently connected socket instances indexed by ID
  for (let [id, socket] of io.of("/").sockets) {
    if (!users.includes(username)) {
      users.push(username);
    }
  }
}

const deleteUserFromList = (username) => {
  let index = users.findIndex((user) => {
    return user === username;
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
    addUserToUsersList(io, socket.username);

    socket.broadcast.emit("user_joined", users);
    socket.to("public").emit("receive_message", { roomCode: "public", author: socket.username, message: "JOINED THE GAME" });

    socket.on("join_public_room", (data, callback) => {
      socket.join(data.roomCode);
      console.log(`User with ID: ${socket.id} ${socket.username} joined the public room`);

      callback({ users: users });
    });

    socket.on("send_message", (data) => {
      socket.to(data.roomCode).emit("receive_message", data);
    });

    socket.on("drawing", (data) => {
      socket.broadcast.emit("live_drawing", data);
    });

    socket.on("disconnect", () => {
      deleteUserFromList(socket.username);

      socket.broadcast.emit("user_disconnected", users);
      socket.to("public").emit("receive_message", { roomCode: "public", author: socket.username, message: "LEFT THE GAME" });
    });
  });
}

module.exports = {
  listen
}