const RoomModel = require("./models/Room");
const createGameHandlers = require("./gameHandlers");

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
  const gameHandlers = createGameHandlers(io, addUserToRoom, getUsersInRoom, removeUserFromRoom, deleteRoomIfEmpty);

  // Socket middleware to check the username and allow the connection
  io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    console.log("io middleware username: ", username);
    // username is added as an attribute of socket object which can be reused later
    socket.username = username;
    next();
  });

  io.on("connection", (socket) => {
    socket.on("create_private_room", gameHandlers.createPrivateRoom);
    socket.on("join_private_room", gameHandlers.joinPrivateRoom);
    socket.on("join_private_game", gameHandlers.joinPrivateGame);
    socket.on("start_private_game", gameHandlers.startPrivateGame);
    socket.on("join_public_game", gameHandlers.joinPublicGame);
    socket.on("send_message", gameHandlers.sendMessage);
    socket.on("drawing", gameHandlers.drawing);
    socket.on("disconnect", gameHandlers.disconnect);
  });
}

module.exports = {
  listen
}