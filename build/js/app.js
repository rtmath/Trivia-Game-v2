(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
function User(name)
{
  this.name = name;
  this.score = 0;
}

exports.UserModule = User;

},{}],3:[function(require,module,exports){
var Game = require("./../js/TriviaGame.js").TriviaGameModule;

$(document).ready(function()
{
  
});

var User = require('./../js/User.js').UserModule;
var Game = require("./../js/TriviaGame.js").TriviaGameModule;

var nextQuestion = function(gameInstance, qNumber){
  if (qNumber < gameInstance.numberOfRounds){
    setTimeout(function() {
      $('#answers1').empty();
      $('#answers2').empty();
      $('#question').empty();
      $('#question').text(gameInstance.roundQuestions[qNumber-1].question);
      var answers = gameInstance.sortAnswers(qNumber);
      for (var i = 0; i < answers.length; i++) {
        $('#answers1').append("<input type='radio' name='answer1' value='"+ answers[i] + "'>" + answers[i] + "</br>");
        $('#answers2').append("<input type='radio' name='answer2' value='"+ answers[i] + "'>" + answers[i] + "</br>");
      }
      // figure out way to have one answer checked by default
    }, 1000);
  } else {
    gameInstance.round++;
    //go to inter-round screen, hide game screen
  }
}

$(document).ready(function()
{
  var game = new Game();
  var player1 = null;
  var player2 = null;
  $('#settings').submit(function(event) {
    event.preventDefault();
    $("#user-turn").text((game.round%2)+1);
    player1 = new User($('#playerName1').val());
    $(".player1Name").text(player1.name);
    player2 = new User($('#playerName2').val());
    $(".player2Name").text(player2.name);
    game.questionsPerRound = parseInt($('#numQuestions').val());
    game.numberOfRounds = parseInt($('#numRounds').val());
    //#settings-container hide
    $("#categorySelect").empty();
    for(var key in game.categories) {
      if (!game.categories.hasOwnProperty(key)) {
        continue;
      }
      $("#categorySelect").append('<option value="' + game.categories[key] + '">' + key + "</option>");
    }
  });

  var qNumber = 1;
  $("#get-questions").click(function(){
    qNumber = 1;
    game.GetQuestions(game.questionsPerRound, $("#categorySelect").val());
    nextQuestion(game, qNumber);
  });

  $('#submitAnswers').click(function() {
    qNumber++;
    var player1Answer = $('#answers1 input:radio:checked').val();
    var player2Answer = $('#answers2 input:radio:checked').val();
    player1.score += game.checkAnswers(player1Answer, game.round);
    player2.score += game.checkAnswers(player2Answer, game.round);
    $("#player1Score").text(player1.score);
    $("#player2Score").text(player2.score);
    nextQuestion(game, qNumber);
  });
});

},{"./../js/TriviaGame.js":1,"./../js/User.js":2}]},{},[3]);
