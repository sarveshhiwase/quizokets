const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
//const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates

const messageTemplate = document.querySelector("#message-template").innerHTML;
// const locationMessageTemplate = document.querySelector(
//   "#location-message-template"
// ).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
const lobbyTemplate = document.querySelector("#lobby-template").innerHTML;
const lobbyDiv = document.getElementById("lobby");
const maingameDiv = document.getElementById("main-game");

//Start Game Button
const startbtn = document.getElementById("start");

//Qs Search Query Parsing
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  const $newMessage = $messages.lastElementChild;

  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = $messages.offsetHeight;

  const containerHeight = $messages.scrollHeight;

  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

// socket.on("locationMessage", (message) => {
//   console.log(message);
//   const html = Mustache.render(locationMessageTemplate, {
//     username: message.username,
//     url: message.url,
//     createdAt: moment(message.createdAt).format("h:mm a"),
//   });
//   $messages.insertAdjacentHTML("beforeend", html);
//   autoscroll();
// });

socket.on("roomInfo", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});
socket.on("roomInfo", ({ room, users }) => {
  const html = Mustache.render(lobbyTemplate, {
    room,
    users,
  });
  document.querySelector(".lobbylist").innerHTML = html;
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log("Message delivered!");
  });
});

// $sendLocationButton.addEventListener("click", () => {
//   if (!navigator.geolocation) {
//     return alert("Geolocation is not supported by your browser.");
//   }

//   $sendLocationButton.setAttribute("disabled", "disabled");

//   navigator.geolocation.getCurrentPosition((position) => {
//     socket.emit(
//       "sendLocation",
//       {
//         latitude: position.coords.latitude,
//         longitude: position.coords.longitude,
//       },
//       () => {
//         $sendLocationButton.removeAttribute("disabled");
//         console.log("Location shared!");
//       }
//     );
//   });
// });

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

/**Our New Work
 */
socket.on("start-game", () => {
  startbtn.removeAttribute("disabled");
  document.getElementById("QueDiv").removeAttribute("hidden");
  document.getElementById("TimeDiv").removeAttribute("hidden");
  document.getElementById("categoryDiv").removeAttribute("hidden");
});

startbtn.addEventListener("click", () => {
  const questionlimit = document.getElementById("limit");
  const timelimit = document.getElementById("timelimit");
  const category = document.getElementById("category");
  const categoryValue = category.options[category.selectedIndex].value;
  const value = questionlimit.options[questionlimit.selectedIndex].value;
  const timerCount = parseInt(timelimit.options[timelimit.selectedIndex].value);
  socket.emit("quizstart", value, timerCount, categoryValue);
});

function renderLogic() {
  lobbyDiv.style.display = "none";
  maingameDiv.style.display = "block";
}

socket.on("restartlobby", () => {
  location.reload();
});
