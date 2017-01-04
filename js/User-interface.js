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
