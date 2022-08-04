# Crazy Picasso

## Project URL

http://crazypicasso.me

## Youtube Demo URL

https://youtu.be/C1bTk5BwFIs

## Team members

1. Aaron Jacob Tan
2. Hyun Woo (Eddie) Shin

## Description of the web application

Crazy Picasso is a web-based multiplayer drawing and guessing game. Once players create accounts and log into the app, they can join public rooms to play with random players or create/join private rooms to play with friends. For each timed round of the game, one of the players draws a chosen word and the rest of the players guess what the word is. Guessing points are awarded based on how fast players guess the word successfully within the time, and the first player who guesses the word correctly would be awarded the largest guessing point. Also, at the end of every round, guessers will be given some time to judge the drawing to give the drawer drawing points if they believe the drawing was creative and awesome. Both guessing points and and drawing points will be used to determine the ranking of the players in the app.

## The challenging factors used for the project and how they will be applied

### Real-time interactions

The main feature of Crazy Picasso is to interact the guessing game in real-time. The guessers will be able to see what the drawer is drawing on the canvas and guessers will be able to enter their word guesses in real-time on the chat. On top of the chat feature, players will also be able to turn on their voice and video while playing the game to have face-to-face real-time communication with other players if they want.

### OAuth 2.0 Client

New users can sign up the app with their Google or Facebook accounts and send messages to their friends to invite them to join a private room. As we build user accounts data in our database, we will be able to compute the rankings of the players in the app, keep track of the scores of the players in previous games, and use contact information about the users to send out promotional emails or offers to attract more users into the app.

### Non-trivial frontend

We are going to use several 2D animation libraries in JavaScript to implement the frontend UI of the app. Using animation libraries will enhance the experience of users interacting with the app. 

### Web Worker

We can use Web Worker to send welcome emails after new users are registered to the app. Also, web workers can handle non-primary tasks such as resetting password or sending out new updates of the app in background threads, not affecting the performance of the main thread.

## Key features that would be completed by the beta version

- Players can create new accounts by signing up to the app.
- Players can sign in with their account credentials.
- Players can join public rooms. 
- Players can create private rooms or join existing private rooms.
- Players can draw on the canvas real time and other players can see the drawing real time.
- Players can type in word guesses in the real time chat.
- Drawers can select a word from randomly generated words.
- Basic UIs and layouts are implemented with full functionalities. 

## Additional features that would be completed by the final version

- Different scores are awarded to the guessers based on the order of correct guesses.
- After players sign in, they can see their profiles and manage friends list.
- With Webhook, the app broadcasts to players' discord servers whenever they start a new private room or when they leave the game.
- The app fully functions with OAuth 2.0.
- Players can turn on their voice and video using WebRTC.
- The UI of the app are improved with animation libraries.

## Tech stack that would be used to build the application

We will use MERN stack to build the application.

- Frontend: React
- Backend: Express.js & Node.js
- Database: MongoDB

## Libraries / Middleware

### Frontend

- Material UI: library of React components
- Two.js: frontend API for creating 2D shapes
- Konva.js: HTML5 2d canvas js library
- Ani.js: declarative handling library for CSS animations

### Backend

- Socket.io: establishes bi-directional communication between web-clients and the server for real time.
- Passport.js: middleware for authentication and authorization
- Redis: in-memory data structure store which will be used as a database, cache, and message broker.

## Method of deployment 

- We will be deploying our container web application on **Amazon Lightsail**.
- Nginx will be our reverse proxy.
- Docker images: Nginx, Express Backend Image, React Frontend Image, MongoDB Image
- Our Docker images will be deployed into an Amazon Lightsail container service to be able to run on AWS infrastructure.
    

