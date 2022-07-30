const uuidGenerator = require('short-uuid');

function gameHandlers(addUserToRoom, getUsersInRoom, removeUserFromRoom, deleteRoomIfEmpty) {
  let module = {};

  module.createPrivateRoom = async function (callback) {
    const socket = this;

    let roomCode = uuidGenerator.generate();
    socket.roomCode = roomCode;
    await addUserToRoom(socket.username, roomCode);

    socket.join(roomCode);
    console.log(`User with ID: ${socket.id} ${socket.username} joined the private room (${roomCode})`);

    let usersInRoom = await getUsersInRoom(roomCode);

    callback({ users: usersInRoom, roomCode });
  }

  return module;
}

module.exports = gameHandlers;