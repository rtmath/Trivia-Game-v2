function Game()
{
  this.gameModes = ["ironman", "multiplayer"];
  this.categories = {
    "general knowledge": 9,
    "books": 10,
    "film": 11,
    "music": 12,
    "video games": 15,
    "science and nature": 17,
    "computer science": 18,
    "mythology": 20,
    "sports": 21,
    "geography": 22,
    "history": 23,
  };
  this.gameMode = null;
  this.round = 1;
  this.currentTurn = 1;
  this.roundQuestions = [];
  this.questionsPerRound = 0;
  this.numberOfRounds = 0;
}

Game.prototype.nextTurn = function() {
  this.currentTurn ^= 1;
  return (this.currentTurn + 1);
};

Game.prototype.checkAnswers = function(answer, qNumber) {
  var instance = this;
  var points = 0;
  console.log(instance.roundQuestions[qNumber].question + ": " + qNumber);
  switch (instance.roundQuestions[qNumber].difficulty) {
    case "easy":
      points++;
      break;
    case "medium":
      points += 2;
      break;
    case "hard":
      points += 3;
      break;
    default:
      console.log("Difficulty error");
      points++;
      break;
  }
  var correctAnswer = instance.roundQuestions[qNumber].correct_answer;
  console.log("Correct answer is " + correctAnswer);
  return (answer === correctAnswer) ? points : 0;
};

Game.prototype.DecodeQuestions = function()
{
  var instance = this;
  console.log(instance.roundQuestions.length);
  for (var questionIndex = 0; questionIndex < instance.roundQuestions.length; questionIndex++) {
    var question = instance.roundQuestions[questionIndex];
    for (var key in question) {
      if (key === "incorrect_answers")
      {
        var incorrectAnswers = question[key];
        for (var answerIndex = 0; answerIndex < incorrectAnswers.length; answerIndex++) {
          incorrectAnswers[answerIndex] = atob(incorrectAnswers[answerIndex]);
        }
      } else {
        var value = question[key];
        question[key] = atob(value);
      }
    }
  }
};

Game.prototype.GetQuestions = function(number, category)
{
  var instance = this;
  var token;
  // $.get("https://www.opentdb.com/api_token.php?command=request").then(function(response) {token = response;});
  $.get("https://www.opentdb.com/api.php?amount=" + number.toString() + "&category=" + category + "&type=multiple&encode=base64").then(function(response)
  {
    instance.roundQuestions = response.results;
    instance.DecodeQuestions();
  }).fail(function(error)
  {
    console.log(error);
  });

};

Game.prototype.sortAnswers = function(qNumber) {
  var instance = this;
  var question = instance.roundQuestions[qNumber];
  var answers = [];
  answers.push(question.correct_answer);
  for (var i = 0; i < question.incorrect_answers.length; i++) {
    answers.push(question.incorrect_answers[i]);
  }
  return answers.sort();
};

exports.TriviaGameModule = Game;
