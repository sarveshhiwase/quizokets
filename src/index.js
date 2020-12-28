const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { generateMessage } = require("./utils/messages");
const {
  getUser,
  updateUser,
  getUsersinRoom,
  removeUser,
  addUser,
  privelgedUser,
  winner,
  getAvatar,
} = require("./utils/users");
const getQuestions = require("./utils/quizgen");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      username,
      room,
      score: 0,
      avatar: getAvatar(room),
    });

    if (error) {
      return callback(error);
    }
    if (user) {
      socket.join(user.room);

      if (getUsersinRoom(user.room).length > 1) {
        const privuser = privelgedUser(user.room);
        io.to(privuser.id).emit("start-game");
      }

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
    }
  });

  socket.on("winner", () => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("winnerName", winner(user.room));
    }
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", generateMessage(user.username, message));
      callback();
    }
  });

  socket.on("quizstart", async (limit, timelimit, categoryValue) => {
    const user = getUser(socket.id);
    if (user) {
      const questions = await getQuestions(limit, categoryValue);
      io.to(user.room).emit("gamestarted", questions, timelimit);
    }
  });

  socket.on("indexhaschanged", (ind) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("nextquestion", ind);
    }
  });

  socket.on("scorehaschanged", (score) => {
    const user = updateUser(socket.id, score);
    if (user) {
      io.to(user.room).emit("roomInfo", {
        room: user.room,
        users: getUsersinRoom(user.room).sort((a, b) => b.score - a.score),
      });
    }
  });

  socket.on("correctanswer", (answer) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("correctlobby", user.username);
      io.to(user.room).emit(
        "answermessage",
        generateMessage("Admin", `Correct answer :  ${answer}`)
      );
    }
  });
  socket.on("incorrectanswer", (answer) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("incorrectlobby", user.username);
      io.to(user.room).emit(
        "answermessage",
        generateMessage("Admin", `Correct answer :  ${answer}`)
      );
    }
  });

  socket.on("buzzer", () => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("buzzerPressed", user.username);
      io.to(user.id).emit("buzzerEnable");
    }
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
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
