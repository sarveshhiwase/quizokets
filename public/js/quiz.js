const quiz = document.getElementById("quiz");
const answerEls = document.querySelectorAll(".answer");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submit");
const buzzerBtn = document.getElementById("buzzer");
let currentQuiz = 0;
let score = 0;
//Questions for quiz
let quizData = [];
let x;
let timerCount = 10;

const timerEl = document.getElementById("timer");

questionEl.classList.add("grayLoad");
answerEls.forEach((answerEl) => {
  answerEl.nextElementSibling.classList.add("grayLoad", "color");
});
socket.on("gamestarted", (questions) => {
  console.log(questions);
  quizData = questions;
  renderLogic();
  questionEl.classList.remove("grayLoad");
  answerEls.forEach((answerEl) => {
    answerEl.nextElementSibling.classList.remove("grayLoad", "color");
  });
  loadQuiz();
});

function loadQuiz() {
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
  timer(timerCount);
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
    }

    currentQuiz++;

    //socket.emit("stopcount");
    socket.emit("indexhaschanged", currentQuiz);
  }
});

buzzerBtn.addEventListener("click", () => {
  socket.emit("buzzer");
});

socket.on("buzzerPressed", () => {
  clearInterval(x);
  timer(timerCount);
  disable();
});

socket.on("buzzerEnable", () => {
  enable();
});

socket.on("nextquestion", (ind) => {
  clearInterval(x);
  currentQuiz = ind;
  enable();
  if (currentQuiz < quizData.length) {
    loadQuiz();
  } else {
    quiz.innerHTML = `
              <h2>You answered correctly at ${score}/${quizData.length} questions.</h2>
              
              <button onclick="location.reload()">Reload</button>
          `;
    timerEl.innerHTML = "";
  }
});

function timer(time) {
  x = setInterval(function () {
    time -= 1;

    // Display the result in the element with id="timer"
    timerEl.innerHTML = time + "s ";

    // If the count down is finished, write some text
    if (time <= 0) {
      clearInterval(x);
      timerEl.innerHTML = "EXPIRED";
      currentQuiz++;
      socket.emit("indexhaschanged", currentQuiz);
    }
  }, 1000);
}

function enable() {
  buzzerBtn.removeAttribute("disabled");
  submitBtn.removeAttribute("disabled");
}
function disable() {
  buzzerBtn.setAttribute("disabled", "disabled");
  submitBtn.setAttribute("disabled", "disabled");
}
