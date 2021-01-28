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
    // console.log("CLIENT: " + strData);
  }

  conn.sendChatMessage = function(msg){
    var data = {
      action: "msg_global",
      msg: {
        username: client_username,
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
    // console.log(data);
    switch (data.action) {
      case "update_board":
      // console.log("UPDATE");
      updateBoard(data.data);
      break;
      case 'team_select':
      if(data.type == "request"){
        var interface = document.getElementById('teamButtons');
        interface.innerHTML = `
        <button type="button" name="team1" onclick="selectTeam(1)">Team 1</button>
        <button type="button" name="team2" onclick="selectTeam(2)">Team 2</button>
        `
      } else if(data.type == "response"){
        if(data.response == "true"){
          //YAAAAY
        } else {
          //NAAAAY
        }
      }
      break;
      case 'move_response':
      if(data.result){
        $("#" + data.card_id + "_card").addClass("tic_disabled");
      }
      state.busy = false;
      break;
      case 'playability':
      data.cards.forEach((c) => {
        var card = $("#" + c.id + "_card");
        if(c.playable){
          card.addClass("tic_unplayable");
        } else {
          card.removeClass("tic_unplayable");
        }
      });
      break;
      case 'deal':{
        data.cards.forEach((c) => {
          console.log(c);
          addCard(c);
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

  var interface = document.getElementById('teamButtons');
  interface.innerHTML = "";

}
