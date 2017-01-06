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
