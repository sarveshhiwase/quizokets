const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/messages");
const {
  getUser,
  updateUser,
  getUsersinRoom,
  removeUser,
  addUser,
  privelgedUser,
} = require("./utils/users");
const getQuestions = require("./utils/quizgen");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const cl = console.log;

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
cl(publicDirectoryPath);

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  //   socket.emit("message", generateMessage("Welcome!"));
  //   socket.broadcast.emit("message", generateMessage("A new user has joined!"));

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      username,
      room,
      score: 0,
    });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    // Start Game Button Event (lobby)
    if (getUsersinRoom(user.room).length > 1) {
      const privuser = privelgedUser(user.room);
      io.to(privuser.id).emit("start-game");
    }

    //socket.emit("message", generateMessage("Admin", "Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("Admin", `${user.username} has joined!`)
      );
    io.to(user.room).emit("roomInfo", {
      room: user.room,
      users: getUsersinRoom(user.room),
    });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }

    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });

  // socket.on("sendLocation", (coords, callback) => {
  //   const user = getUser(socket.id);
  //   io.to(user.room).emit(
  //     "locationMessage",
  //     generateLocationMessage(
  //       user.username,
  //       `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
  //     )
  //   );
  //   callback();
  // });

  socket.on("quizstart", async () => {
    const user = getUser(socket.id);
    const questions = await getQuestions();
    io.to(user.room).emit("gamestarted", questions);
  });

  socket.on("indexhaschanged", (ind) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("nextquestion", ind);
    }
  });

  socket.on("scorehaschanged", (score) => {
    const user = updateUser(socket.id, score);
    io.to(user.room).emit("roomInfo", {
      room: user.room,
      users: getUsersinRoom(user.room),
    });
  });

  socket.on("buzzer", () => {
    const user = getUser(socket.id);
    io.to(user.room).emit("buzzerPressed");
    io.to(user.id).emit("buzzerEnable");
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left!`)
      );
      io.to(user.room).emit("roomInfo", {
        room: user.room,
        users: getUsersinRoom(user.room),
      });
      // Start Game Button Event (lobby)
      if (getUsersinRoom(user.room).length > 1) {
        const privuser = privelgedUser(user.room);
        io.to(privuser.id).emit("start-game");
      }
      if (getUsersinRoom(user.room).length == 1) {
        io.to(user.room).emit("restartlobby");
      }
    }
  });

  //new event for quiz game
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
