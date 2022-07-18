const Player = require("../models/playerModel");
const bcrypt = require("bcrypt");

const signupPlayer = async (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
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
    username,
    email,
    password: saltedhash,
  });

  if (newPlayer) {
    req.session.username = newPlayer.username;
    req.session.email = newPlayer.email;
    res.status(200).json({
      _id: newPlayer.id,
      firstName: newPlayer.firstName,
      lastName: newPlayer.lastName,
      username: newPlayer.username,
      email: newPlayer.email,
    });
  } else {
    res.status(400).json({ error: "problem with creating customer (invalid customer data)" });
  }
};

const signinPlayer = async (req, res) => {
  console.log("signinPlayer");

  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ error: "missing inputs" });
  }

  const player = await Player.findOne({ username });

  if (player && (await bcrypt.compare(password, player.password))) {
    res.status(200).json({
      _id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      username: player.username,
    });
  } else {
    res.status(400).json({ error: "login failed, invalid username or password" });
  }
};

const logoutPlayer = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}

module.exports = {
  signupPlayer,
  signinPlayer,
  logoutPlayer
};
