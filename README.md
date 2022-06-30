# Crazy Picasso

## Team Members

1. Aaron Jacob Tan
2. Hyun Woo (Eddie) Shin

## Description Of The Web Application

Crazy Picasso is a web-based multiplayer drawing and guessing game. Once players create accounts and log into the app, they can join public rooms to play with random players or create/join private rooms to play with friends. For each timed round of the game, one of the players draws a chosen word and the rest of the players guess what the word is. Guessing points are awarded based on how fast players guess the word successfully within the time, and the first player who guesses the word correctly would be awarded the largest guessing point. Also, at the end of every round, guessers will be given some time to judge the drawing to give the drawer drawing points if they believe the drawing was creative and awesome. Both guessing points and and drawing points will be used to determine the ranking of the players in the app.

## The Challenging Factors Used For The Project And How Each Factor Will Be Applied

- Real-time interactions

The main feature of Crazy Picasso is to interact the guessing game in real-time. The guessers will be able to see what the drawer is drawing on the canvas and guessers will be able to enter their word guesses in real-time on the chat. On top of the chat feature, players will also be able to turn on their voice and video while playing the game to have face-to-face real-time communication with other players if they want.

- OAuth 2.0 Client

New users can sign up the app with their Google or Facebook accounts and send messages to their friends to invite them to join a private room. As we build user accounts data in our database, we will be able to compute the rankings of the players in the app, keep track of the scores of the players in previous games, and use contact information about the users to send out promotional emails or offers to attract more users into the app.

- Non-trivial frontend

We are going to use several 2D animation libraries in JavaScript to implement the frontend UI of the app. Using animation libraries will enhance the experience of users interacting with the app. 

- Web Worker

We can use Web Worker to send welcome emails after new users are registered to the app. Also, web workers can handle non-primary tasks in background threads, not affecting the performance of the main thread.

## Key Features That Would Be Completed By The Beta Version

- Players can join public rooms. 
- Players can create private rooms or join existing private rooms.
- Real time drawing (only current drawer can draw) and guessing by chatting
- Generate random words that players will be able to select to draw

## List the additional features that would be completed by the final version
- Scoring - handling user guesses, time surpassed until correct guess
- Login and Register
- Webhooks - broadcast to a player’s discord server whenever they start a   private room and when they leave the game
- OAuth 2.0
- Players can modify their user profiles
- Video vall
- UI Animations

## Describe the tech stack that would be used to build the application 
- Frontend Framework: React
- Backend: ExpressJS & NodeJs
- Database: MongoDB

## Libraries / Middleware: 
<u>Backend</u>
- Socket.io – for real time, bi-directional communication between web-clients and the server. This will be used to achieve real-time drawing and guessing.
- Passport.js – middleware for authentication and authorization
- Redis - for caching

<u>Frontend</u>
- Material-UI – library of React components
- Two.js - api for creating 2D shapes
- Konva.js - HTML5 2d canvas js library

## Describe The Method Of Deployment 
- We will be deploying our container web application on **Amazon Lightsail**.
- Nginx will be our reverse proxy.
- Docker images - Nginx, Express Backend Image, React Frontend Image, MongoDB Image
- Our Docker images will be deployed into an Amazon Lightsail container service to be able to run on AWS infrastructure.
    

