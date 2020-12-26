# Online Quiz Game With Friends

Room Chat Application + Quiz Game with Socket.io, Nodejs and ExpressJS

Clone Like <a href="https://skribbl.io" target="_blank">Skribble.io</a>

## How Everything Works

- Users can create a room or join a existing one .
- Minimum limit for playing is 2 players.
- Once all members are present, priveleged User can Start the Game.
- Quiz Window is shown to all Users and timer is present to give answer for a question in limited time to make game more interesting.
- By Default you cannot answer the question without pressing the buzzer.
- Once the buzzer is pressed, the fastest user who pressed the buzzer gets a chance to answer the question.
- Once answer is submitted, if answer was correct then points are increased and shown in scoreboard.
- After all questions are over players can start all over again.

## Backend

- NodeJS
- ExpressJS
- WebSockets
- Socket.io(npm-package)

## Frontend

- HTML5
- CSS3
- Javascript

## Other Libraries Used

- MomentJS (Date Parsing)
- QS (Query String Parsing)
- Mustache JS (Template Rendering)

## Usage

```
# Install dependencies
npm install

# Run in development
npm run dev

# Run in production
npm start
It will start local server on http://localhost:3000
```

## Contributors

<h5> <a href="https://github.com/sarveshtheabstractor"> Me </a></h5>

<h5> <a href="https://github.com/mayur-jagtap"> Mayur Jagtap </a></h5>

## Issues

- If you found game buggy or can be improved PR's are always welcomed.
