# Crazy Picasso

## Team Members
1. Aaron Jacob Tan
2. Hyun Woo (Eddie) Shin

## Description Of The Web Application
---
Crazy Picasso is a web-based multiplayer drawing and guessing game. A player may join a public room to play with random players, or create or join a private room. For each timed round of the game, one player will draw their chosen word and the rest of the players will guess what the word is. Guessing points are awarded based on how fast a player is able to successfully guess the word. Also, at the end of every round, guessers will be given some time to judge the drawing to give the drawer drawing points if they believe the drawing was creative and awesome. Both guessing points and and drawing points will be used to determine the ranking of the players in the app.

## 3+ Concepts Used For The Challenge Factor, And How Each Concept Will Be Applied
---
- Real-time interactions

    “Guessers” will be able to see what the “drawer” is drawing and will be able to enter their word guesses in real-time

- WebRTC - Video call
    
    Players can turn on their voice and video while playing the game to have real-time communication with other players. 

- OAuth 2.0 Client
    
    New users can sign up with their Google or Facebook accounts. 

- Non-trivial frontend
    
    We are going to use JavaScript animation libraries to implement the frontend UI of the app. 

## List The Key Features That Would Be Completed By The Beta Version
---
- Players can create private rooms
- Players can join private and public rooms
- Real time drawing (only current drawer can draw) and guessing by chatting
- Generate random words that players will be able to select to draw

## List the additional features that would be completed by the final version
---
- Scoring - handling user guesses, time surpassed until correct guess
- Login and Register
- Webhooks - broadcast to a player’s discord server whenever they start a   private room and when they leave the game
- OAuth 2.0
- Players can modify their user profiles

## Describe the tech stack that would be used to build the application 
---
- Frontend Framework: React
- Backend: ExpressJS & NodeJs
- Database: MongoDB

## Libraries / Middleware: 
---
<u>Backend</u>
- Socket.io – for real time, bi-directional communication between web-clients and the server. This will be used to achieve real-time drawing and guessing.
- Passport.js – middleware for authentication and authorization
- Redis - 

<u>Frontend</u>
- Material-UI – library of React components
- Two.js - 
- Konva.js

## Describe The Method Of Deployment 
---
- Amazon Lightsail