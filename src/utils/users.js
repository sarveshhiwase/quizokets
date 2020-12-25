const users = [];

const addUser = ({ id, username, room, score, avatar }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and Room is required",
    };
  }

  if (getUsersinRoom(room).length > 6) {
    return {
      error: "Max Limit reached of 7 Players",
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

  const user = { id, username, room, score, avatar };
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

const winner = (room) => {
  const DescUsers = getUsersinRoom(room).sort((a, b) => b.score - a.score);
  const firstUser = DescUsers[0];
  const duplicatesScores = DescUsers.filter(
    (el) => el.score === firstUser.score
  );
  if (duplicatesScores.length > 1) {
    return "Tied";
  }
  return firstUser.username + " Won!";
};

const getAvatar = (room) => {
  room = room.toLowerCase();
  const imageArr = [
    "001-monster-3.svg",
    "002-native-1.svg",
    "003-cupid.svg",
    "004-werewolf.svg",
    "005-alien.svg",
    "010-frankenstein.svg",
    "011-death.svg",
  ];
  let randNo = Math.floor(Math.random() * imageArr.length);
  const users = getUsersinRoom(room);

  if (users.length === 0) {
    return imageArr[randNo];
  }
  users.forEach((ele) => {
    if (imageArr.includes(ele.avatar)) {
      const avatarIndex = imageArr.findIndex((el) => el === ele.avatar);
      imageArr.splice(avatarIndex, 1);
    }
  });

  randNo = Math.floor(Math.random() * imageArr.length);
  return imageArr[randNo];
};

module.exports = {
  getUser,
  updateUser,
  getUsersinRoom,
  addUser,
  removeUser,
  privelgedUser,
  winner,
  getAvatar,
};
