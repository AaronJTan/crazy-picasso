const uuidGenerator = require('short-uuid');
const roomObj = require("../models/RoomActions");
const wordGenerator = require("./wordGenerator")

function createGameHandlers(io) {
  let module = {};

  const socketJoinRoom = async (socket, roomCode) => {
    socket.roomCode = roomCode;
    await roomObj.addUserToRoom(socket.id, socket.username, roomCode);
  
    socket.join(roomCode);
  }

  const handleNextPlayerToDraw = async (roomCode) => {
    const currentDrawer = await roomObj.getTurnUser(roomCode);
    const choiceOfWords = wordGenerator.getXWords(3);

    io.to(currentDrawer.socketId).emit("select_word_to_draw", {currentDrawerUsername: currentDrawer.username, choiceOfWords});
    io.to(roomCode).except(currentDrawer.socketId).emit("receive_guess", { author: currentDrawer.username, guess: "IS SELECTING A WORD" });
  }

  const sendCurrentTurnData = async (roomCode, socket) => {
    const room = await roomObj.getRoom(roomCode);
    const wordToDraw = room.game.currentWord;
    const currentDrawer = room.game.currentDrawer;

    if (wordToDraw) {
      socket.emit("word_selected", {currentDrawerUsername: currentDrawer.username, wordToDraw});
      socket.emit("receive_guess", { author: socket.username, guess: "IS DRAWING NOW" });
    } else {
      socket.emit("receive_guess", { author: currentDrawer.username, guess: "IS SELECTING A WORD" }); 
    }
  }

  const handleUserJoinedGameEvent = async (socket, usersInRoom) => {
    const roomCode = socket.roomCode;
  
    if (usersInRoom.length >= 2) {
      io.to(roomCode).emit("set_wait_status", false);
      
      socket.to(roomCode).emit("user_joined", usersInRoom);
      socket.to(roomCode).emit("receive_guess", { author: socket.username, guess: "JOINED THE GAME" });

      const gameHasStarted = await roomObj.getGameStartedStatus(socket.roomCode);

      if (!gameHasStarted) {
        await roomObj.setGameStarted(socket.roomCode, true);
        await handleNextPlayerToDraw(roomCode);
      } else {
        await sendCurrentTurnData(roomCode, socket);
      }
    } else {
      io.to(roomCode).emit("set_wait_status", true);
    }
  }

  module.createPrivateRoom = async function (callback) {
    const socket = this;

    let roomCode = uuidGenerator.generate();
    await socketJoinRoom(socket, roomCode);
    console.log(`User with ID: ${socket.id} ${socket.username} joined the private room (${roomCode})`);

    let usersInRoom = await roomObj.getUsersInRoom(roomCode);

    callback({ users: usersInRoom, roomCode });
  }

  module.joinPrivateRoom = async function (data, callback) {
    const socket = this;

    let roomCode = data.privateRoomCode;
    await socketJoinRoom(socket, roomCode);
    console.log(`User with ID: ${socket.id} ${socket.username} joined the private room (${roomCode})`);

    let room = await roomObj.getRoom(roomCode);
    let usersInRoom = room.users;

    if (!room.game.hasStarted) {
      socket.to(roomCode).emit("user_joined_private_room", usersInRoom);

      callback({ users: usersInRoom, roomCode });
    } else {
      callback({ users: usersInRoom, roomCode, gameStarted: true });
    }


  }

  module.joinPrivateGame = async function (callback) {
    const socket = this;

    let usersInRoom = await roomObj.getUsersInRoom(socket.roomCode);
    
    handleUserJoinedGameEvent(socket, usersInRoom);
    
    callback({ users: usersInRoom });
  }

  module.startPrivateGame = async function () {
    const socket = this;

    socket.to(socket.roomCode).emit("private_game_started");
  }

  module.joinPublicGame = async function (callback) {
    const socket = this;

    let roomCode = "public";
    await socketJoinRoom(socket, roomCode);
    console.log(`User with ID: ${socket.id} ${socket.username} joined the public room (${roomCode})`);

    let usersInRoom = await roomObj.getUsersInRoom(roomCode);
    
    handleUserJoinedGameEvent(socket, usersInRoom);

    callback({ users: usersInRoom });
  }

  module.drawerSelectedWord = async function (wordToDraw) {
    const socket = this;

    await roomObj.setGameCurrentWordToDraw(socket.roomCode, wordToDraw);

    io.to(socket.roomCode).emit("word_selected", {currentDrawerUsername: socket.username, wordToDraw});
    socket.to(socket.roomCode).emit("receive_guess", { author: socket.username, guess: "IS DRAWING NOW" });
  }

  module.sendGuess = async function (data) {
    const socket = this;

    const guessStatus = await roomObj.handleUserGuess(socket.roomCode, data);

    if (guessStatus === "IS_DRAWER") {
      return;
    } 
    
    else if (guessStatus === "ALREADY_GUESSED_CORRECTLY") {
      let socketsToNotify = await roomObj.getSocketsAlreadyGuessed(data.author, socket.roomCode);

      if (socketsToNotify.length) {
        io.to(socketsToNotify).emit("receive_guess", data);
      }
    } 
    
    else if (guessStatus === "CORRECT_GUESS") {
      const messageObj = {author: data.author, guess: "GUESSED THE WORD"};
      io.to(socket.roomCode).emit("receive_guess", messageObj);
    } 
    
    else {
      socket.to(socket.roomCode).emit("receive_guess", data);
    }

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
      socket.to(socket.roomCode).emit("receive_guess", { author: socket.username, guess: "LEFT THE GAME" });

      if (usersInRoom.length === 1) {
        socket.to(socket.roomCode).emit("set_wait_status", true);
      }
    }
  }

  return module;
}

module.exports = createGameHandlers;