function Game()
{
  this.gameModes = ["ironman", "multiplayer"];
  this.categories = {
    "General Knowledge": 9,
    "Books": 10,
    "Film": 11,
    "Music": 12,
    "Video Games": 15,
    "Science and Nature": 17,
    "Computer Science": 18,
    "Mythology": 20,
    "Sports": 21,
    "Geography": 22,
    "History": 23,
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
