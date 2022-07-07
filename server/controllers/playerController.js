const Player = require("../models/playerModel");
const bcrypt = require("bcrypt");

const signupPlayer = async (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "missing inputs" });
  }

  const playerExist = await Player.findOne({ email });

  if (playerExist) return res.status(400).json({ error: "an account already exists" });

  const salt = await bcrypt.genSalt(10);
  const saltedhash = await bcrypt.hash(password, salt);

  const newPlayer = await Player.create({
    firstName,
    lastName,
    email,
    password: saltedhash,
  });

  if (newPlayer) {
    res.status(200).json({
      _id: newPlayer.id,
      firstName: newPlayer.firstName,
      lastName: newPlayer.lastName,
      email: newPlayer.email,
    });
  } else {
    res.status(400).json({ error: "problem with creating customer (invalid customer data)" });
  }
};

const signinPlayer = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    res.status(400).json({ error: "missing inputs" });
  }

  const player = await Player.findOne({ email });

  if (player && (await bcrypt.compare(password, player.password))) {
    res.status(200).json({
      _id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      email: player.email,
    });
  } else {
    res.status(400).json({ error: "login failed, invalid email or password" });
  }
};

module.exports = {
  signupPlayer,
  signinPlayer,
};
