const axios = require("axios");

const getQuestions = async (limit, categoryValue) => {
  if (categoryValue !== "any") {
    categoryValue = `&category=${categoryValue}`;
  } else {
    categoryValue = "";
  }

  let quizQuestions = [];
  const apiUrl = `https://opentdb.com/api.php?amount=${limit}&difficulty=easy&type=multiple${categoryValue}`;

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

// let token = null;

// const apiUrl = `https://opentdb.com/api_token.php?command=request`;

// const questionUrl = (token, limit, categoryValue) =>
//   `https://opentdb.com/api.php?amount=${limit}&difficulty=easy&type=multiple${categoryValue}&token=${token}`;

// const getQuestions = async (limit, categoryValue) => {
//   if (categoryValue !== "any") {
//     categoryValue = `&category=${categoryValue}`;
//   } else {
//     categoryValue = "";
//   }
//   let questions = [];
//   if (!token) {
//     await getToken();
//   }
//   const { response_code: rc, results: resultParent } = await jsonData(
//     limit,
//     categoryValue
//   );

//   if (rc === 4) {
//     await getToken();
//     const { results } = await jsonData(limit, categoryValue);
//     results.forEach((el) => {
//       const answers = {
//         a: el.incorrect_answers[0],
//         b: el.incorrect_answers[1],
//         c: el.incorrect_answers[2],
//         d: el.correct_answer,
//       };

//       questions.push({
//         question: el.question,
//         ...answers,

//         correct: el.correct_answer,
//       });
//     });
//   } else {
//     resultParent.forEach((el) => {
//       const answers = {
//         a: el.incorrect_answers[0],
//         b: el.incorrect_answers[1],
//         c: el.incorrect_answers[2],
//         d: el.correct_answer,
//       };

//       questions.push({
//         question: el.question,
//         ...answers,

//         correct: el.correct_answer,
//       });
//     });
//   }

//   return questions;
// };

// async function jsonData(limit, categoryValue) {
//   const result = await axios(questionUrl(token, limit, categoryValue));
//   return result.data;
// }

// const getToken = async () => {
//   const result = await axios(apiUrl);
//   token = result.data.token;
// };
