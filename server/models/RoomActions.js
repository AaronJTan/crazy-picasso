const RoomModel = require("./schemas/Room");

const getRoom = async (roomCode) => {
  let room = await RoomModel.findOne({ roomCode }).lean();

  return room;
}

const setGameStarted = async (roomCode, hasStarted) => {
  await RoomModel.findOneAndUpdate(
    { roomCode },
    { $set: { 'game.hasStarted': hasStarted } },
    { safe: true, multi: false, new: true }
  ).lean();
}

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

module.exports = {
  getRoom,
  setGameStarted,
  addUserToRoom,
  getUsersInRoom,
  removeUserFromRoom,
  deleteRoomIfEmpty
}