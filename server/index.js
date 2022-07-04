const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb://mongo:27017/crazy-picasso_backend',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('MongoDB Connected')
  })
  .catch(err => {
    console.log(err)
  });

app.use(function(req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.get("/", function(req, res, next) {
  res.json("HELLO");
  next();
});

const Item = require('./src/models/Item');

app.get('/item', (req, res) => {
  Item.find()
    .then(items => res.json({items}))
    .catch(err => res.status(404).json({ msg: 'No items found' }));
});

app.post('/item/add', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });

  newItem.save().then(item => res.json({item}));
});

const http = require("http");
const PORT = 5000;

http.createServer(app).listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
