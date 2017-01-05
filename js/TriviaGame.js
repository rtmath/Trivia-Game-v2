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
  this.round = 0;
  this.roundQuestions = [];
  this.questionsPerRound = 0;
  this.numberOfRounds = 0;
}

Game.prototype.checkAnswers = function(answer, qNumber) {
  var instance = this;
  var points = 0;
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

Game.prototype.GetQuestions = function(number, category)
{
  var instance = this;
  var token;
  // $.get("https://www.opentdb.com/api_token.php?command=request").then(function(response) {token = response;});
  $.get("https://www.opentdb.com/api.php?amount=" + number.toString() + "&category=" + category + "&type=multiple").then(function(response)
  {
    instance.roundQuestions = response.results;
  }).fail(function(error)
  {
    console.log(error);
  });

};

Game.prototype.sortAnswers = function(qNumber) {
  var instance = this;
  var question = instance.roundQuestions[qNumber-1];
  var answers = [];
  answers.push(question.correct_answer);
  for (var i = 0; i < question.incorrect_answers.length; i++) {
    answers.push(question.incorrect_answers[i]);
  }
  return answers.sort();
};

exports.TriviaGameModule = Game;
