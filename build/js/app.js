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

$(document).ready(function()
{
  $('#settings').submit(function(event) {
    event.preventDefault();
    var player1 = $('#playerName1').val();
    var player2 = $('#playerName2').val();
    var numRounds = $('#numRounds').val();
    var numQuestions = $('#numQuestions').val();
  });
});

},{"./../js/TriviaGame.js":1,"./../js/User.js":2}]},{},[3]);
