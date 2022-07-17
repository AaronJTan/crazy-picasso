const PrivateRoom = require("../models/privateRoomModel");

const createPrivateRoom = async (req, res) => {

  console.log("saving private room");

  const roomCode = req.body.roomCode;

  console.log(roomCode);

  if (!roomCode) {
    return res.status(400).json({ error: "missing inputs" });
  }

  const roomExists = await PrivateRoom.findOne({ roomCode });

  if (roomExists) return res.status(400).json({ error: "an account already exists" });

  const newRoom = await PrivateRoom.create({
    roomCode
  });

  if (newRoom) {
    res.status(200).json({
      _id: newRoom.id,
      roomCode: newRoom.roomCode,
    });
  } else {
    res.status(400).json({ error: "problem with creating private room" });
  }
}

const joinPrivateRoom = async (req, res) => {
  console.log("loading private room code");

  const roomCode = req.body.roomCode;

  console.log(roomCode);

  if (!roomCode) {
    return res.status(400).json({ error: "missing inputs" });
  }

  const roomExists = await PrivateRoom.findOne({ roomCode });

  if (roomExists) return res.status(200).json({ msg: "private room found" });
  else return res.status(404).json({error: "private room not found"});


}

module.exports = {
  createPrivateRoom,
  joinPrivateRoom
};