const quiz = document.getElementById("quiz");
const answerEls = document.querySelectorAll(".answer");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submitans");

submitBtn.setAttribute("disabled", "disabled");
const buzzerBtn = document.getElementById("buzzer");
let currentQuiz = 0;
let score = 0;
//Questions for quiz
let quizData = [];
let x;
let timesetUser = 0;

questionEl.classList.add("grayLoad");
answerEls.forEach((answerEl) => {
  answerEl.nextElementSibling.classList.add("grayLoad", "color");
});
socket.on("gamestarted", (questions, tlimit) => {
  loading.style.display = "none";
  quizData = questions;
  renderLogic();
  questionEl.classList.remove("grayLoad");
  answerEls.forEach((answerEl) => {
    answerEl.nextElementSibling.classList.remove("grayLoad", "color");
  });
  timesetUser = parseInt(tlimit);
  loadQuiz(timesetUser);
});

function loadQuiz(tlimit) {
  deselectAnswers();

  const currentQuizData = quizData[currentQuiz];

  questionEl.innerHTML = currentQuizData.question;
  const optionsArray = [
    currentQuizData.a,
    currentQuizData.b,
    currentQuizData.c,
    currentQuizData.d,
  ];

  const elArray = [a_text, b_text, c_text, d_text];

  for (let i = 0; i < 4; i++) {
    const randomNumber = Math.floor(Math.random() * optionsArray.length);

    elArray[i].innerHTML = optionsArray[randomNumber];
    optionsArray.splice(randomNumber, 1);
  }
  timer(tlimit);
}

function getSelected() {
  let answer = undefined;

  answerEls.forEach((answerEl) => {
    if (answerEl.checked) {
      answer = answerEl.nextElementSibling.textContent;
    }
  });

  return answer;
}

function deselectAnswers() {
  answerEls.forEach((answerEl) => {
    answerEl.checked = false;
  });
}

submitBtn.addEventListener("click", () => {
  // check to see the answer
  const answer = getSelected();

  if (answer) {
    if (answer === quizData[currentQuiz].correct) {
      score++;
      socket.emit("correctanswer", quizData[currentQuiz].correct);
    } else {
      socket.emit("incorrectanswer", quizData[currentQuiz].correct);
    }

    currentQuiz++;

    //socket.emit("stopcount");
    socket.emit("indexhaschanged", currentQuiz);
  }
});

socket.on("correctlobby", (name) => {
  document.querySelector("." + name + "-check").style.display = "block";
  setTimeout(() => {
    document.querySelector("." + name + "-check").style.display = "none";
    socket.emit("scorehaschanged", score);
  }, 1000);
});
socket.on("incorrectlobby", (name) => {
  document.querySelector("." + name + "-uncheck").style.display = "block";
  setTimeout(() => {
    document.querySelector("." + name + "-uncheck").style.display = "none";
    socket.emit("scorehaschanged", score);
  }, 1000);
});

buzzerBtn.addEventListener("click", (e) => {
  var bleep = new Audio();
  bleep.src = "https://www.soundjay.com/button/sounds/beep-10.mp3";
  bleep.play();

  socket.emit("buzzer");
});

socket.on("buzzerPressed", (name) => {
  // clearInterval(x);
  // timer(timesetUser);
  disable();
  document.querySelector("." + name + "-buzzer").style.display = "block";
  setTimeout(() => {
    document.querySelector("." + name + "-buzzer").style.display = "none";
  }, 1000);
});

socket.on("buzzerEnable", () => {
  // enable();
  submitBtn.removeAttribute("disabled");
});

socket.on("nextquestion", (ind) => {
  clearInterval(x);
  currentQuiz = ind;
  enable();
  if (currentQuiz < quizData.length) {
    loadQuiz(timesetUser);
  } else {
    clearInterval(x);
    const timerEL = document.getElementById("timer");
    timerEL.innerHTML = "";
    buzzerBtn.style.display = "none";
    setTimeout(() => {
      socket.emit("winner");
    }, 2000);
  }
});

socket.on("winnerName", (username) => {
  quiz.innerHTML = markup(username);
});

function timer(time) {
  x = setInterval(function () {
    time -= 1;

    // Display the result in the element with id="timer"
    document.getElementById("timer").innerHTML = "00:" + timeFormat(time);

    // If the count down is finished, write some text
    if (time <= 0) {
      clearInterval(x);
      document.getElementById("timer").innerHTML = "";
      currentQuiz++;
      socket.emit("indexhaschanged", currentQuiz);
    }
  }, 1000);
}

function enable() {
  buzzerBtn.removeAttribute("disabled");
  // submitBtn.removeAttribute("disabled");
  submitBtn.setAttribute("disabled", "disabled");
}
function disable() {
  buzzerBtn.setAttribute("disabled", "disabled");
  submitBtn.setAttribute("disabled", "disabled");
}

function timeFormat(time) {
  if (time < 10) {
    time = "0" + time;
    return time;
  }

  return time;
}

