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
}

Game.prototype.GetQuestions = function(number, category)
{
  var instance = this;
  $.get("https://www.opentdb.com/api.php?amount=" + number.toString() + "&category=" + instance.categories[category].toString()).then(function(response)
  {
    instance.roundQuestions = response.results;
  }).fail(function(error)
  {
    //show error
  });
};

exports.TriviaGameModule = Game;
