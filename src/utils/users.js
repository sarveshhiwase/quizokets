const users = [];

const addUser = ({ id, username, room, score }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and Room is required",
    };
  }

  const userTaken = users.find(
    (user) => user.username === username && user.room === room
  );
  if (userTaken) {
    return {
      error: "Username is in use",
    };
  }

  const user = { id, username, room, score };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    return users.splice(userIndex, 1)[0];
  }
};

const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  return user;
};

const updateUser = (id, score) => {
  const userIndex = users.findIndex((user) => user.id === id);
  users[userIndex].score = score;
  return users[userIndex];
};

const getUsersinRoom = (room) => {
  return users.filter((user) => user.room === room);
};

const privelgedUser = (room) => {
  return users[users.findIndex((user) => user.room === room)];
};

module.exports = {
  getUser,
  updateUser,
  getUsersinRoom,
  addUser,
  removeUser,
  privelgedUser,
};
