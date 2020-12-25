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
    quiz.innerHTML = `
              <h2>You answered correctly at ${score}/${quizData.length} questions.</h2>
              
              <button class="answerbtn" onclick="location.reload()">Reload</button>
          `;
  }
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
  let strtime = time;
  if (time < 10) {
    strtime = "0" + time;
    return strtime;
  }
  strtime = time;
  return strtime;
}
