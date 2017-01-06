(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
function User(name)
{
  this.name = name;
  this.score = 0;
}

exports.UserModule = User;

},{}],3:[function(require,module,exports){
var User = require('./../js/User.js').UserModule;
var Game = require("./../js/TriviaGame.js").TriviaGameModule;

var nextQuestion = function(gameInstance, qNumber){
  qNumber++;
  if (qNumber < gameInstance.questionsPerRound){
    setTimeout(function() {
      $('#question').empty();
      $("#question").removeClass();
      $("#question").addClass(gameInstance.roundQuestions[qNumber].difficulty);
      $('#question').text(gameInstance.roundQuestions[qNumber].question);
      $('#answers1').empty();
      $('#answers2').empty();
      $('#round-screen').slideDown(2000);
      var answers = gameInstance.sortAnswers(qNumber);
      for (var i = 0; i < answers.length; i++) {
        $('#answers1').append("<label><input type='radio' name='answer1' value='"+ answers[i] + "'> <span class='labelinput'>" + answers[i] + "</label></br>");
        $('#answers2').append("<label><input type='radio' name='answer2' value='"+ answers[i] + "'> <span class='labelinput'>" + answers[i] + "</span></label></br>");
      }
    }, 1000);
  } else if (gameInstance.round < gameInstance.numberOfRounds){
    console.log("next round");
    gameInstance.round++;
    qNumber = 0;
    $("#user-turn").text(gameInstance.nextTurn());
    $("#inter-round-screen").slideDown(1500);
    $("#round-screen").slideUp(1500);
  } else {
    $("#game-container").slideUp();
    $(".restart").show();
    qNumber = 0;
  }
  return qNumber;
};

$(document).ready(function()
{
  var game = null;
  var player1 = null;
  var player2 = null;
  var qNumber = -1;

  $('#settings').submit(function(event) {
    event.preventDefault();
    game = new Game();
    qNumber = -1;
    $("#user-turn").text(game.nextTurn());
    player1 = new User($('#playerName1').val());
    $(".player1Name").text(player1.name);
    player2 = new User($('#playerName2').val());
    $(".player2Name").text(player2.name);
    game.questionsPerRound = parseInt($('#numQuestions').val());
    game.numberOfRounds = parseInt($('#numRounds').val());
    $("#settings-container").hide();
    $("#game-container").show();
    $("#inter-round-screen").show();
    $("#round-screen").hide();
    $("#categorySelect").empty();
    for(var key in game.categories) {
      if (!game.categories.hasOwnProperty(key)) {
        continue;
      }
      $("#categorySelect").append('<option value="' + game.categories[key] + '">' + key + "</option>");
    }
  });

  $("#get-questions").click(function(){
    qNumber = -1;
    game.GetQuestions(game.questionsPerRound, $("#categorySelect").val());
    $("#inter-round-screen").hide();
    $("#round-screen").slideDown(2400);
    $('.player1ScoreContainer').fadeIn(2400);
    $('.player2ScoreContainer').fadeIn(2400);
    $('.correct-answer').show();
    qNumber = nextQuestion(game, qNumber);
  });

  $('#submitAnswers').click(function() {
    var player1Score = player1.score;
    var player2Score = player2.score;
    var player1Answer = $('#answers1 input:radio:checked').val();
    var player2Answer = $('#answers2 input:radio:checked').val();
    player1.score += game.checkAnswers(player1Answer, qNumber);
    player2.score += game.checkAnswers(player2Answer, qNumber);
    var correctAnswer = game.roundQuestions[qNumber].correct_answer;
    $('.correct-answer').text("Correct answer: " + correctAnswer);
    if (player1Score != player1.score) {
      $('.player1ScoreContainer').addClass("greenHighlight");
      setTimeout(function(){
        $('.player1ScoreContainer').removeClass("greenHighlight");
        $('.correct-answer').empty();
      }, 4000);
    }
    else {
      $('.player1ScoreContainer').addClass("redHighlight");
      setTimeout(function(){
        $('.player1ScoreContainer').removeClass("redHighlight");
        $('.correct-answer').empty();
      }, 4000);
    }
    if (player2Score != player2.score) {
      $('.player2ScoreContainer').addClass("greenHighlight");
      setTimeout(function(){
        $('.player2ScoreContainer').removeClass("greenHighlight");
      }, 4000);
    }
    else {
      $('.player2ScoreContainer').addClass("redHighlight");
      setTimeout(function(){
        $('.player2ScoreContainer').removeClass("redHighlight");
      }, 4000);
    }
    $("#player1Score").text(player1.score);
    $("#player2Score").text(player2.score);
    $("#round-screen").slideUp(1000);
    qNumber = nextQuestion(game, qNumber);
  });

  $(".restart").click(function() {
    $("#player1Name").attr("value", player1.name);
    $("#player2Name").attr("value", player2.name);
    $(".restart").hide();
    $('.player1ScoreContainer').hide();
    $('.player2ScoreContainer').hide();
    $("#settings-container").show();
    $("#player1Score").text("");
    $("#player2Score").text("");
  });
});

},{"./../js/TriviaGame.js":1,"./../js/User.js":2}]},{},[3]);
