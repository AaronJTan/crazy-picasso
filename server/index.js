const express = require("express");
const app = express();

/* ------------------------------CONNECT DATABASE------------------------------*/
const mongoose = require('mongoose');

mongoose
  .connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('MongoDB Connected')
  })
  .catch(err => {
    console.log(err)
  });

/* ------------------------------MIDDLEWARES------------------------------*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function(req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

/* ------------------------------ROUTES------------------------------*/
/* Temporary*/
app.get("/", function(req, res, next) {
  res.json("HELLO");
  next();
});

/* ------------------------------INITIALIZE SERVER------------------------------*/
const http = require("http");
const PORT = 5000;

http.createServer(app).listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
