/* Tic Online is an online multiplayer board game.
Copyright (C) 2021  Nils Ramstöck

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>. */

var connection;

function connectToServer(conn) {

  conn = new WebSocket('ws://localhost:8080');
  // conn = new WebSocket('wss://tic.nilsramstoeck.net/ws/');

  conn.sendJSON = function(json){
    var strData = JSON.stringify(json);
    connection.send(strData);
    console.log("CLIENT: " + strData);
  }

  conn.sendChatMessage = function(msg){
    var data = {
      action: "msg_global",
      msg: {
        user_id: user_id,
        room_code: room_code,
        text: msg
      }
    }
    conn.sendJSON(data);
  }

  conn.onopen = function () {
    //INIT CONNECTION
    var data = {
      action: "init",
      username: client_username,
      user_id: user_id,
      room_code: room_code
    };
    conn.sendJSON(data);
  };

  // Log errors
  conn.onerror = function (error) {
    console.log('WebSocket Error ' + error);
  };

  // Log messages from the server
  conn.onmessage = function (e) {
    // console.log('SERVER:');
    let data = JSON.parse(e.data);
    console.log(data);
    switch (data.action) {
      case "update_board":
      $('#menu').css("display", "none");
      var resize = $('#game').css("display") == 'none';
      $('#game').css("display", "");
      // console.log("UPDATE");
      updateBoard(data.data);
      if(resize)updateCanvasSize();
      break;
      case 'undo_response':
      $("#" + data.card_id + "_card").replaceWith(getCardHTML(data, data.card_id));
      $("#" + data.card_id + "_card").addClass("tic_selected");
      enableCards();
      state.busy = false;
      console.log(data);

      break;
      case 'team_select':
      if(data.type == "request"){
        $('#menu').css("display", "");
      } else if(data.type == "response"){
        if(data.response == "true"){
          //YAAAAY
        } else {
          //NAAAAY
        }
      }
      break;
      case "start_turn":
      checkPlayability();
      enableCards();
      console.log("START TURN");
      break;
      case 'player_info':
      data.players.forEach((player) => {
        startAreas.forEach((h) => {
          if(h.id.split("_")[1] == player.id){
            h.owner = player.username;
            if(player.user_id == user_id){
              playingAs = player.id;
              player_id = player.id;
              updateBoardRotation();
            }
          }
        });
      });
      break;
      case 'controll_teammate':
      console.log("NOW PLAYING AS:" + data.teammate);
      playingAs = data.teammate;
      break;
      case "start_round":
      enableSwap();
      break;
      case "swap_card_response":
      console.log(data);
      if(data.result){
        disableSwap();
        state.busy = false;
      }
      break;
      case 'team_update':
      $(".team_members").html("");
      data.players.forEach((p) => {
        var team = parseInt(p.team) + 1;
        $("#" + team + "_team_members").append(`<span class="team_member">${p.username}<span><br>`)
      });

      break;
      case 'move_response':
      if(data.result){
        $("#" + data.card_id + "_card").remove();
        $(".tic_card").removeClass("tic_unplayable");
      } else {
        enableCards();
      }
      state.busy = false;
      break;
      case 'playability':
      console.log(data);
      var throwaway = true;
      data.cards.forEach((c) => {
        var card = $("#" + c.id + "_card");
        if(c.playable){
          throwaway = false;
          card.removeClass("tic_unplayable");
        } else {
          card.addClass("tic_unplayable");
        }
      });
      if(throwaway){
        disableCards();
        enableThrowaway();
      }
      break;
      case 'deal':{
        $("#hand_cards").html("");
        data.cards.forEach((c) => {
          console.log(c);
          $("#hand_cards").append(getCardHTML(c, $('.tic_card').length));
        });

      }
    }
  };
  return conn;
}

function selectTeam(team) {
  var data = {
    user_id: user_id,
    room_code: room_code,
    action: "team_select",
    team_id: team-1
  };
  connection.sendJSON(data);
}

$(".team_btn").on("click", function(){
  selectTeam(parseInt($(this).prop("id").split()[0]));
});
