var User = require('./../js/User.js').UserModule;
var Game = require("./../js/TriviaGame.js").TriviaGameModule;

$(document).ready(function()
{
  var game = new Game();
  var player1 = null;
  var player2 = null;
  $('#settings').submit(function(event) {
    event.preventDefault();
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

  $("#get-questions").click(function(){
    game.GetQuestions(game.questionsPerRound, $("#categorySelect").val());
    setTimeout(function() {
      var answers = game.sortAnswers(1);
      for (var i = 0; i < answers.length; i++) {
        $('#answers1').append("<input type='radio' name='answer1' value='"+ answers[i] + "'>" + answers[i] + "</br>");
        $('#answers2').append("<input type='radio' name='answer2' value='"+ answers[i] + "'>" + answers[i] + "</br>");
      }
      // $("#answers1:first-child").attr("checked", "checked");
      // $("#answers2:first-child").attr("checked", "checked");
    }, 1000);

    $('#submitAnswers').click(function() {
      var player1Answer = $('#answers1 input:radio:checked').val();
      var player2Answer = $('#answers2 input:radio:checked').val();
      player1.score += game.checkAnswers(player1Answer, game.round);
      player2.score += game.checkAnswers(player2Answer, game.round);
      console.log(player1.score);
      console.log(player2.score);
    });
  });
});
