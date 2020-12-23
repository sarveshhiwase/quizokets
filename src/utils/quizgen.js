const axios = require("axios");

const getQuestions = async () => {
  let quizQuestions = [];
  const apiUrl = `https://opentdb.com/api.php?amount=4&difficulty=easy&type=multiple`;
  const jsondata = await axios(apiUrl);
  const array = jsondata.data.results;

  array.forEach((el) => {
    const answers = {
      a: el.incorrect_answers[0],
      b: el.incorrect_answers[1],
      c: el.incorrect_answers[2],
      d: el.correct_answer,
    };

    quizQuestions.push({
      question: el.question,
      ...answers,

      correct: el.correct_answer,
    });
  });

  return quizQuestions;
};

module.exports = getQuestions;