function markup(username) {
  document.querySelector(".chat").style.alignItems = "center";
  const markup = `
  <div style="text-align: center;">
  <h1>
  ${username}
  </h1>
  </div>
  <div class="dancing-lao">
  <div class="left-dots">
    <div class="dot dot-1"></div>
    <div class="dot dot-2"></div>
    <div class="circle-dot"></div>
  </div>
  <div class="right-dots">
    <div class="dot dot-1"></div>
    <div class="dot dot-2"></div>
    <div class="circle-dot"></div>
  </div>

  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76.13 63.3">
    <title>lao</title>
    <path class="cls-1"
      d="M46.14,41.4A23.09,23.09,0,0,1,31,41.73,1.81,1.81,0,0,0,28.59,43c-.4,1.26.5,1.75,1.43,2.21,2.16,1.05,4.51,1.08,6.82,1.27A21.75,21.75,0,0,0,47.12,45c1-.4,2.27-1,1.55-2.59A1.92,1.92,0,0,0,46.14,41.4Z" />
    <path class="cls-1"
      d="M53.4,25.27c-1.71.07-2.47,1.09-2.51,2.81s.36,3.38,2.44,3.53c1.83.13,2.49-1.17,2.6-2.83C56.05,27,55.6,25.55,53.4,25.27Z" />
    <path class="cls-1"
      d="M23.13,25.94c-1.94-.13-2.48,1.25-2.5,2.94s.25,3.52,2.5,3.47c1.9,0,2.27-1.62,2.35-3.74A2.36,2.36,0,0,0,23.13,25.94Z" />
    <path class="cls-1"
      d="M71.43,37.34c-.12-1.58-.27-3.15-.52-4.7a14.38,14.38,0,0,1,2.74-11.55c3.91-5.39,3.13-8.49-1.79-13a24.82,24.82,0,0,0-8.08-4.8C61.57,2.46,59,2.43,57.66,4A8.91,8.91,0,0,1,51,7.28L44,2a9.47,9.47,0,0,0-12.29.65L26,8c-2.61.16-4.88-.12-7.07-2.4S13.85,3.5,11,4.82A27.18,27.18,0,0,0,2.69,11c-3.09,3.29-3.76,7.21-.75,10.3C6.53,26,6.08,31.44,5.8,37.06c0,.28,0,.56,0,.84a4.46,4.46,0,0,0-.1,8C6.07,53,10,58,17,60.2a57.82,57.82,0,0,0,16.71,3,63.84,63.84,0,0,0,28.67-4.67c6-2.49,9.28-7.32,9.37-13.63a4.65,4.65,0,0,0,2.17-3.63A4.79,4.79,0,0,0,71.43,37.34ZM33.75,4.81c4-3.74,8.38-.48,8.43-.44l3.76,2.85h-.55c-4.85-.08-9.73,0-14.57.36ZM8.54,44.63l-.34-.12-.32-.16-.31-.17L7.32,44l-.26-.22-.19-.2a2.44,2.44,0,0,1-.2-.28,1.75,1.75,0,0,1-.26-.58c0-.07,0-.13-.06-.2a2.73,2.73,0,0,1-.06-.64,2.92,2.92,0,0,1,.09-.63c0-.07,0-.14.07-.21a2,2,0,0,1,.29-.59,2.7,2.7,0,0,1,.19-.26L7.16,40l.22-.19a3.35,3.35,0,0,1,.3-.21l.21-.12a5.22,5.22,0,0,1,1.81-.55,8,8,0,0,1,1.12-.06c2.56,0,4.12,1.2,4.17,3,.06,1.95-1.59,3-4.24,3.22a10.76,10.76,0,0,1-1.08-.13A7.32,7.32,0,0,1,8.54,44.63ZM59.83,55.49a68.19,68.19,0,0,1-24.4,4.18,65.78,65.78,0,0,1-17.69-3.31c-4.63-1.52-7.36-4.57-7.93-9.17.27,0,.55,0,.84,0,4,0,7.58-2.46,7.58-5.29s-3.35-5.28-7.49-5.3c-.32,0-.63,0-.94,0,0-.36,0-.72,0-1.07.36-5.7.46-11.06-4.1-15.67-3.86-3.9-.18-6.6,2.69-8.85s5.72-5.48,9.37-1.31c1.88,2.15,4,2.62,6.67,2.23a108.27,108.27,0,0,1,27.4-.53c2.36.25,4.33-.19,5.72-2.16,2.41-3.43,5-2.89,8.14-.89,7.37,4.78,7.79,6.1,2.83,13.28a9.54,9.54,0,0,0-1.83,6.5c.2,2.59.36,5.19.52,7.78-.27,0-.54,0-.82,0-4.26,0-7.43,2.2-7.46,5.24s3.19,5.32,7.37,5.35a9.66,9.66,0,0,0,1.27-.08C67.06,50.83,64.57,53.82,59.83,55.49Zm10.8-13.71c0,.07,0,.14-.06.21a2.48,2.48,0,0,1-.12.34,2.41,2.41,0,0,1-.13.24,2.47,2.47,0,0,1-.16.24,2.59,2.59,0,0,1-.21.25l-.15.14a4.64,4.64,0,0,1-2.08,1,9.25,9.25,0,0,1-1.29.2c-2.78-.2-4.52-1.25-4.46-3.18s1.79-3.08,4.53-3a7.67,7.67,0,0,1,.87.06l.36.07.41.08.33.11.35.13.29.14.3.17.23.17.25.22.18.19a2.63,2.63,0,0,1,.2.28c0,.07.09.13.12.2a2.6,2.6,0,0,1,.14.36c0,.06,0,.12.06.19a2.9,2.9,0,0,1,.08.61A3,3,0,0,1,70.63,41.78Z" />
  </svg>
</div>
<button class="answerbtn" onclick="location.reload()">Reload</button>
`;
  return markup;
}
