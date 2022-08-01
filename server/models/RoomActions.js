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

const addUserToRoom = async (socketId, username, roomCode) => {
  let room = await RoomModel.findOne({ roomCode });
  let user = {socketId, username};
  
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




const generalUpdateHelper = async (query, updateVal) => {
  await RoomModel.findOneAndUpdate(
    query,
    { $set: updateVal },
    { safe: true, multi: false, new: true }
  );
}

const getGameStartedStatus = async (roomCode) => {
  let room = await RoomModel.findOne({ roomCode }).lean();
  let hasStarted = room.game.hasStarted;

  return hasStarted;
}

const getTurnUser = async (roomCode) => {
  const room = await getRoom(roomCode);
  const users = room.users;
  let currentDrawerIndex = room.game.currentDrawerIndex;

  if (currentDrawerIndex === users.length - 1) {
    currentDrawerIndex = 0;
  } else {
    currentDrawerIndex ++;
  }

  await generalUpdateHelper({roomCode}, { 'game.currentDrawerIndex': currentDrawerIndex })

  return users[currentDrawerIndex];
}

const setGameCurrentWordToDraw = async (roomCode, wordToDraw) => {
  await generalUpdateHelper({roomCode}, { 'game.currentWord': wordToDraw })
}

const getUserByUsername = async (roomCode, username) => {
  const userInListFormat = await RoomModel.findOne({ roomCode, "users.username": username }, "-_id users.$").lean();
  const user = userInListFormat.users[0];

  return user;
}

const handleUserGuess = async (roomCode, currentGuessData) => {
  const room = await getRoom(roomCode);
  const currentDrawerIndex = room.game.currentDrawerIndex;
  const drawer = room.users[currentDrawerIndex];
  const currentWord = room.game.currentWord.toLowerCase();

  if (currentGuessData.author === drawer.username) {
    return "IS_DRAWER";
  }

  const user = await getUserByUsername(roomCode, currentGuessData.author);
  
  if (user.madeCorrectGuess) {
    return "ALREADY_GUESSED_CORRECTLY";
  }

  if (currentGuessData.guess.toLowerCase() === currentWord) {
    let updatedScore = user.score + 50; // set score based on time later
    const query = {roomCode, "users.username": user.username};
    const updateValues = { "users.$.madeCorrectGuess": true, "users.$.score": updatedScore };
    generalUpdateHelper(query, updateValues);

    return "CORRECT_GUESS";
  }  
}

const getSocketsAlreadyGuessed = async (guesserUsername, roomCode) => {
  let usersInRoom = await getUsersInRoom(roomCode);

  let filteredUsers = usersInRoom.filter((user) => {
      return user.madeCorrectGuess && user.username != guesserUsername;
  })

  let socketIds = filteredUsers.map((user) => {
      return user.socketId;
  })

  return socketIds;

}

module.exports = {
  getRoom,
  setGameStarted,
  addUserToRoom,
  getUsersInRoom,
  removeUserFromRoom,
  deleteRoomIfEmpty,

  getGameStartedStatus,
  getTurnUser,
  setGameCurrentWordToDraw,

  handleUserGuess,
  getSocketsAlreadyGuessed
}