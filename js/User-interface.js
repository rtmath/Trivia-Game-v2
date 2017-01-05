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
